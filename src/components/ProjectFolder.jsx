import { useRef, useState } from "react";
import "./ProjectFolder.css";

export default function ProjectFolder({ category, projects }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dragged, setDragged] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const getSpreadTransform = (index, total) => {
    const angle = total <= 1 ? 0 : -52 + (104 * index) / (total - 1);
    const radians = (angle * Math.PI) / 180;
    const radius = Math.min(125, 55 + total * 6);

    return {
      x: Math.sin(radians) * radius,
      y: -Math.cos(radians) * radius + radius,
      rot: angle * 0.55
    };
  };

  const moveImage = (event, project) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const currentDrag = dragged[project.id] || { x: 0, y: 0 };
    dragRef.current = { projectId: project.id, startX, startY, currentDrag, moved: false };

    const move = (moveEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (Math.abs(moveEvent.clientX - startX) + Math.abs(moveEvent.clientY - startY) > 5) {
        drag.moved = true;
        setIsDragging(true);
      }
      setDragged((prev) => ({
        ...prev,
        [project.id]: {
          x: currentDrag.x + moveEvent.clientX - startX,
          y: currentDrag.y + moveEvent.clientY - startY
        }
      }));
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      setIsDragging(false);
      window.setTimeout(() => {
        dragRef.current = null;
      }, 0);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  return (
    <div className={`project-folder ${open ? "is-open" : ""}`}>
      <button className="project-folder__trigger" onClick={() => setOpen(!open)} type="button">
        <span className="project-folder__tab" />
        <span className="project-folder__back" />
        <span className="project-folder__front" />
        <span className="project-folder__label">{category}</span>
        <strong className="project-folder__count">{projects.length} project{projects.length === 1 ? "" : "s"}</strong>
      </button>

      <div className="project-folder__gallery">
        {projects.map((project, index) => {
          const spread = getSpreadTransform(index, projects.length);
          const drag = dragged[project.id] || { x: 0, y: 0 };
          const isVideo = project.foto.endsWith('.mp4') || project.foto.endsWith('.MOV');
          
          return (
            isVideo ? (
              <video
                key={project.id}
                src={`images/${project.foto}`}
                className="project-folder__img"
                style={{
                  "--spread-x": `${spread.x}px`,
                  "--spread-y": `${spread.y}px`,
                  "--spread-rot": `${spread.rot}deg`,
                  "--drag-x": `${drag.x}px`,
                  "--drag-y": `${drag.y}px`,
                  "--index": index,
                  zIndex: index + 5
                }}
                onPointerDown={(e) => moveImage(e, project)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDragging && !dragRef.current?.moved) {
                    setSelected(project);
                  }
                }}
              />
            ) : (
              <img
                key={project.id}
                src={`images/${project.foto}`}
                alt={project.judul}
                draggable="false"
                className="project-folder__img"
                style={{
                  "--spread-x": `${spread.x}px`,
                  "--spread-y": `${spread.y}px`,
                  "--spread-rot": `${spread.rot}deg`,
                  "--drag-x": `${drag.x}px`,
                  "--drag-y": `${drag.y}px`,
                  "--index": index,
                  zIndex: index + 5
                }}
                onPointerDown={(e) => moveImage(e, project)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDragging && !dragRef.current?.moved) {
                    setSelected(project);
                  }
                }}
              />
            )
          );
        })}
      </div>

      {selected && (
        <div className="project-folder__zoom" onClick={() => setSelected(null)}>
          <div className="project-folder__zoom-window" onClick={(e) => e.stopPropagation()}>
            {selected.foto.endsWith('.mp4') || selected.foto.endsWith('.MOV') ? (
              <video src={`images/${selected.foto}`} controls autoPlay className="project-folder__zoom-media" />
            ) : (
              <img src={`images/${selected.foto}`} alt={selected.judul} />
            )}
            <div className="project-folder__zoom-info">
              <h3>{selected.judul}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
