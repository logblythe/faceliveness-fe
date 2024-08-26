export interface ISessionResult {
  $metadata: Metadata;
  AuditImages: AuditImage[];
  Confidence: number;
  ReferenceImage: ReferenceImage;
  SessionId: string;
  Status: string;
}

export interface Metadata {
  httpStatusCode: number;
  requestId: string;
  attempts: number;
  totalRetryDelay: number;
}

export interface AuditImage {
  BoundingBox: BoundingBox;
  S3Object: S3Object;
}

export interface BoundingBox {
  Height: number;
  Left: number;
  Top: number;
  Width: number;
}

export interface S3Object {
  Bucket: string;
  Name: string;
  Version: string;
}

export interface ReferenceImage {
  BoundingBox: BoundingBox2;
  S3Object: S3Object2;
}

export interface BoundingBox2 {
  Height: number;
  Left: number;
  Top: number;
  Width: number;
}

export interface S3Object2 {
  Bucket: string;
  Name: string;
  Version: string;
}
