// /app/viewer/components/SplatViewer.tsx
'use client';

import React, { useRef, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, PerspectiveCamera, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraController } from './CameraController';
import { ControlsUI } from './ControlsUI';
import { SceneSetup } from './SceneSetup';
// import { CameraInfo } from './CameraInfo';
import * as THREE from 'three'; 
import { ErrorBoundary } from 'react-error-boundary';

interface SplatViewerProps {
  splatUrl: string | null;
  onClose: () => void;
}

export default function SplatViewer({ splatUrl, onClose }: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  // Create GridHelper using useMemo to prevent re-creation on every render
  const gridHelper = useMemo(() => new THREE.GridHelper(100, 100, 'white', 'gray'), []);

  if (!splatUrl) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <p>No Splat to display.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-50">
      <ControlsUI onReset={handleReset} onClose={onClose} />
      <Canvas>
        <ErrorBoundary 
          fallback={
            <Html center>
              <div className="text-center">
                <p className="text-red-500">Failed to load Splat</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                  Go Home
                </button>
              </div>
            </Html>
          }
        >
          <Stats />
          <PerspectiveCamera makeDefault position={[0.40, 0.08, -0.42]} fov={75} near={0.1} far={1000} />
          <CameraController />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={5}
            minDistance={0.5}
            maxPolarAngle={Math.PI * 0.75}
            minPolarAngle={Math.PI * 0.25}
            target={[0, 0, 0]}
          />
          <SceneSetup splatUrl={splatUrl} />
          <primitive object={gridHelper} />
          {/* <CameraInfo /> */}
        </ErrorBoundary>
      </Canvas>
    </div>
  );
}