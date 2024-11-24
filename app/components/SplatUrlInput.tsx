import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SplatUrlInput = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic URL validation
      new URL(url); // This will throw if URL is invalid
      
      const queryParams = new URLSearchParams({
        splatUrl: url,
        description: 'External Splat File',
        name: url.split('/').pop() || 'External Splat'
      });

      router.push(`/viewer?${queryParams}`);
    } catch (error) {
      alert('Please enter a valid URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter .splat file URL"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url}
          className={`px-6 py-2 rounded-lg text-white font-medium
            ${isLoading || !url 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-teal-500 hover:bg-teal-600 transition-colors duration-200'
            }`}
        >
          {isLoading ? 'Loading...' : 'View Splat'}
        </button>
      </form>
    </div>
  );
};

export default SplatUrlInput;