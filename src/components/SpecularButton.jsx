import { useEffect, useRef } from 'react';
import './SpecularButton.css';

const PAD = 24;
const TAU = Math.PI * 2;

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform float uPx;
uniform float uSpot;
uniform vec2 uEntry;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform vec2 uWindow;
uniform float uThickness;
uniform float uGlow;
out vec4 outColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float loopPosition(vec2 p, vec2 b, float r) {
  vec2 inner = b - r;
  float arc = 1.5707963 * r;
  float quarter = inner.x + inner.y + arc;
  vec2 a = abs(p);
  vec2 q = a - inner;
  float s = q.x > 0.0 && q.y > 0.0
    ? inner.y + atan(q.y, q.x) * r
    : (q.x > q.y ? min(a.y, inner.y) : inner.y + arc + inner.x - min(a.x, inner.x));
  if (p.x < 0.0) s = p.y >= 0.0 ? 2.0 * quarter - s : 2.0 * quarter + s;
  else if (p.y < 0.0) s = 4.0 * quarter - s;
  return s / max(4.0 * quarter, 0.0001);
}

float lobe(float position, float center) {
  float gap = abs(fract(position - center + 0.5) - 0.5);
  return 1.0 - smoothstep(uWindow.x, uWindow.x + uWindow.y, gap);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = roundedBox(p, uHalf, uRadius);
  float position = loopPosition(p, uHalf, uRadius);
  float key = lobe(position, uSpot);
  float back = lobe(position, uSpot + 0.5);
  float streak = key + back * 0.45;
  float width = max(uThickness * uPx * mix(1.0, max(key, back), 0.6), 0.35);
  float band = smoothstep(-width - 0.6, -width + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float hair = smoothstep(-uPx - 0.6, -uPx + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float inside = 1.0 - smoothstep(-0.6, 0.6, d);
  vec2 pool = (p - uEntry) / (uHalf.y * vec2(1.6, 1.1));
  float glow = streak * 0.2 * exp(-abs(d + width * 0.5) / (5.0 * uPx)) + inside * 0.08 * exp(-dot(pool, pool));
  float light = clamp((band * streak + glow * uGlow) * uIntensity, 0.0, 1.0);
  vec4 base = vec4(uBaseColor, 1.0) * hair * 0.6;
  outColor = vec4(uLineColor, 1.0) * light + base * (1.0 - light);
}`;

const UNIFORMS = [
  'uCenter',
  'uHalf',
  'uRadius',
  'uPx',
  'uSpot',
  'uEntry',
  'uLineColor',
  'uBaseColor',
  'uIntensity',
  'uWindow',
  'uThickness',
  'uGlow'
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = value => value - Math.floor(value);

const loopPosition = (x, y, halfX, halfY, r) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const qx = ax - innerX;
  const qy = ay - innerY;
  let s;
  if (qx > 0 && qy > 0) s = innerY + Math.atan2(qy, qx) * r;
  else if (qx > qy) s = Math.min(ay, innerY);
  else s = innerY + arc + innerX - Math.min(ax, innerX);
  if (x < 0) s = y >= 0 ? 2 * quarter - s : 2 * quarter + s;
  else if (y < 0) s = 4 * quarter - s;
  return wrap(s / Math.max(4 * quarter, 0.0001));
};

const rimPoint = (position, halfX, halfY, r) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  let s = wrap(position) * 4 * quarter;
  let signX = 1;
  let signY = 1;
  if (s > 3 * quarter) {
    s = 4 * quarter - s;
    signY = -1;
  } else if (s > 2 * quarter) {
    s -= 2 * quarter;
    signX = -1;
    signY = -1;
  } else if (s > quarter) {
    s = 2 * quarter - s;
    signX = -1;
  }
  let x = innerX - (s - innerY - arc);
  let y = halfY;
  if (s <= innerY) {
    x = halfX;
    y = s;
  } else if (s <= innerY + arc) {
    const angle = (s - innerY) / Math.max(r, 0.0001);
    x = innerX + Math.cos(angle) * r;
    y = innerY + Math.sin(angle) * r;
  }
  return [x * signX, y * signY];
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = gl => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

export default function SpecularButton({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0.04,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 10,
  shineFade = 34,
  thickness = 1.2,
  glow = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style,
  ...rest
}) {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef({ radius, lineColor, baseColor, intensity, idleIntensity, shineSize, shineFade, thickness, glow, speed, followMouse, proximity, autoAnimate, disabled });
  settingsRef.current = { radius, lineColor, baseColor, intensity, idleIntensity, shineSize, shineFade, thickness, glow, speed, followMouse, proximity, autoAnimate, disabled };

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', { alpha: true, antialias: false });
    if (!button || !canvas || !gl) return;
    const program = link(gl);
    if (!program) return;
    const uniforms = {};
    for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name);
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const colors = new Map();
    const view = { width: 1, height: 1, ratio: 1 };
    const pointer = { x: 0, y: 0, known: false };
    const state = { spot: 0, level: 0, press: 0, ready: false };
    let raf = 0, last = 0;

    const toRgb = v => {
      if (colors.has(v)) return colors.get(v);
      probe.clearRect(0,0,1,1); probe.fillStyle = v; probe.fillRect(0,0,1,1);
      const [r,g,b] = probe.getImageData(0,0,1,1).data;
      const res = [r/255, g/255, b/255]; colors.set(v, res); return res;
    };

    const frame = now => {
      raf = 0; const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      const rect = button.getBoundingClientRect();
      const hw = view.width / 2, hh = view.height / 2;
      const r = Math.min(s.radius, hw, hh);
      if (!state.ready) { state.spot = loopPosition(r * (1-Math.SQRT1_2) - hw, hh - r * (1-Math.SQRT1_2), hw, hh, r); state.level = s.idleIntensity; state.ready = true; }
      
      let targetSpot = state.spot, targetNear = 0;
      if (s.followMouse && !s.disabled && pointer.known) {
        const x = (pointer.x - rect.left - rect.width/2) / (rect.width/view.width);
        const y = (rect.top + rect.height/2 - pointer.y) / (rect.width/view.width);
        const dist = Math.hypot(Math.max(Math.abs(x)-hw, 0), Math.max(Math.abs(y)-hh, 0));
        const t = clamp(1 - dist/s.proximity, 0, 1); targetNear = t*t*(3-2*t);
        targetSpot = loopPosition(x, y, hw, hh, r);
      }
      
      let diff = targetSpot - state.spot; diff -= Math.round(diff);
      state.spot = wrap(state.spot + diff * (1 - Math.exp(-dt * 8)));
      const targetLevel = s.idleIntensity + (1-s.idleIntensity) * targetNear;
      state.level += (targetLevel - state.level) * (1 - Math.exp(-dt * 7));
      state.press *= Math.exp(-dt * 5);

      gl.viewport(0, 0, canvas.width, canvas.height); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program);
      const scaleX = canvas.width / (view.width + PAD * 2), scaleY = canvas.height / (view.height + PAD * 2);
      gl.uniform2f(uniforms.uCenter, (PAD + hw) * scaleX, (PAD + hh) * scaleY);
      gl.uniform2f(uniforms.uHalf, hw * scaleX, hh * scaleY);
      gl.uniform1f(uniforms.uRadius, r * scaleX); gl.uniform1f(uniforms.uPx, view.ratio);
      const [rimX, rimY] = rimPoint(state.spot, hw, hh, r);
      gl.uniform1f(uniforms.uSpot, state.spot);
      gl.uniform2f(uniforms.uEntry, rimX * scaleX, rimY * scaleY);
      gl.uniform3fv(uniforms.uLineColor, toRgb(s.lineColor));
      gl.uniform3fv(uniforms.uBaseColor, toRgb(s.baseColor));
      gl.uniform1f(uniforms.uIntensity, s.intensity * (state.level + state.press * 0.8));
      gl.uniform2f(uniforms.uWindow, s.shineSize / 360 + state.press * 0.06, s.shineFade / 360);
      gl.uniform1f(uniforms.uThickness, s.thickness); gl.uniform1f(uniforms.uGlow, s.glow);
      gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };

    const measure = () => {
      view.width = Math.max(1, button.offsetWidth); view.height = Math.max(1, button.offsetHeight);
      view.ratio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round((view.width + PAD * 2) * view.ratio);
      canvas.height = Math.round((view.height + PAD * 2) * view.ratio);
    };

    const onMove = e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.known = true; };
    const onLeave = () => { pointer.known = false; };
    const onDown = () => { if (!settingsRef.current.disabled) state.press = 1; };

    window.addEventListener('pointermove', onMove);
    button.addEventListener('pointerleave', onLeave);
    button.addEventListener('pointerdown', onDown);
    const obs = new ResizeObserver(measure); obs.observe(button);
    measure(); raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove);
      button.removeEventListener('pointerleave', onLeave); button.removeEventListener('pointerdown', onDown);
      obs.disconnect(); gl.deleteProgram(program);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size} ${className}`}
      style={{ '--sb-radius': `${radius}px`, '--sb-tint': tint, '--sb-tint-opacity': tintOpacity, '--sb-blur': `${blur}px`, '--sb-text-color': textColor, ...style }}
      {...rest}
    >
      <canvas ref={canvasRef} className="specular-button__light" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
}
