import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, createPortal, extend } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import fragmentShader from "./shaders/particles/fragment.glsl";
import vertexShader from "./shaders/particles/vertex.glsl";

import SimulationMaterial from "./SimulationMaterial";
extend({ SimulationMaterial: SimulationMaterial });

export default function Particles() {
  const size = 128 * 2;
  const points = useRef();
  const simulationMaterialRef = useRef();

  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const { positionArray, colorArray, scaleArray } = useMemo(() => {
    const length = size * size;
    const positionArray = new Float32Array(length * 3);
    const colorArray = new Float32Array(length * 3);
    const scaleArray = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      positionArray[i3] = (i % size) / size;
      positionArray[i3 + 1] = i / size / size;
      positionArray[i3 + 2] = 0;

      colorArray[i3 + 0] = Math.random();
      colorArray[i3 + 1] = 0.5;
      colorArray[i3 + 2] = 0.95;

      scaleArray[i] = Math.random() * 1.2;
    }
    return { positionArray, colorArray, scaleArray };
  }, [size]);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );
  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  useFrame((state) => {
    const { gl, clock } = state;
    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    points.current.material.uniforms.uPositions.value = renderTarget.texture;
    points.current.material.uniforms.uTime.value = clock.elapsedTime;
    simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positionArray, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colorArray, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scaleArray, 1]} />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          pixelRatio={Math.min(window.devicePixelRatio, 2)}
          depthWrite={false}
          uniforms={{
            uPositions: {
              value: null,
            },
            uTime: {
              value: 0,
            },
            uPixelRatio: {
              value: Math.min(window.devicePixelRatio, 2),
            },
            uSize: {
              value: size * size,
            },
          }}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </points>
    </>
  );
}
