import { Injectable } from '@nestjs/common';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
} from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;
  private accountName: string;
  private accountKey: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_BLOB_CONTAINER;
    this.accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
    this.accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;

    if (!connectionString)
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not defined');
    if (!containerName) throw new Error('AZURE_BLOB_CONTAINER is not defined');
    if (!this.accountName || !this.accountKey)
      throw new Error('AZURE_ACCOUNT_NAME or AZURE_ACCOUNT_KEY not set');

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerName = containerName;
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; blobName: string }> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const extension = file.originalname.split('.').pop();
    const blobName = `${uuidv4()}.${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return { url: blockBlobClient.url, blobName };
  }

  async deleteFileByUrl(fileUrl: string): Promise<void> {
    const blobName = this.extractBlobName(fileUrl);
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  }

  extractBlobName(url: string): string {
    // Ex: https://conta.blob.core.windows.net/container/abc123.pdf
    const u = new URL(url);
    const parts = u.pathname.split('/'); // ['', 'container', 'blobname...']
    return parts.slice(2).join('/'); // remove '', 'container'
  }

  async generateSasUrl(
    fileUrl: string,
    expiresInMinutes = 15,
  ): Promise<string> {
    const blobName = this.extractBlobName(fileUrl);
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlobClient(blobName);

    const permissions = BlobSASPermissions.parse('r');
    const expiresOn = new Date(Date.now() + expiresInMinutes * 60000);

    const sas = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName,
        expiresOn,
        permissions,
        protocol: SASProtocol.Https,
      },
      new StorageSharedKeyCredential(this.accountName, this.accountKey),
    ).toString();

    return `${blobClient.url}?${sas}`;
  }
}
