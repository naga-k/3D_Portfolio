// app/components/FileUpload.tsx
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateFile } from '../utils/urlUtils';

export default function FileUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = () => reject(reader.error);
      });

      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      // Navigate to viewer with base64 data
      const params = new URLSearchParams({
        fileData: base64Data,
        name: file.name,
        description: `Local file: ${file.name}`
      });

      router.push(`/viewer?${params}`);
    } catch (error: any) {
      setError(error.message || 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer?.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center
          ${isProcessing ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          transition-colors duration-200`}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".splat,.ply"
          onChange={onFileSelect}
          disabled={isProcessing}
        />
        
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600">Processing file...</p>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="cursor-pointer space-y-2"
          >
            <div className="text-4xl mb-4">📁</div>
            <div className="font-medium text-gray-700">
              Drag and drop your file here or click to browse
            </div>
            <p className="text-sm text-gray-500">
              Supports .splat and .ply files up to 500MB
            </p>
          </label>
        )}

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}