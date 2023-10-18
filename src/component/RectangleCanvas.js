// import React, { useRef, useState } from 'react';
// import { Stage, Layer, Rect } from 'react-konva';

// function RectangleCanvas() {
//   const stageRef = useRef(null);
//   const [rectangles, setRectangles] = useState([]);

//   const handleMouseDown = (e) => {
//     const { x, y } = e.target.getStage().getPointerPosition();
//     const newRectangle = {
//       x,
//       y,
//       width: 100,
//       height: 50,
//       fill: 'blue',
//     };

//     setRectangles([...rectangles, newRectangle]);
//   };

//   return (
//     <div>
//       <Stage
//         width={window.innerWidth}
//         height={window.innerHeight}
//         onMouseDown={handleMouseDown}
//         ref={stageRef}
//       >
//         <Layer>
//           {rectangles.map((rect, index) => (
//             <Rect
//               key={index}
//               x={rect.x}
//               y={rect.y}
//               width={rect.width}
//               height={rect.height}
//               fill={rect.fill}
//             />
//           ))}
//         </Layer>
//       </Stage>
//     </div>
//   );
// }

// export default RectangleCanvas;
