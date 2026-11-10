import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Articulated Hand
function CyberneticHand({ activePose = 'OPEN_HAND' }) {
  const groupRef = useRef();
  const fingersRef = useRef({
    thumb: {},
    index: {},
    middle: {},
    ring: {},
    pinky: {}
  });

  // Target angles for each gesture pose
  // [MCP_curl, PIP_curl, DIP_curl]
  const poseConfigs = useMemo(() => ({
    OPEN_HAND: {
      thumb: { mcp: 0.1, pip: 0.1, dip: 0.05, splay: -0.35 },
      index: { mcp: 0.05, pip: 0.05, dip: 0.05, splay: -0.15 },
      middle: { mcp: 0.0, pip: 0.05, dip: 0.05, splay: 0.0 },
      ring: { mcp: 0.05, pip: 0.05, dip: 0.05, splay: 0.12 },
      pinky: { mcp: 0.1, pip: 0.1, dip: 0.05, splay: 0.25 },
    },
    FIST: {
      thumb: { mcp: 0.8, pip: 0.9, dip: 0.8, splay: 0.1 },
      index: { mcp: 1.45, pip: 1.5, dip: 1.2, splay: -0.05 },
      middle: { mcp: 1.5, pip: 1.55, dip: 1.25, splay: 0.0 },
      ring: { mcp: 1.45, pip: 1.5, dip: 1.2, splay: 0.05 },
      pinky: { mcp: 1.4, pip: 1.45, dip: 1.15, splay: 0.1 },
    },
    THUMBS_UP: {
      thumb: { mcp: -0.4, pip: -0.15, dip: -0.1, splay: -0.65 }, // extended upright
      index: { mcp: 1.45, pip: 1.5, dip: 1.2, splay: -0.05 },
      middle: { mcp: 1.5, pip: 1.55, dip: 1.25, splay: 0.0 },
      ring: { mcp: 1.45, pip: 1.5, dip: 1.2, splay: 0.05 },
      pinky: { mcp: 1.4, pip: 1.45, dip: 1.15, splay: 0.1 },
    },
    VICTORY: {
      thumb: { mcp: 0.75, pip: 0.85, dip: 0.8, splay: 0.2 },
      index: { mcp: 0.05, pip: 0.05, dip: 0.05, splay: -0.3 }, // extended & splayed
      middle: { mcp: 0.0, pip: 0.05, dip: 0.05, splay: 0.3 }, // extended & splayed
      ring: { mcp: 1.45, pip: 1.5, dip: 1.2, splay: 0.05 },
      pinky: { mcp: 1.4, pip: 1.45, dip: 1.15, splay: 0.1 },
    }
  }), []);

  // Frame animation loop for organic breathing, finger articulation, and mouse parallax
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouse = state.pointer; // normalized [-1, 1]

    if (groupRef.current) {
      // Smooth mouse tracking rotation with organic float
      const targetRotY = mouse.x * 0.45;
      const targetRotX = -mouse.y * 0.35 + 0.1;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.12;
      groupRef.current.rotation.z = Math.sin(time * 1.0) * 0.04;
    }

    // Animate finger joints toward active target pose with slight idle wave
    const currentConfig = poseConfigs[activePose] || poseConfigs.OPEN_HAND;

    ['thumb', 'index', 'middle', 'ring', 'pinky'].forEach((fingerName, fIdx) => {
      const parts = fingersRef.current[fingerName];
      if (!parts) return;

      const target = currentConfig[fingerName];
      const subtleWave = activePose === 'OPEN_HAND' ? Math.sin(time * 2.5 + fIdx * 0.5) * 0.04 : 0;

      if (parts.mcp) {
        parts.mcp.rotation.x = THREE.MathUtils.lerp(parts.mcp.rotation.x, target.mcp + subtleWave, 0.08);
        parts.mcp.rotation.z = THREE.MathUtils.lerp(parts.mcp.rotation.z, target.splay, 0.08);
      }
      if (parts.pip) {
        parts.pip.rotation.x = THREE.MathUtils.lerp(parts.pip.rotation.x, target.pip + subtleWave, 0.08);
      }
      if (parts.dip) {
        parts.dip.rotation.x = THREE.MathUtils.lerp(parts.dip.rotation.x, target.dip, 0.08);
      }
    });
  });

  // Reusable Materials
  const materials = useMemo(() => {
    return {
      skin: new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        roughness: 0.25,
        metalness: 0.15,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        reflectivity: 0.9,
      }),
      coreNavy: new THREE.MeshStandardMaterial({
        color: '#092B59',
        roughness: 0.3,
        metalness: 0.6,
      }),
      jointNode: new THREE.MeshStandardMaterial({
        color: '#258BFF',
        emissive: '#1677FF',
        emissiveIntensity: 0.8,
        roughness: 0.2,
      }),
      tipNode: new THREE.MeshStandardMaterial({
        color: '#55D6FF',
        emissive: '#55D6FF',
        emissiveIntensity: 1.2,
        roughness: 0.1,
      }),
      energyBone: new THREE.MeshBasicMaterial({
        color: '#55D6FF',
        transparent: true,
        opacity: 0.65,
        wireframe: false,
      })
    };
  }, []);

  // Helper to build a finger bone segment with a landmark node and connector
  const buildBone = (length, radius = 0.09) => (
    <group>
      {/* Visual cybernetic segment */}
      <mesh position={[0, length / 2, 0]} material={materials.skin}>
        <cylinderGeometry args={[radius * 0.85, radius, length, 16]} />
      </mesh>
      {/* Glowing inner bone line */}
      <mesh position={[0, length / 2, 0]} material={materials.energyBone}>
        <cylinderGeometry args={[radius * 0.25, radius * 0.25, length * 0.95, 8]} />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* WRIST BASE (Landmark 0) */}
      <group position={[0, -0.8, 0]}>
        {/* Landmark 0 sphere */}
        <mesh material={materials.tipNode} scale={[0.18, 0.18, 0.18]}>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>
        {/* Futuristic Wrist Casing */}
        <mesh position={[0, -0.25, 0]} material={materials.coreNavy}>
          <cylinderGeometry args={[0.55, 0.65, 0.5, 24]} />
        </mesh>
        {/* Glowing ring band */}
        <mesh position={[0, -0.25, 0]} material={materials.tipNode}>
          <torusGeometry args={[0.58, 0.03, 16, 48]} />
        </mesh>
      </group>

      {/* PALM CARPAL STRUCTURE */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -0.2, 0]} material={materials.skin}>
          <boxGeometry args={[1.3, 0.95, 0.32]} />
        </mesh>
        <mesh position={[0, -0.2, 0.17]} material={materials.jointNode} scale={[0.1, 0.1, 0.02]}>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 6]} />
        </mesh>
      </group>

      {/* THUMB (Landmarks 1, 2, 3, 4) */}
      <group position={[-0.65, -0.45, 0.05]} rotation={[0, 0, 0.6]}>
        {/* CMC joint */}
        <mesh material={materials.jointNode} scale={[0.11, 0.11, 0.11]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        {buildBone(0.38, 0.1)}

        {/* MCP joint */}
        <group
          position={[0, 0.38, 0]}
          ref={(el) => {
            if (!fingersRef.current.thumb) fingersRef.current.thumb = {};
            fingersRef.current.thumb.mcp = el;
          }}
        >
          <mesh material={materials.jointNode} scale={[0.1, 0.1, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
          </mesh>
          {buildBone(0.35, 0.09)}

          {/* IP joint */}
          <group
            position={[0, 0.35, 0]}
            ref={(el) => {
              if (!fingersRef.current.thumb) fingersRef.current.thumb = {};
              fingersRef.current.thumb.pip = el;
            }}
          >
            <mesh material={materials.jointNode} scale={[0.09, 0.09, 0.09]}>
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            {buildBone(0.32, 0.08)}

            {/* TIP (Landmark 4) */}
            <mesh position={[0, 0.32, 0]} material={materials.tipNode} scale={[0.12, 0.12, 0.12]}>
              <sphereGeometry args={[1, 20, 20]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* INDEX FINGER (Landmarks 5, 6, 7, 8) */}
      <group position={[-0.42, 0.28, 0]}>
        {/* MCP */}
        <mesh material={materials.jointNode} scale={[0.1, 0.1, 0.1]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        <group
          ref={(el) => {
            if (!fingersRef.current.index) fingersRef.current.index = {};
            fingersRef.current.index.mcp = el;
          }}
        >
          {buildBone(0.44, 0.085)}
          {/* PIP */}
          <group
            position={[0, 0.44, 0]}
            ref={(el) => {
              if (!fingersRef.current.index) fingersRef.current.index = {};
              fingersRef.current.index.pip = el;
            }}
          >
            <mesh material={materials.jointNode} scale={[0.085, 0.085, 0.085]}>
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            {buildBone(0.36, 0.075)}
            {/* DIP */}
            <group
              position={[0, 0.36, 0]}
              ref={(el) => {
                if (!fingersRef.current.index) fingersRef.current.index = {};
                fingersRef.current.index.dip = el;
              }}
            >
              <mesh material={materials.jointNode} scale={[0.075, 0.075, 0.075]}>
                <sphereGeometry args={[1, 16, 16]} />
              </mesh>
              {buildBone(0.28, 0.065)}
              {/* TIP */}
              <mesh position={[0, 0.28, 0]} material={materials.tipNode} scale={[0.11, 0.11, 0.11]}>
                <sphereGeometry args={[1, 20, 20]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* MIDDLE FINGER (Landmarks 9, 10, 11, 12) */}
      <group position={[-0.14, 0.32, 0]}>
        {/* MCP */}
        <mesh material={materials.jointNode} scale={[0.105, 0.105, 0.105]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        <group
          ref={(el) => {
            if (!fingersRef.current.middle) fingersRef.current.middle = {};
            fingersRef.current.middle.mcp = el;
          }}
        >
          {buildBone(0.50, 0.09)}
          {/* PIP */}
          <group
            position={[0, 0.50, 0]}
            ref={(el) => {
              if (!fingersRef.current.middle) fingersRef.current.middle = {};
              fingersRef.current.middle.pip = el;
            }}
          >
            <mesh material={materials.jointNode} scale={[0.09, 0.09, 0.09]}>
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            {buildBone(0.40, 0.08)}
            {/* DIP */}
            <group
              position={[0, 0.40, 0]}
              ref={(el) => {
                if (!fingersRef.current.middle) fingersRef.current.middle = {};
                fingersRef.current.middle.dip = el;
              }}
            >
              <mesh material={materials.jointNode} scale={[0.08, 0.08, 0.08]}>
                <sphereGeometry args={[1, 16, 16]} />
              </mesh>
              {buildBone(0.30, 0.07)}
              {/* TIP */}
              <mesh position={[0, 0.30, 0]} material={materials.tipNode} scale={[0.115, 0.115, 0.115]}>
                <sphereGeometry args={[1, 20, 20]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* RING FINGER (Landmarks 13, 14, 15, 16) */}
      <group position={[0.15, 0.28, 0]}>
        {/* MCP */}
        <mesh material={materials.jointNode} scale={[0.095, 0.095, 0.095]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        <group
          ref={(el) => {
            if (!fingersRef.current.ring) fingersRef.current.ring = {};
            fingersRef.current.ring.mcp = el;
          }}
        >
          {buildBone(0.45, 0.085)}
          {/* PIP */}
          <group
            position={[0, 0.45, 0]}
            ref={(el) => {
              if (!fingersRef.current.ring) fingersRef.current.ring = {};
              fingersRef.current.ring.pip = el;
            }}
          >
            <mesh material={materials.jointNode} scale={[0.085, 0.085, 0.085]}>
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            {buildBone(0.37, 0.075)}
            {/* DIP */}
            <group
              position={[0, 0.37, 0]}
              ref={(el) => {
                if (!fingersRef.current.ring) fingersRef.current.ring = {};
                fingersRef.current.ring.dip = el;
              }}
            >
              <mesh material={materials.jointNode} scale={[0.075, 0.075, 0.075]}>
                <sphereGeometry args={[1, 16, 16]} />
              </mesh>
              {buildBone(0.28, 0.065)}
              {/* TIP */}
              <mesh position={[0, 0.28, 0]} material={materials.tipNode} scale={[0.11, 0.11, 0.11]}>
                <sphereGeometry args={[1, 20, 20]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* PINKY FINGER (Landmarks 17, 18, 19, 20) */}
      <group position={[0.42, 0.21, 0]}>
        {/* MCP */}
        <mesh material={materials.jointNode} scale={[0.085, 0.085, 0.085]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        <group
          ref={(el) => {
            if (!fingersRef.current.pinky) fingersRef.current.pinky = {};
            fingersRef.current.pinky.mcp = el;
          }}
        >
          {buildBone(0.35, 0.075)}
          {/* PIP */}
          <group
            position={[0, 0.35, 0]}
            ref={(el) => {
              if (!fingersRef.current.pinky) fingersRef.current.pinky = {};
              fingersRef.current.pinky.pip = el;
            }}
          >
            <mesh material={materials.jointNode} scale={[0.075, 0.075, 0.075]}>
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            {buildBone(0.28, 0.065)}
            {/* DIP */}
            <group
              position={[0, 0.28, 0]}
              ref={(el) => {
                if (!fingersRef.current.pinky) fingersRef.current.pinky = {};
                fingersRef.current.pinky.dip = el;
              }}
            >
              <mesh material={materials.jointNode} scale={[0.065, 0.065, 0.065]}>
                <sphereGeometry args={[1, 16, 16]} />
              </mesh>
              {buildBone(0.24, 0.055)}
              {/* TIP */}
              <mesh position={[0, 0.24, 0]} material={materials.tipNode} scale={[0.1, 0.1, 0.1]}>
                <sphereGeometry args={[1, 20, 20]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// Full 3D Hand Scene with Interactive Controls & Particle Field
export default function Hand3DModel({ defaultPose = 'OPEN_HAND', interactive = true }) {
  const [activePose, setActivePose] = useState(defaultPose);

  const poses = [
    { id: 'OPEN_HAND', label: 'Open Hand', emoji: '🖐️' },
    { id: 'VICTORY', label: 'Peace / Victory', emoji: '✌️' },
    { id: 'THUMBS_UP', label: 'Thumbs Up', emoji: '👍' },
    { id: 'FIST', label: 'Fist', emoji: '✊' },
  ];

  return (
    <div className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center select-none">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-4, 2, -2]} intensity={2.0} color="#1677FF" />
        <pointLight position={[4, -2, 2]} intensity={2.5} color="#55D6FF" />

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <CyberneticHand activePose={activePose} />
        </Float>

        {/* Ambient floating tech sparkles */}
        <Sparkles
          count={50}
          scale={5.5}
          size={3.5}
          speed={0.4}
          color="#55D6FF"
          opacity={0.6}
        />
        <Sparkles
          count={35}
          scale={6}
          size={4}
          speed={0.3}
          color="#258BFF"
          opacity={0.5}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 3}
        />
      </Canvas>

      {/* Interactive Pose Controls Overlay */}
      {interactive && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-2xl glass-card border border-gesture-electric/30 shadow-glass z-10">
          {poses.map((p) => {
            const isActive = activePose === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePose(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-gesture-primary text-white shadow-glow-blue scale-105'
                    : 'text-gesture-navy dark:text-gesture-light hover:bg-gesture-light dark:hover:bg-gesture-darkCard'
                }`}
              >
                <span>{p.emoji}</span>
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Futuristic Corner Decorative Indicators */}
      <div className="absolute top-3 left-4 pointer-events-none text-[10px] tracking-wider font-mono text-gesture-electric/80 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-gesture-cyan animate-ping inline-block" />
        <span>3D_RIGGED_KINEMATICS // 21_LANDMARKS</span>
      </div>
      <div className="absolute top-3 right-4 pointer-events-none text-[10px] tracking-wider font-mono text-gesture-electric/80">
        <span>INTERACTIVE_HOVER // DRAG_TO_ROTATE</span>
      </div>
    </div>
  );
}
