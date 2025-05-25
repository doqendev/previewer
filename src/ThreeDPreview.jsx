// ThreeDPreview.jsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, Html, useProgress } from '@react-three/drei'

// loader component to show progress while font JSON is loading
function Loader() {
  const { progress } = useProgress()
  return <Html center style={{ color: '#fff' }}>{progress.toFixed(0)}% loaded</Html>
}

export default function ThreeDPreview({ text, fontJsonUrl }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ width: '100%', height: 300 }}>
      {/* immediate lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* 3D text loads async */}
      <Suspense fallback={<Loader />}>
        <Center>
          {/* stroke geometry scaled outwards for outline */}
          <group scale={[1.05, 1.05, 1]}>
            <Text3D
              font={fontJsonUrl}
              size={1}
              height={0.3}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              curveSegments={12}
            >
              {text}
              <meshStandardMaterial color="#000" />
            </Text3D>
          </group>
          {/* white fill on top */}
          <Text3D
            font={fontJsonUrl}
            size={1}
            height={0.1}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            curveSegments={12}
            position={[0, 0, 0.3]}
          >
            {text}
            <meshBasicMaterial color="#fff" />
          </Text3D>
        </Center>
      </Suspense>
      <OrbitControls enableZoom enableRotate />
    </Canvas>
  )
}
