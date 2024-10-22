import React, { useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Splat, Stats } from '@react-three/drei';

interface ViewerProps {
  splatSrc: string;
  onClose: () => void;
}

const CameraController: React.FC = () => {
  const { camera } = useThree();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const speed = 0.1;

    switch (event.key) {
      case 'w':
        camera.position.z -= speed;
        break;
      case 's':
        camera.position.z += speed;
        break;
      case 'a':
        camera.position.x -= speed;
        break;
      case 'd':
        camera.position.x += speed;
        break;
      case 'ArrowUp':
        camera.position.y += speed;
        break;
      case 'ArrowDown':
        camera.position.y -= speed;
        break;
    }
  }, [camera]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
};

const Viewer: React.FC<ViewerProps> = ({ splatSrc, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm z-50">
      <div className="absolute top-0 right-0 p-4 cursor-pointer text-white" onClick={onClose}>
        Close
      </div>
      <div className="w-full h-full">
        <Canvas>
          <Stats />
          <OrbitControls
            maxDistance={2}
            minDistance={1}
            maxPolarAngle={Math.PI * 0.75}
            minPolarAngle={Math.PI * 0.75}
          />
          <Splat src={splatSrc} />
          <CameraController />
        </Canvas>
      </div>
    </div>
  );
};

export default Viewer;