import { useEffect, useRef, useState } from "react";
import "./ProfileCard.css";

export default function ProfileCard({ image, name, title }) {
  const cardRef = useRef(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const move = (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      card.style.setProperty("--tilt-x", `${y * -7}deg`);
      card.style.setProperty("--tilt-y", `${x * 7}deg`);
    };

    const leave = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  const startDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      current: drag
    };
    cardRef.current?.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    const active = dragRef.current;
    if (!active) return;
    const next = {
      x: Math.max(-125, Math.min(125, active.current.x + event.clientX - active.startX)),
      y: Math.max(-190, Math.min(150, active.current.y + event.clientY - active.startY))
    };
    setDrag(next);
  };

  const stopDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDrag({ x: 0, y: 0 });
  };

  return (
    <div className="lanyard" ref={cardRef} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
      <div className="lanyard__clamp" style={{ "--drag-x": `${drag.x}px`, "--drag-y": `${drag.y}px` }} aria-hidden="true" />
      <div className="lanyard__ring" style={{ "--drag-x": `${drag.x}px`, "--drag-y": `${drag.y}px` }} aria-hidden="true" />
      <article
        className="lanyard__card"
        style={{ "--drag-x": `${drag.x}px`, "--drag-y": `${drag.y}px` }}
        onPointerDown={startDrag}
      >
        <div className="lanyard__slot" aria-hidden="true" />
        <img
          src={image}
          alt={name}
          className="lanyard__photo"
          onError={(event) => {
            event.currentTarget.src = "images/ressaa.png";
          }}
        />
        <div className="lanyard__shade" />
        <div className="lanyard__info">
          <strong>{name}</strong>
        </div>
      </article>
    </div>
  );
}
