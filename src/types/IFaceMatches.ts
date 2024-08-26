export interface IFaceMatch {
  faceMatches: FaceMatch[];
}

export interface FaceMatch {
  Face: Face;
  Similarity: number;
}

export interface Face {
  BoundingBox: BoundingBox;
  Confidence: number;
  ExternalImageId: string;
  FaceId: string;
  ImageId: string;
  IndexFacesModelVersion: string;
}

export interface BoundingBox {
  Height: number;
  Left: number;
  Top: number;
  Width: number;
}
