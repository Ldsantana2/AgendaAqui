export type BlogPostStatus = 'SKETCH' | 'PUBLISHED' | 'INACTIVE';

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    tags: string[];
    summary: string;
    createdAt: Date;
    updatedAt: Date;
    image: string;
    links: string[];
    userId: string;
    status: BlogPostStatus
}
