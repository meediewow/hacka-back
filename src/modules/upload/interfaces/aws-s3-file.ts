export interface AwsS3File {
  bucket: string;
  key: string;
  region: string;
  url: string;
  md5Sum: string;
  originalName: string;
  mimeType: string;
  size: number;
}
