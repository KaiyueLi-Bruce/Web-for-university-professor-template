/**
 * Common utility functions shared across the application
 */

export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  const base = import.meta.env.BASE_URL;
  return base + path.replace(/^\//, '');
}

export const IMAGE_ERROR_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23e2e8f0"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%2394a3b8"%3E加载失败%3C/text%3E%3C/svg%3E';

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
