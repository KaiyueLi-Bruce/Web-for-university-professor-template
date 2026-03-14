const MAX_IMAGE_SIZE = 300 * 1024; // 300KB
const JPEG_QUALITY = 0.75;
const MAX_DIMENSION = 1920;

export interface ImageValidationResult {
  success: boolean;
  error?: string;
  base64?: string;
  originalSize?: number;
  compressedSize?: number;
}

/**
 * Validates image size and returns error message if exceeds limit
 */
function validateImageSize(file: File): string | null {
  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const limitMB = (MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(2);
    return `图片大小超过限制。当前: ${sizeMB}MB, 限制: ${limitMB}MB`;
  }
  return null;
}

/**
 * Resizes image if dimensions exceed MAX_DIMENSION while maintaining aspect ratio
 */
function resizeImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
): void {
  let { width, height } = img;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      height = (height * MAX_DIMENSION) / width;
      width = MAX_DIMENSION;
    } else {
      width = (width * MAX_DIMENSION) / height;
      height = MAX_DIMENSION;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
}

/**
 * Compresses image using Canvas API and converts to JPEG
 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('无法获取Canvas上下文'));
            return;
          }

          resizeImage(canvas, ctx, img);
          const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          resolve(base64);
        };

        img.onerror = () => {
          reject(new Error('图片加载失败'));
        };

        img.src = event.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates and processes image file with size limit and auto-compression
 * Returns base64 string if successful, error message if validation fails
 */
export async function processImage(file: File): Promise<ImageValidationResult> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      error: '请选择有效的图片文件',
    };
  }

  const originalSize = file.size;

  // Check initial size
  const sizeError = validateImageSize(file);
  if (sizeError) {
    return {
      success: false,
      error: sizeError,
      originalSize,
    };
  }

  try {
    // Compress image
    const base64 = await compressImage(file);

    // Calculate compressed size (rough estimate from base64 length)
    const compressedSize = Math.ceil((base64.length * 3) / 4);

    // Verify compressed image still meets size requirements
    if (compressedSize > MAX_IMAGE_SIZE) {
      return {
        success: false,
        error: `压缩后图片仍超过限制。请使用尺寸更小的图片`,
        originalSize,
        compressedSize,
      };
    }

    return {
      success: true,
      base64,
      originalSize,
      compressedSize,
    };
  } catch (error) {
    return {
      success: false,
      error: `图片处理失败: ${error instanceof Error ? error.message : '未知错误'}`,
      originalSize,
    };
  }
}
