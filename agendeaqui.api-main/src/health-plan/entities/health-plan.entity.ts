export class HealthPlan {
  id: string;
  healthOperatorId: string;
  number: string;
  validUntil: Date;
  planName: string;
  situation: string;
  accommodation: string;
  createdAt: Date;
  updatedAt: Date;
  patientId?: string;
}
