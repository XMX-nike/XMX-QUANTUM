import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Phrases ──────────────────────────────────────────────────────────────────
const PHRASES = [
  'The AI Terminal That\nExecutes While You Sleep.',
  'Institutional Tools.\nRetail Access.',
  'Markets Move.\nWe Predict.',
  'Quantum Speed.\nHuman Edge.',
  'Where Wall Street\nMeets Web3.',
  "Engineered for Traders\nWho Don't Miss.",
];

// ─── Phase state machine ───────────────────────────────────────────────────────
// reveal → hold → dissolve → next
type Phase = 'reveal' | 'hold' | 'dissolve';

interface HoloTextProps {
  darkMode: boolean;
}

function HoloText({ darkMode }: HoloTextProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('reveal');
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.85);
  const timeRef = useRef(0);
  const phaseTimeRef = useRef(0);

  const REVEAL_DURATION = 0.9;
  const HOLD_DURATION = 2.5;
  const DISSOLVE_DURATION = 0.6;

  useFrame((_state, delta) => {
    timeRef.current += delta;
    phaseTimeRef.current += delta;

    // Bob animation (always)
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(timeRef.current * 0.8) * 0.06;
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.06;
    }

    // Phase transitions
    if (phase === 'reveal') {
      const t = Math.min(phaseTimeRef.current / REVEAL_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setOpacity(eased);
      setScale(0.85 + eased * 0.15);
      if (t >= 1) {
        setPhase('hold');
        phaseTimeRef.current = 0;
      }
    } else if (phase === 'hold') {
      if (phaseTimeRef.current >= HOLD_DURATION) {
        setPhase('dissolve');
        phaseTimeRef.current = 0;
      }
    } else if (phase === 'dissolve') {
      const t = Math.min(phaseTimeRef.current / DISSOLVE_DURATION, 1);
      const eased = 1 - t * t; // ease-in quad
      setOpacity(eased);
      setScale(1 + t * 0.08);
      if (t >= 1) {
        setPhraseIdx(i => (i + 1) % PHRASES.length);
        setPhase('reveal');
        setOpacity(0);
        setScale(0.85);
        phaseTimeRef.current = 0;
      }
    }
  });

  const cyanColor = new THREE.Color('#00d4ff');
  const purpleColor = new THREE.Color('#a855f7');
  // Interpolate color based on phrase index
  const t = (phraseIdx % PHRASES.length) / PHRASES.length;
  const textColor = cyanColor.clone().lerp(purpleColor, t);

  return (
    <group ref={groupRef}>
      <Text
        ref={meshRef as React.Ref<THREE.Mesh>}
        fontSize={0.32}
        maxWidth={6}
        lineHeight={1.4}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        fillOpacity={opacity}
        scale={[scale, scale, scale]}
        color={textColor}
        outlineWidth={0.004}
        outlineColor={darkMode ? '#00d4ff' : '#7c3aed'}
        outlineOpacity={opacity * 0.6}
      >
        {PHRASES[phraseIdx]}
        <meshStandardMaterial
          color={textColor}
          emissive={textColor}
          emissiveIntensity={0.4}
          transparent
          opacity={opacity}
          metalness={0.6}
          roughness={0.2}
        />
      </Text>
    </group>
  );
}

function Scene({ darkMode }: { darkMode: boolean }) {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={darkMode ? 0.3 : 0.6} />
      {/* Main directional */}
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      {/* Cyan point light */}
      <pointLight position={[-3, 2, 2]} intensity={2} color="#00d4ff" distance={8} />
      {/* Purple point light */}
      <pointLight position={[3, -2, 2]} intensity={2} color="#a855f7" distance={8} />
      {/* Back fill */}
      <pointLight position={[0, 0, -4]} intensity={0.5} color={darkMode ? '#0a1628' : '#ffffff'} />

      <Suspense fallback={null}>
        <HoloText darkMode={darkMode} />
      </Suspense>
    </>
  );
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 6,
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
          animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
interface Props {
  darkMode?: boolean;
  height?: number;
}

export default function HolographicHero({ darkMode = true, height = 220 }: Props) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          frameloop={paused ? 'never' : 'always'}
        >
          <Scene darkMode={darkMode} />
        </Canvas>
      </Suspense>
    </div>
  );
}
