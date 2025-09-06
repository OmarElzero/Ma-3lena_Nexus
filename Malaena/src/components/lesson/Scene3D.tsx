import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import { AudioManager } from './AudioManager';
interface Scene3DProps {
  sceneType: 'pyramid' | 'atom' | 'dna' | 'solar-system';
  isRotating: boolean;
  zoom: number;
}

const sceneModels: Record<string, string> = {
  pyramid: '/models/pyramid.glb',
  atom: '/models/atom.glb',
  dna: '/models/dna.glb',
  'solar-system': '/models/solar_system.glb',
};

function Model({ url, isRotating }: { url: string; isRotating: boolean }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (isRotating && ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={ref} object={scene} scale={2} />;
}

export function Scene3D({ sceneType, isRotating, zoom }: Scene3DProps) {
  const modelUrl = sceneModels[sceneType] || sceneModels['pyramid'];
  const [isMuted, setIsMuted] = useState(false);
  return (
    <div className="w-full h-full bg-white rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          autoRotate={false}
        />

        <Suspense fallback={null}>
          <Model url={modelUrl} isRotating={isRotating} />
        </Suspense>
      </Canvas>
      <AudioManager
        sceneType={sceneType}
        isPlaying={true}
        isMuted={isMuted}
        onMuteToggle={() => setIsMuted(!isMuted)}
      />
    </div>
  );
}
