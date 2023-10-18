import React, { useRef, useEffect, useState } from "react";

const Canvas = ({ rectangles, onRectanglesChange, selectedRect, setSelectedRect, onDelete }) => {
  const canvasRef = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newRect, setNewRect] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");

      const handleMouseDown = (e) => {
        const rect = getRectangleUnderMouse(e);

        if (rect) {
          setSelectedRect(rect);
          setIsCreating(false);
        } else {
          setSelectedRect(null); // Deselect if no rectangle is clicked
          // Start creating a new rectangle at the mouse position
          const startX = e.offsetX;
          const startY = e.offsetY;
          setNewRect({ x: startX, y: startY, w: 0, h: 0 });
          setIsCreating(true);
        }
      };

      const handleMouseMove = (e) => {
        if (isCreating) {
          // Update the dimensions of the new rectangle as the user drags
          const startX = newRect.x;
          const startY = newRect.y;
          const newWidth = e.offsetX - startX;
          const newHeight = e.offsetY - startY;
          setNewRect({ x: startX, y: startY, w: newWidth, h: newHeight });
        }
      };

      const handleMouseUp = () => {
        if (isCreating) {
          setIsCreating(false);
          // Add the newly created rectangle to the list
          onRectanglesChange([...rectangles, newRect]);
          setNewRect(null);
        }
      };

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      // Add event listener for keyboard shortcuts
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [rectangles, selectedRect, onRectanglesChange, setSelectedRect, isCreating, newRect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach((rect) => {
      context.strokeStyle = rect === selectedRect ? "red" : "black";
      context.strokeRect(rect.x, rect.y, rect.w, rect.h);
    });

    // Draw the new rectangle being created
    if (isCreating && newRect) {
      context.strokeStyle = "black";
      context.strokeRect(newRect.x, newRect.y, newRect.w, newRect.h);
    }
  }, [rectangles, selectedRect, isCreating, newRect]);

  const getRectangleUnderMouse = (e) => {
    const canvas = canvasRef.current;
    for (let i = rectangles.length - 1; i >= 0; i--) {
      const rect = rectangles[i];
      if (
        e.offsetX >= rect.x &&
        e.offsetX <= rect.x + rect.w &&
        e.offsetY >= rect.y &&
        e.offsetY <= rect.y + rect.h
      ) {
        return rect;
      }
    }
    return null;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDelete(selectedRect);
    }
  };

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Canvas;
