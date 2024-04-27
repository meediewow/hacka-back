// 500 Mb is the maximum file size allowed by admins

// 10 Mb
const MAX_IMAGE_SIZE = 10485760;

export const FILE_LIMITS: {
  maxSize: number;
  mimeType: string;
  extensions?: string[];
}[] = [
  // Images
  {
    mimeType: 'image/jpeg',
    maxSize: MAX_IMAGE_SIZE,
    extensions: ['jpg', 'jpeg']
  },
  {
    mimeType: 'image/png',
    maxSize: MAX_IMAGE_SIZE,
    extensions: ['png']
  },
  {
    mimeType: 'image/webp',
    maxSize: MAX_IMAGE_SIZE,
    extensions: ['webp']
  },
  {
    mimeType: 'image/gif',
    maxSize: MAX_IMAGE_SIZE,
    extensions: ['gif']
  }
];
