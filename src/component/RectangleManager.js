import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";

const RectangleManager = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedRect, setSelectedRect] = useState(null);

  const handleRectanglesChange = (newRectangles) => {
    setRectangles(newRectangles);
  };

  const handleDeleteSelectedRect = () => {
    if (selectedRect) {
      setRectangles(rectangles.filter((rect) => rect !== selectedRect));
      setSelectedRect(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "s") {
        // Save rectangles as JSON
        handleSaveJSON();
      } else if (e.key === "Delete" || e.key === "Backspace" || e.key === "r") {
        // Remove the selected rectangle
        handleDeleteSelectedRect();
      }
    };

    // Add event listener for keyboard shortcuts
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSaveJSON = () => {
    const jsonRepresentation = { coordinates: {} };
    rectangles.forEach((rect, index) => {
      jsonRepresentation.coordinates[index] = { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
    });

    const jsonString = JSON.stringify(jsonRepresentation);

    // You can also provide a download link for the user to save the JSON.
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rectangles.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="container">
      <h1>Rectangle Manager</h1>
      <Canvas
        rectangles={rectangles}
        onRectanglesChange={handleRectanglesChange}
        selectedRect={selectedRect}
        setSelectedRect={setSelectedRect}
        onDelete={handleDeleteSelectedRect}
      />
      <button onClick={handleSaveJSON}>Save Rectangles as JSON (Press 's')</button>
    </div>
  );
};

export default RectangleManager;
