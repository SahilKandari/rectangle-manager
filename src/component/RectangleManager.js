import React, { useState, useEffect, useRef } from "react";
import Canvas from "./Canvas";

const RectangleManager = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedRect, setSelectedRect] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const canvasRef = useRef(null);

  const handleRectanglesChange = (newRectangles) => {
    setRectangles(newRectangles);
  };

  const handleDeleteSelectedRect = () => {
    if (selectedRect) {
      const updatedRectangles = rectangles.filter((rect) => rect !== selectedRect);
      setRectangles(updatedRectangles);
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

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rectangles.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setBackgroundImage(imageUrl);
      };
  
      reader.readAsDataURL(file);
    }
  };
  
  const canvasStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
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
        canvasStyle={canvasStyle}
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSaveJSON}>Save Rectangles as JSON (Press 's')</button>
    </div>
  );
};

export default RectangleManager;
