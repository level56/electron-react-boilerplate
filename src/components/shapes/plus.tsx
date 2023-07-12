import React from 'react';
import Konva from 'konva';

import { Stage, Layer, Rect, Text } from 'react-konva';
import { render } from '@testing-library/react';
import { KonvaEventObject } from 'konva/lib/Node';




export default function plusShape(x:number,y:number,scale:number, thickness:number, color:string) {
const group = new Konva.Group({});

const horizontalLine = new Konva.Rect({
  x: 0,
  y: scale/2 - thickness/2,
  width: scale,
  height: thickness,
  fill: color,
  draggable: true,
});

const verticalLine = new Konva.Rect({
  x: scale/2 + thickness/2,
  y: 0,
  width: scale,
  height: thickness,
  fill: color,

  draggable: true,
  rotation: 90,
});

group.add(horizontalLine);
group.add(verticalLine);
group.offsetX(-x+scale/2);
group.offsetY(-y+scale/2);
return group;
}
