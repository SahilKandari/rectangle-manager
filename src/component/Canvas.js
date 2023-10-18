import React, { useRef, useEffect, useState } from "react";

const Canvas = ({ rectangles, onRectanglesChange, selectedRect, setSelectedRect, onDelete, canvasStyle }) => {
  const canvasRef = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [newRect, setNewRect] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");

      const handleMouseDown = (e) => {
        const rect = getRectangleUnderMouse(e);

        if (rect) {
          const { x, y, w, h } = rect;
          const offsetX = e.offsetX - x;
          const offsetY = e.offsetY - y;

          if (
            e.offsetX - x < 5 ||
            x + w - e.offsetX < 5 ||
            e.offsetY - y < 5 ||
            y + h - e.offsetY < 5
          ) {
            setResizeDirection({
              left: e.offsetX - x < 5,
              right: x + w - e.offsetX < 5,
              top: e.offsetY - y < 5,
              bottom: y + h - e.offsetY < 5,
            });
            setIsResizing(true);
          } else {
            setSelectedRect({ ...rect, offsetX, offsetY });
            setIsDragging(true);
          }
        } else {
          setSelectedRect(null);
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
        } else if (isDragging && selectedRect) {
          // Move the selected rectangle to the new position
          const { x, y, offsetX, offsetY } = selectedRect;
          setSelectedRect({ ...selectedRect, x: e.offsetX - offsetX, y: e.offsetY - offsetY });
        } else if (isResizing && selectedRect) {
          // Resize the selected rectangle based on the resize direction
          const { x, y, w, h } = selectedRect;
          let newRect = { ...selectedRect };
          if (resizeDirection.left) {
            newRect.w += x - e.offsetX;
            newRect.x = e.offsetX;
          }
          if (resizeDirection.right) {
            newRect.w = e.offsetX - x;
          }
          if (resizeDirection.top) {
            newRect.h += y - e.offsetY;
            newRect.y = e.offsetY;
          }
          if (resizeDirection.bottom) {
            newRect.h = e.offsetY - y;
          }
          setSelectedRect(newRect);
        }
      };      

      const handleMouseUp = () => {
        if (isCreating) {
          setIsCreating(false);
          // Add the newly created rectangle to the list
          onRectanglesChange([...rectangles, newRect]);
          setNewRect(null);
        }
        setIsDragging(false);
        setIsResizing(false);
        setResizeDirection(null);
      };

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [rectangles, selectedRect, onRectanglesChange, setSelectedRect, isCreating, isDragging, isResizing, resizeDirection, newRect]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
  
    if (selectedRect) {
      const { x, y, w, h } = selectedRect;
  
      // Draw the selected rectangle
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.strokeRect(x, y, w, h);
  
      // Set cursor style based on the resize direction
      if (resizeDirection) {
        if (resizeDirection.left) {
          canvas.style.cursor = "ew-resize";
        } else if (resizeDirection.right) {
          canvas.style.cursor = "ew-resize";
        } else if (resizeDirection.top) {
          canvas.style.cursor = "ns-resize";
        } else if (resizeDirection.bottom) {
          canvas.style.cursor = "ns-resize";
        }
      } else {
        canvas.style.cursor = "move";
      }
    } else {
      canvas.style.cursor = "default";
    }
  }, [selectedRect, resizeDirection]);
  
  

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

  return <canvas ref={canvasRef} width={800} height={600} style={canvasStyle} />;
};

export default Canvas;
