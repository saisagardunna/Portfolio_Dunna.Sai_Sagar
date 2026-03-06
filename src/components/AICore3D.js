import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const AnimatedSphere = ({ state }) => {
    const meshRef = useRef();

    useFrame((stateContext) => {
        if (meshRef.current) {
            const time = stateContext.clock.getElapsedTime();
            // Add some gentle rotation
            meshRef.current.rotation.x = time * 0.2;
            meshRef.current.rotation.y = time * 0.3;
        }
    });

    const getStateConfig = (s) => {
        switch (s) {
            case 'listening':
                return { color: '#ef4444', distort: 0.6, speed: 3 }; // Red, high distortion
            case 'thinking':
                return { color: '#f59e0b', distort: 0.4, speed: 5 }; // Gold, very fast
            case 'speaking':
                return { color: '#22c55e', distort: 0.3, speed: 2 }; // Green, moderate
            case 'idle':
            default:
                return { color: '#6366f1', distort: 0.3, speed: 1.5 }; // Blue, calm
        }
    };

    const config = getStateConfig(state);

    return (
        <Sphere ref={meshRef} visible args={[1, 32, 32]} scale={2}>
            <meshStandardMaterial
                color={config.color}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
};

const AICore3D = ({ currentState = 'idle' }) => {
    useEffect(() => {
        console.log("AICore3D mounted with state:", currentState);
    }, [currentState]);

    return (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 0, 3], fov: 75 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />
                <AnimatedSphere state={currentState} />
            </Canvas>
        </div>
    );
};

export default AICore3D;
