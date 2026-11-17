import { useEffect, useRef } from "react";
import "./TechText.css";

export default function TechText({ text, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !container || !context) return;

    let pointer = null;
    let frame = 0;

    const draw = () => {
      const bounds = container.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);

      const size = Math.min(bounds.width / Math.max(text.length * 0.55, 1), bounds.height * 0.62);
      context.font = `800 ${size}px Arial, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "rgba(255, 255, 255, 0.2)";
      context.fillText(text, bounds.width / 2, bounds.height / 2);

      const distance = Math.hypot(pointer.x - bounds.width / 2, pointer.y - bounds.height / 2);
      if (distance < Math.max(bounds.width, bounds.height) * 0.65) {
        context.save();
        context.font = `800 ${size}px Arial, sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 1.5;
        context.setLineDash([5, 3]);
        context.strokeStyle = "rgba(255, 255, 255, 0.85)";
        context.strokeText(text, bounds.width / 2, bounds.height / 2);
        context.restore();
      }
    };

    const resize = () => draw();
    const move = event => {
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const leave = () => {
      pointer = null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    draw();


    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, [text]);

  return <canvas ref={ref} className={`tech-text-canvas ${className}`} aria-label={text} role="img" />;
}
