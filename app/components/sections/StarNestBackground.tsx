'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_NEST_FRAGMENT_SHADER = `
  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec2 iMouse;

  #define iterations 10
  #define formuparam 0.53
  #define volsteps 10
  #define stepsize 0.1
  #define zoom 0.800
  #define tile 0.850
  #define speed 0.025
  #define brightness 0.004
  #define darkmatter 0.200
  #define distfading 0.750
  #define saturation 0.900

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy - .5;
    uv.y *= iResolution.y / iResolution.x;

    vec3 dir = vec3(uv * zoom, 1.);
    float time = iTime * speed + .25;

    float a1 = .5 + iMouse.x * 0.5;
    float a2 = .8 + iMouse.y * 0.5;

    mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
    mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));

    dir.xz *= rot1;
    dir.xy *= rot2;

    vec3 from = vec3(1., .5, 0.5);
    from += vec3(time * 2., time, -2.);
    from.xz *= rot1;
    from.xy *= rot2;

    float s = 0.1, fade = 1.;
    vec3 v = vec3(0.);

    for (int r = 0; r < volsteps; r++) {
      vec3 p = from + s * dir * .5;
      p = abs(vec3(tile) - mod(p, vec3(tile * 2.)));

      float pa, a = pa = 0.;
      for (int i = 0; i < iterations; i++) {
        p = abs(p) / dot(p, p) - formuparam;
        a += abs(length(p) - pa);
        pa = length(p);
      }

      float dm = max(0., darkmatter - a * a * .001);
      a *= a * a;

      if (r > 6) fade *= 1. - dm;

      v += fade;
      v += vec3(s, s*s, s*s*s*s) * a * brightness * fade;

      fade *= distfading;
      s += stepsize;
    }

    v = mix(vec3(length(v)), v, saturation);
    fragColor = vec4(v * .02, 1.);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

const STAR_NEST_VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector3(size.width, size.height, 1),
      },
      iMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [size.width, size.height]
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.iTime.value = state.clock.elapsedTime;
      material.uniforms.iMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={STAR_NEST_FRAGMENT_SHADER}
        vertexShader={STAR_NEST_VERTEX_SHADER}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function StarNestBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 1] }}
        style={{
          width: '100%',
          height: '100%',
          opacity: 1,
        }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
