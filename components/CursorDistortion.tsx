/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";


export default function SplashCursor({
  SIM_RESOLUTION      = 128,
  DYE_RESOLUTION      = 1440,
  DENSITY_DISSIPATION = 5.5,
  VELOCITY_DISSIPATION= 2.8,
  PRESSURE            = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL                = 8,
  SPLAT_RADIUS        = 0.08,
  SPLAT_FORCE         = 4000,
  SHADING             = true,
  COLOR_UPDATE_SPEED  = 10,
  TRANSPARENT         = true,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ── pointer state ─────────────────────────────────────────── */
    function makePointer() {
      return {
        id: -1, texcoordX: 0, texcoordY: 0,
        prevTexcoordX: 0, prevTexcoordY: 0,
        deltaX: 0, deltaY: 0,
        down: false, moved: false,
        color: [0, 0, 0] as number[],
      };
    }
    const pointers = [makePointer()];

    const config = {
      SIM_RESOLUTION, DYE_RESOLUTION, DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION, PRESSURE, PRESSURE_ITERATIONS,
      CURL, SPLAT_RADIUS, SPLAT_FORCE, SHADING,
      COLOR_UPDATE_SPEED, TRANSPARENT,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      PAUSED: false,
    };

    /* ── WebGL context ─────────────────────────────────────────── */
    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
      let gl: any = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);

      let halfFloat: any;
      let supportLinearFiltering: any;
      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
      }

      gl.clearColor(0, 0, 0, 1);
      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

      function getSupportedFormat(gl: any, internalFormat: any, format: any, type: any): any {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
          if (internalFormat === gl.R16F)   return getSupportedFormat(gl, gl.RG16F,   gl.RG,   type);
          if (internalFormat === gl.RG16F)  return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA,  type);
          return null;
        }
        return { internalFormat, format };
      }

      function supportRenderTextureFormat(gl: any, internalFormat: any, format: any, type: any) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      }

      const formatRGBA = isWebGL2
        ? getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType)
        : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      const formatRG = isWebGL2
        ? getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType)
        : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      const formatR = isWebGL2
        ? getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)
        : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);

      return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
    }

    const { gl, ext } = getWebGLContext(canvas);
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    /* ── shader helpers ────────────────────────────────────────── */
    function compileShader(type: any, source: string, keywords?: string[] | null) {
      if (keywords) source = keywords.map(k => `#define ${k}\n`).join("") + source;
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(shader));
      return shader;
    }

    function createProgram(vs: any, fs: any) {
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.error(gl.getProgramInfoLog(program));
      return program;
    }

    function getUniforms(program: any) {
      const uniforms: Record<string, any> = {};
      const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(program, i).name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return uniforms;
    }

    class GLProgram {
      program: any; uniforms: any;
      constructor(vs: any, fs: any) {
        this.program = createProgram(vs, fs);
        this.uniforms = getUniforms(this.program);
      }
      bind() { gl.useProgram(this.program); }
    }

    class Material {
      vs: any; fsSrc: string; programs: any[]; active: any; uniforms: any;
      constructor(vs: any, fsSrc: string) {
        this.vs = vs; this.fsSrc = fsSrc;
        this.programs = []; this.active = null; this.uniforms = [];
      }
      setKeywords(kw: string[]) {
        let hash = kw.reduce((h, k) => { for (let i = 0; i < k.length; i++) h = (h << 5) - h + k.charCodeAt(i) | 0; return h; }, 0);
        if (!this.programs[hash]) {
          const fs = compileShader(gl.FRAGMENT_SHADER, this.fsSrc, kw);
          this.programs[hash] = createProgram(this.vs, fs);
        }
        if (this.programs[hash] === this.active) return;
        this.uniforms = getUniforms(this.programs[hash]);
        this.active = this.programs[hash];
      }
      bind() { gl.useProgram(this.active); }
    }

    /* ── shaders ───────────────────────────────────────────────── */
    const baseVS = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`);

    const copyFS       = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; uniform sampler2D uTexture; void main () { gl_FragColor = texture2D(uTexture, vUv); }`);
    const clearFS      = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value; void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`);
    const splatFS      = compileShader(gl.FRAGMENT_SHADER, `precision highp float; precision highp sampler2D; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; void main () { vec2 p = vUv - point.xy; p.x *= aspectRatio; vec3 splat = exp(-dot(p,p)/radius)*color; vec3 base = texture2D(uTarget,vUv).xyz; gl_FragColor = vec4(base+splat,1.0); }`);
    const divergenceFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uVelocity; void main () { float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y; vec2 C=texture2D(uVelocity,vUv).xy; if(vL.x<0.0){L=-C.x;} if(vR.x>1.0){R=-C.x;} if(vT.y>1.0){T=-C.y;} if(vB.y<0.0){B=-C.y;} gl_FragColor=vec4(0.5*(R-L+T-B),0,0,1); }`);
    const curlFS       = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uVelocity; void main () { float L=texture2D(uVelocity,vL).y,R=texture2D(uVelocity,vR).y,T=texture2D(uVelocity,vT).x,B=texture2D(uVelocity,vB).x; gl_FragColor=vec4(0.5*(R-L-T+B),0,0,1); }`);
    const vorticityFS  = compileShader(gl.FRAGMENT_SHADER, `precision highp float; precision highp sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; void main () { float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x; vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); force/=length(force)+0.0001; force*=curl*C; force.y*=-1.0; vec2 v=texture2D(uVelocity,vUv).xy; v+=force*dt; v=min(max(v,-1000.0),1000.0); gl_FragColor=vec4(v,0,1); }`);
    const pressureFS   = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence; void main () { float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x; float div=texture2D(uDivergence,vUv).x; gl_FragColor=vec4((L+R+B+T-div)*0.25,0,0,1); }`);
    const gradSubFS    = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity; void main () { float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x; vec2 v=texture2D(uVelocity,vUv).xy; v.xy-=vec2(R-L,T-B); gl_FragColor=vec4(v,0,1); }`);
    const advectionFS  = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation;
      vec4 bilerp(sampler2D s,vec2 uv,vec2 ts){ vec2 st=uv/ts-0.5; vec2 i=floor(st),f=fract(st); vec4 a=texture2D(s,(i+vec2(0.5,0.5))*ts),b=texture2D(s,(i+vec2(1.5,0.5))*ts),c=texture2D(s,(i+vec2(0.5,1.5))*ts),d=texture2D(s,(i+vec2(1.5,1.5))*ts); return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;
          vec4 result=bilerp(uSource,coord,dyeTexelSize);
        #else
          vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;
          vec4 result=texture2D(uSource,coord);
        #endif
        gl_FragColor=result/(1.0+dissipation*dt);
      }`, ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]);

    const displayFS = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture; uniform vec2 texelSize;
      vec3 linearToGamma(vec3 c){ c=max(c,vec3(0)); return max(1.055*pow(c,vec3(0.4166667))-0.055,vec3(0)); }
      void main () {
        vec3 c=texture2D(uTexture,vUv).rgb;
        #ifdef SHADING
          vec3 lc=texture2D(uTexture,vL).rgb,rc=texture2D(uTexture,vR).rgb,tc=texture2D(uTexture,vT).rgb,bc=texture2D(uTexture,vB).rgb;
          float dx=length(rc)-length(lc), dy=length(tc)-length(bc);
          vec3 n=normalize(vec3(dx,dy,length(texelSize)));
          float diffuse=clamp(dot(n,vec3(0,0,1))+0.7,0.7,1.0);
          c*=diffuse;
        #endif
        float a=max(c.r,max(c.g,c.b));
        gl_FragColor=vec4(c,a);
      }`;

    /* ── programs ──────────────────────────────────────────────── */
    const copyProg     = new GLProgram(baseVS, copyFS);
    const clearProg    = new GLProgram(baseVS, clearFS);
    const splatProg    = new GLProgram(baseVS, splatFS);
    const advProg      = new GLProgram(baseVS, advectionFS);
    const divProg      = new GLProgram(baseVS, divergenceFS);
    const curlProg     = new GLProgram(baseVS, curlFS);
    const vortProg     = new GLProgram(baseVS, vorticityFS);
    const presProg     = new GLProgram(baseVS, pressureFS);
    const gradProg     = new GLProgram(baseVS, gradSubFS);
    const displayMat   = new Material(baseVS, displayFS);

    /* ── blit quad ─────────────────────────────────────────────── */
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target: any, clear = false) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    /* ── FBOs ──────────────────────────────────────────────────── */
    function createFBO(w: number, h: number, iF: any, f: any, type: any, param: any) {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, iF, w, h, 0, f, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
      return { texture: tex, fbo, width: w, height: h,
        texelSizeX: 1/w, texelSizeY: 1/h,
        attach(id: number) { gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
    }

    function createDoubleFBO(w: number, h: number, iF: any, f: any, type: any, param: any) {
      let a = createFBO(w,h,iF,f,type,param), b = createFBO(w,h,iF,f,type,param);
      return { width:w, height:h, texelSizeX:a.texelSizeX, texelSizeY:a.texelSizeY,
        get read(){return a;}, set read(v){a=v;},
        get write(){return b;}, set write(v){b=v;},
        swap(){ const t=a; a=b; b=t; } };
    }

    function resizeDoubleFBO(target: any, w: number, h: number, iF: any, f: any, type: any, param: any) {
      if (target.width===w && target.height===h) return target;
      const newRead = createFBO(w,h,iF,f,type,param);
      copyProg.bind();
      gl.uniform1i(copyProg.uniforms.uTexture, target.read.attach(0));
      blit(newRead);
      target.read  = newRead;
      target.write = createFBO(w,h,iF,f,type,param);
      target.width=w; target.height=h;
      target.texelSizeX=1/w; target.texelSizeY=1/h;
      return target;
    }

    function getResolution(res: number) {
      let ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ar < 1) ar = 1/ar;
      const min = Math.round(res), max = Math.round(res*ar);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width:max, height:min } : { width:min, height:max };
    }

    let dye: any, velocity: any, divergence: any, curl: any, pressure: any;

    function initFramebuffers() {
      const sim = getResolution(config.SIM_RESOLUTION);
      const dR  = getResolution(config.DYE_RESOLUTION);
      const tt  = ext.halfFloatTexType;
      const fil = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);
      dye      = !dye      ? createDoubleFBO(dR.width,dR.height,ext.formatRGBA.internalFormat,ext.formatRGBA.format,tt,fil)  : resizeDoubleFBO(dye,dR.width,dR.height,ext.formatRGBA.internalFormat,ext.formatRGBA.format,tt,fil);
      velocity = !velocity ? createDoubleFBO(sim.width,sim.height,ext.formatRG.internalFormat,ext.formatRG.format,tt,fil)    : resizeDoubleFBO(velocity,sim.width,sim.height,ext.formatRG.internalFormat,ext.formatRG.format,tt,fil);
      divergence = createFBO(sim.width,sim.height,ext.formatR.internalFormat,ext.formatR.format,tt,gl.NEAREST);
      curl       = createFBO(sim.width,sim.height,ext.formatR.internalFormat,ext.formatR.format,tt,gl.NEAREST);
      pressure   = createDoubleFBO(sim.width,sim.height,ext.formatR.internalFormat,ext.formatR.format,tt,gl.NEAREST);
    }

    /* ── color — purple / violet / magenta palette ─────────────── */
    function generateColor() {
      // Icy blue → periwinkle → soft lavender
      const h = 0.55 + Math.random() * 0.18;
      const c = HSVtoRGB(h, 0.45 + Math.random() * 0.25, 1.0);
      return { r: c.r * 0.055, g: c.g * 0.055, b: c.b * 0.055 };
    }

    function HSVtoRGB(h: number, s: number, v: number) {
      const i = Math.floor(h*6), f = h*6-i, p=v*(1-s), q=v*(1-f*s), t=v*(1-(1-f)*s);
      const cases: [number,number,number][] = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]];
      const [r,g,b] = cases[i%6];
      return { r, g, b };
    }

    /* ── sim step ──────────────────────────────────────────────── */
    function step(dt: number) {
      gl.disable(gl.BLEND);

      curlProg.bind();
      gl.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vortProg.bind();
      gl.uniform2f(vortProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vortProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vortProg.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vortProg.uniforms.curl, config.CURL);
      gl.uniform1f(vortProg.uniforms.dt, dt);
      blit(velocity.write); velocity.swap();

      divProg.bind();
      gl.uniform2f(divProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProg.bind();
      gl.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProg.uniforms.value, config.PRESSURE);
      blit(pressure.write); pressure.swap();

      presProg.bind();
      gl.uniform2f(presProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(presProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(presProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write); pressure.swap();
      }

      gradProg.bind();
      gl.uniform2f(gradProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradProg.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      advProg.bind();
      gl.uniform2f(advProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering)
        gl.uniform2f(advProg.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      const vId = velocity.read.attach(0);
      gl.uniform1i(advProg.uniforms.uVelocity, vId);
      gl.uniform1i(advProg.uniforms.uSource,   vId);
      gl.uniform1f(advProg.uniforms.dt, dt);
      gl.uniform1f(advProg.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write); velocity.swap();

      if (!ext.supportLinearFiltering)
        gl.uniform2f(advProg.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advProg.uniforms.uSource,   dye.read.attach(1));
      gl.uniform1f(advProg.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write); dye.swap();
    }

    function drawDisplay(target: any) {
      const w = target ? target.width  : gl.drawingBufferWidth;
      const h = target ? target.height : gl.drawingBufferHeight;
      displayMat.bind();
      if (config.SHADING) gl.uniform2f(displayMat.uniforms.texelSize, 1/w, 1/h);
      gl.uniform1i(displayMat.uniforms.uTexture, dye.read.attach(0));
      blit(target);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: any) {
      splatProg.bind();
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProg.uniforms.point, x, y);
      gl.uniform3f(splatProg.uniforms.color, dx, dy, 0);
      const r = config.SPLAT_RADIUS / 100 * (canvas.width/canvas.height > 1 ? canvas.width/canvas.height : 1);
      gl.uniform1f(splatProg.uniforms.radius, r);
      blit(velocity.write); velocity.swap();
      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, color.r, color.g, color.b);
      blit(dye.write); dye.swap();
    }

    /* ── pointer helpers ───────────────────────────────────────── */
    function scaleByPixelRatio(v: number) { return Math.floor(v * (window.devicePixelRatio || 1)); }
    function correctDeltaX(d: number) { const ar=canvas.width/canvas.height; return ar<1?d*ar:d; }
    function correctDeltaY(d: number) { const ar=canvas.width/canvas.height; return ar>1?d/ar:d; }

    function updateDown(p: any, id: number, px: number, py: number) {
      p.id=id; p.down=true; p.moved=false;
      p.texcoordX=px/canvas.width; p.texcoordY=1-(py/canvas.height);
      p.prevTexcoordX=p.texcoordX; p.prevTexcoordY=p.texcoordY;
      p.deltaX=0; p.deltaY=0; p.color=generateColor();
    }
    function updateMove(p: any, px: number, py: number, color: any) {
      p.prevTexcoordX=p.texcoordX; p.prevTexcoordY=p.texcoordY;
      p.texcoordX=px/canvas.width; p.texcoordY=1-(py/canvas.height);
      p.deltaX=correctDeltaX(p.texcoordX-p.prevTexcoordX);
      p.deltaY=correctDeltaY(p.texcoordY-p.prevTexcoordY);
      p.moved=Math.abs(p.deltaX)>0||Math.abs(p.deltaY)>0;
      p.color=color;
    }

    /* ── main loop ─────────────────────────────────────────────── */
    displayMat.setKeywords(config.SHADING ? ["SHADING"] : []);
    // Ensure canvas is sized before initialising framebuffers
    resizeCanvas();
    initFramebuffers();

    let lastTime = Date.now(), colorTimer = 0, rafId = 0;

    function frame() {
      const now = Date.now();
      const dt  = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime  = now;

      if (resizeCanvas()) initFramebuffers();

      colorTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer = colorTimer % 1;
        pointers.forEach(p => { p.color = generateColor() as any; });
      }

      pointers.forEach(p => {
        if (p.moved) { p.moved = false; splat(p.texcoordX, p.texcoordY, p.deltaX*config.SPLAT_FORCE, p.deltaY*config.SPLAT_FORCE, p.color); }
      });

      step(dt);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(null);

      rafId = requestAnimationFrame(frame);
    }

    function resizeCanvas() {
      const w = scaleByPixelRatio(canvas.clientWidth);
      const h = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width!==w || canvas.height!==h) { canvas.width=w; canvas.height=h; return true; }
      return false;
    }

    /* ── events ────────────────────────────────────────────────── */
    function onMouseDown(e: MouseEvent) {
      const p = pointers[0];
      updateDown(p, -1, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY));
      // burst splat on click
      const c = generateColor(); c.r*=3; c.g*=3; c.b*=3;
      splat(p.texcoordX, p.texcoordY, 10*(Math.random()-.5), 30*(Math.random()-.5), c);
    }
    function onMouseMove(e: MouseEvent) {
      updateMove(pointers[0], scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY), pointers[0].color);
    }
    function onTouchStart(e: TouchEvent) {
      for (const t of Array.from(e.targetTouches))
        updateDown(pointers[0], t.identifier, scaleByPixelRatio(t.clientX), scaleByPixelRatio(t.clientY));
    }
    function onTouchMove(e: TouchEvent) {
      for (const t of Array.from(e.targetTouches))
        updateMove(pointers[0], scaleByPixelRatio(t.clientX), scaleByPixelRatio(t.clientY), pointers[0].color);
    }
    function onTouchEnd(e: TouchEvent) {
      for (const _ of Array.from(e.changedTouches)) pointers[0].down = false;
    }

    window.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("touchend",   onTouchEnd);

    // Release context on hard refresh/navigation (cleanup doesn't run in time)
    function releaseContext() {
      const loseCtx = gl.getExtension("WEBGL_lose_context");
      if (loseCtx) loseCtx.loseContext();
    }
    window.addEventListener("beforeunload", releaseContext);

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousedown",  onMouseDown);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("beforeunload", releaseContext);
      releaseContext();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-cursor-canvas className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
