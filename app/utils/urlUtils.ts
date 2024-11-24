// app/utils/urlUtils.ts
const HF_DOMAIN = 'huggingface.co';
const VALID_EXTENSIONS = new Set(['.splat', '.ply']); // Using Set for O(1) lookup

/**
 * Validates if the given URL is a Hugging Face URL and has valid file extension
 */
export function isValidHuggingFaceUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes(HF_DOMAIN)) return false;
    
    const path = urlObj.pathname.toLowerCase();
    return [...VALID_EXTENSIONS].some(ext => path.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Converts various Hugging Face URL formats to a direct download URL
 */
function normalizeHuggingFaceUrl(url: string): string {
  // Handle hf:// protocol
  if (url.startsWith('hf://')) {
    return `https://${HF_DOMAIN}/${url.slice(5)}`;
  }

  // If already a raw/resolve URL, return as is
  if (url.includes('/resolve/') || url.includes('/raw/')) {
    return url;
  }

  // Convert blob URLs to resolve URLs for direct access
  return url.replace('/blob/', '/resolve/');
}

/**
 * Processes and validates a URL for splat file access
 */
export async function processUrl(url: string): Promise<string> {
  // Quick validation before processing
  if (!url?.trim()) {
    throw new Error('URL is required');
  }

  try {
    // Validate URL format and type
    if (!isValidHuggingFaceUrl(url)) {
      throw new Error('Invalid URL format. Please provide a valid Hugging Face URL with .splat or .ply extension');
    }

    // Normalize the URL
    const normalizedUrl = normalizeHuggingFaceUrl(url);

    // Validate accessibility with minimal overhead
    const response = await fetch(normalizedUrl, {
      method: 'HEAD',
      headers: {
        'Accept': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`File not accessible: ${response.statusText}`);
    }

    return normalizedUrl;
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to process URL';
    console.error('URL processing error:', errorMessage);
    throw new Error(`URL processing failed: ${errorMessage}`);
  }
}

// Export types for better TypeScript integration
export type ProcessUrlResult = {
  url: string;
  error?: string;
};

/**
 * Asynchronously process URL with error handling
 * Use this when you want to handle errors gracefully without try/catch
 */
export async function safeProcessUrl(url: string): Promise<ProcessUrlResult> {
  try {
    const processedUrl = await processUrl(url);
    return { url: processedUrl };
  } catch (error: any) {
    return {
      url: '',
      error: error.message
    };
  }
}