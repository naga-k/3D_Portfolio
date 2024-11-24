export const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const extension = file.name.toLowerCase().split('.').pop();
    
    if (!extension || !['splat', 'ply'].includes(extension)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a .splat or .ply file'
      };
    }
  
    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      return {
        isValid: false,
        error: 'File size too large. Maximum size is 500MB'
      };
    }
  
    return { isValid: true };
  };