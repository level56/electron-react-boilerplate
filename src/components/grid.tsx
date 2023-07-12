import React from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect } from "react-konva";

const WIDTH = 48;
const HEIGHT = 48;

const grid = [["red", "yellow"], ["green", "blue"]];

export default function Gridder (){
  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const startX = Math.floor((-stagePos.x - window.innerWidth) / WIDTH) * WIDTH;
  const endX =
    Math.floor((-stagePos.x + window.innerWidth * 2) / WIDTH) * WIDTH;

  const startY =
    Math.floor((-stagePos.y - window.innerHeight) / HEIGHT) * HEIGHT;
  const endY =
    Math.floor((-stagePos.y + window.innerHeight * 2) / HEIGHT) * HEIGHT;

  const gridComponents = [];
  var i = 0;
  for (var x = startX; x < endX; x += WIDTH) {
    for (var y = startY; y < endY; y += HEIGHT) {
      if (i === 4) {
        i = 0;
      }

      const indexX = Math.abs(x / WIDTH) % grid.length;
      const indexY = Math.abs(y / HEIGHT) % grid[0].length;









      function color(color: any, color1: any, color2: any) {
        if (color === "red") {
          color = color1;
        } else if (color === "yellow") {
          color = color2;
        } else if (color === "green") {
          color = color2;
        } else if (color === "blue") {
          color = color1;
        }
        return color;

      }


      gridComponents.push(
        <Rect
          x={x}
          y={y}
          width={WIDTH}
          height={HEIGHT}
          fill={color(grid[indexX][indexY], "red", "darkred")}

          stroke="black"
        />
      );
    }
  }
  return (
    <Stage
      x={stagePos.x}
      y={stagePos.y}
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      onDragEnd={e => {
        setStagePos(e.currentTarget.position());
      }}
    >
      <Layer>{gridComponents}</Layer>
    </Stage>
  );
};


render(<Gridder />, document.getElementById("root"));
