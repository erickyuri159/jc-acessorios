"use client";

import { useEffect, useRef } from "react";
import { PieceImage } from "@/components/ui/PieceImage";

type GemStageProps = {
  className?: string;
  /** Foto de la pieza (PNG/WebP con fondo transparente). Si falta, se dibuja la argola 3D. */
  src?: string;
  alt?: string;
};

const VERTEX = `#version 100
attribute vec3 position;
attribute vec3 normal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProj;
varying vec3 vNormal;
varying vec3 vPos;
void main(){
  vNormal = mat3(uModel) * normal;
  vPos = (uModel * vec4(position, 1.0)).xyz;
  gl_Position = uProj * uView * vec4(vPos, 1.0);
}
`;

const FRAGMENT = `#version 100
precision mediump float;
varying vec3 vNormal;
varying vec3 vPos;
uniform vec3 uLightDir;
uniform vec3 uCamPos;
uniform float uTime;
void main(){
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uLightDir);
  vec3 V = normalize(uCamPos - vPos);
  vec3 H = normalize(L + V);
  
  // Ouro metalizado
  vec3 gold = vec3(1.0, 0.77, 0.34);
  vec3 goldHot = vec3(1.0, 0.88, 0.52);
  
  float diff = max(dot(N,L), 0.0);
  float spec = pow(max(dot(N,H), 0.0), 64.0);
  float fresnel = pow(1.0 - max(dot(N,V), 0.0), 3.0);
  
  // Acentos prismáticos
  vec3 prism = mix(vec3(1.0,0.16,0.38), vec3(0.24,0.5,1.0), sin(uTime*0.4)*0.5+0.5);
  prism = mix(prism, vec3(0.0,0.9,0.62), cos(uTime*0.6)*0.5+0.5);
  
  vec3 col = gold * (0.4 + diff * 0.6);
  col = mix(col, goldHot, spec * 0.8);
  col += prism * fresnel * 0.35;
  col += spec * vec3(1.0,0.95,0.8) * 0.6;
  
  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

function buildTorus(R: number, r: number, tubes: number, rings: number) {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  
  for (let i = 0; i <= tubes; i++) {
    const u = (i / tubes) * Math.PI * 2;
    for (let j = 0; j <= rings; j++) {
      const v = (j / rings) * Math.PI * 2;
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);
      positions.push(x, y, z);
      const nx = Math.cos(v) * Math.cos(u);
      const ny = Math.cos(v) * Math.sin(u);
      const nz = Math.sin(v);
      normals.push(nx, ny, nz);
    }
  }
  for (let i = 0; i < tubes; i++) {
    for (let j = 0; j < rings; j++) {
      const a = (i * (rings + 1)) + j;
      const b = ((i + 1) * (rings + 1)) + j;
      const c = ((i + 1) * (rings + 1)) + (j + 1);
      const d = (i * (rings + 1)) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }
  return { positions, normals, indices };
}

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f/aspect,0,0,0,
    0,f,0,0,
    0,0,(far+near)*nf,-1,
    0,0,(2*far*near)*nf,0
  ]);
}

function lookAt(eye: number[], center: number[], up: number[]) {
  const z0=eye[0]-center[0], z1=eye[1]-center[1], z2=eye[2]-center[2];
  let len=Math.hypot(z0,z1,z2); const zx=z0/len,zy=z1/len,zz=z2/len;
  const x0=up[1]*zz-up[2]*zy, x1=up[2]*zx-up[0]*zz, x2=up[0]*zy-up[1]*zx;
  len=Math.hypot(x0,x1,x2); const xx=x0/len,xy=x1/len,xz=x2/len;
  const yx=zy*xz-zz*xy, yy=zz*xx-zx*xz, yz=zx*xy-zy*xx;
  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx*eye[0]+xy*eye[1]+xz*eye[2]),
    -(yx*eye[0]+yy*eye[1]+yz*eye[2]),
    -(zx*eye[0]+zy*eye[1]+zz*eye[2]),
    1
  ]);
}

export function GemStage({
  className = "",
  src,
  alt = "Pieza destacada de JP Accesorios",
}: GemStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Foto de la pieza: inclinación 3D suave siguiendo el puntero.
  useEffect(() => {
    if (!src) return;
    const el = tiltRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const render = () => {
      frame = requestAnimationFrame(render);
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      el.style.transform = `perspective(1500px) rotateY(${(currentX * 10).toFixed(2)}deg) rotateX(${(-currentY * 8).toFixed(2)}deg)`;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${(-currentX * 22).toFixed(1)}px, ${(-currentY * 18).toFixed(1)}px, 0) scale(${(1 + Math.abs(currentX) * 0.06).toFixed(3)})`;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [src]);

  useEffect(() => {
    if (src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;
    const prog = createProgram(gl, vs, fs);
    if (!prog) return;

    gl.useProgram(prog);

    const { positions, normals, indices } = buildTorus(1.0, 0.16, 128, 64);
    const posBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const nBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    const iBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "position");
    const aNorm = gl.getAttribLocation(prog, "normal");
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuf);
    gl.enableVertexAttribArray(aNorm);
    gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

    const uModel = gl.getUniformLocation(prog, "uModel");
    const uView = gl.getUniformLocation(prog, "uView");
    const uProj = gl.getUniformLocation(prog, "uProj");
    const uLight = gl.getUniformLocation(prog, "uLightDir");
    const uCam = gl.getUniformLocation(prog, "uCamPos");
    const uTime = gl.getUniformLocation(prog, "uTime");

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0,0,0,0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0,0,canvas.width,canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const render = () => {
      t += prefersReduced ? 0 : 0.016;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      const aspect = canvas.width / canvas.height;
      const proj = perspective(Math.PI/3.2, aspect, 0.1, 100);
      gl.uniformMatrix4fv(uProj, false, proj);
      
      const eye = [Math.sin(t*0.3)*0.8, -3.2, 0.6];
      const view = lookAt(eye, [0,0,0], [0,0,1]);
      gl.uniformMatrix4fv(uView, false, view);
      gl.uniform3fv(uCam, new Float32Array(eye));
      
      // Rotación del anillo
      const rotY = t * 0.5;
      const rotX = Math.sin(t*0.4)*0.2 + 0.3;
      const rotZ = Math.sin(t*0.25)*0.1;
      const m = new Float32Array(16);
      // Matriz de rotación simplificada
      const cy=Math.cos(rotY), sy=Math.sin(rotY);
      const cx=Math.cos(rotX), sx=Math.sin(rotX);
      const cz=Math.cos(rotZ), sz=Math.sin(rotZ);
      m[0]=cy*cz; m[1]=cy*sz; m[2]=-sy;
      m[4]=sx*sy*cz-cx*sz; m[5]=sx*sy*sz+cx*cz; m[6]=sx*cy;
      m[8]=cx*sy*cz+sx*sz; m[9]=cx*sy*sz-sx*cz; m[10]=cx*cy;
      m[15]=1;
      gl.uniformMatrix4fv(uModel, false, m);
      gl.uniform3fv(uLight, new Float32Array([1,1,1]));
      gl.uniform1f(uTime, t);
      
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [src]);

  if (src) {
    return (
      <div className={`relative ${className}`}>
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[72%] -translate-y-1/2 rounded-full bg-oro/25 blur-[100px] transition-opacity duration-500"
          aria-hidden="true"
        />
        <div
          ref={tiltRef}
          className="hero-piece relative mx-auto h-[64vh] max-h-[44rem] w-full will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="hero-piece-sway absolute inset-0">
            <PieceImage
              src={src}
              alt={alt}
              priority
              sizes="(min-width: 1024px) 44rem, 95vw"
              className="object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute -inset-12 rounded-full bg-prisma opacity-25 blur-[90px]"
        aria-hidden="true"
      />
      <div className="relative aspect-square w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Argolla dorada girando en 3D"
        />
      </div>
    </div>
  );
}
