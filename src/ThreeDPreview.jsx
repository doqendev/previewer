// ThreeDPreview.jsx
import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'

// loader component to show progress while font JSON is loading
function Loader() {
  const { progress } = useProgress()
  return <Html center style={{ color: '#fff' }}>{progress.toFixed(0)}% loaded</Html>
}

export default function ThreeDPreview({ text, fontJsonUrl, useCustomBackground, customBgImgSrc }) {
  const containerRef = useRef()
  const [bgColor, setBgColor] = useState(new THREE.Color(0xffffff)) // Default white
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (useCustomBackground && customBgImgSrc) {
      const loader = new THREE.TextureLoader()
      loader.load(customBgImgSrc, (loadedTexture) => {
        setTexture(loadedTexture)
        setBgColor(null) // Clear color if texture is used
      }, undefined, (err) => {
        console.error('Failed to load custom background texture:', err)
        setTexture(null)
        // Fallback to a color if texture fails
        // For simplicity, let's use a default color, or you could use darkMode logic here if passed as a prop
        setBgColor(new THREE.Color(0x222222)) // Dark fallback
      })
    } else {
      setTexture(null)
      // Set background color based on some logic, e.g., a prop or a default
      // For now, let's assume a default or a simple toggle. If you have darkMode, use it.
      setBgColor(new THREE.Color(0xffffff)) // Default to white if no custom BG
                                          // Or use a prop for dark mode: new THREE.Color(darkMode ? 0x222222 : 0xffffff)
    }
  }, [useCustomBackground, customBgImgSrc])

  const fontUrl = `/fonts/${fontJsonUrl}.json`

  // Hardcoded colors for Metallica style
  const fillColor = '#FFFFFF' // White
  const strokeColor = '#000000' // Black

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Conditional background rendering */}
        {texture ? (
          <mesh scale={[1,1,1]} position={[0,0,-50]}> {/* Adjust scale/position as needed for background plane */}
            <planeGeometry args={[500, 500*9/16]} /> {/* Assuming 16:9 aspect for the image, adjust size */} 
            <meshBasicMaterial map={texture} />
          </mesh>
        ) : (
          <color attach="background" args={[bgColor]} />
        )}
        
        {/* immediate lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<Loader />}>
          <Center>
            {/* Stroke Layer (Black) - slightly behind */}
            <Text3D
              font={fontUrl}
              height={10}      // Depth of the extrusion
              lineHeight={0.8}
              letterSpacing={-0.05} // Adjust for Metallica style
              size={60}        // Font size
              bevelEnabled
              bevelSize={1.5}    // Bevel size for the stroke
              bevelThickness={2} // Bevel thickness for the stroke
              position={[0, 0, -0.1]} // Slightly behind the fill
            >
              {text || 'Metallica'}
              <meshStandardMaterial color={strokeColor} roughness={0.5} metalness={0.5} />
            </Text3D>

            {/* Fill Layer (White) - on top */}
            <Text3D
              font={fontUrl}
              height={8}       // Slightly less extrusion depth than stroke to ensure stroke is visible
              lineHeight={0.8}
              letterSpacing={-0.05}
              size={60}
              bevelEnabled
              bevelSize={0.75}   // Smaller bevel for the fill, or adjust as needed
              bevelThickness={1} // Smaller bevel thickness
              position={[0, 0, 0]} // On top
            >
              {text || 'Metallica'}
              <meshBasicMaterial color={fillColor} /> {/* Use meshBasicMaterial for a flat, unlit white */}
            </Text3D>
          </Center>
        </Suspense>
        <OrbitControls enableZoom enableRotate />
      </Canvas>
    </div>
  )
}
