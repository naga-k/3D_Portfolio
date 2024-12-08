// app/viewer/page.tsx
'use client';
import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import SplatViewer from './components/SplatViewer';

const Viewer: React.FC = () => {
  const router = useRouter();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewerContent router={router} />
    </Suspense>
  );
};

interface ViewerContentProps {
  router: AppRouterInstance;
}

const ViewerContent: React.FC<ViewerContentProps> = ({ router }) => {
  const searchParams = useSearchParams();
  const splatUrl = searchParams.get('splatUrl');
  const description = searchParams.get('description');
  const name = searchParams.get('name');

  useEffect(() => {
    if (splatUrl) {
      console.log("Params received:", { 
        splatUrl, 
        description, 
        name 
      });
    }
  }, [splatUrl, description, name]);

  const handleClose = () => {
    router.push('/');
  };

  return (
    <SplatViewer 
      splatUrl={splatUrl ? decodeURIComponent(splatUrl) : null}
      description={description ? decodeURIComponent(description) : 'No description available'}
      name={name ? decodeURIComponent(name) : 'Untitled'}
      onClose={handleClose}
    />
  );
};

export default Viewer;