"use client";

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export default function ModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <div className="h-[400px] w-full mt-8">
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <Model url={modelPath} />
        <OrbitControls 
          enableZoom={true} 
          autoRotate={true}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
} 