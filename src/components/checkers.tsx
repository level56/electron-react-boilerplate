import React from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Rect, Line } from "react-konva";
import plusShape from "./shapes/plus";
import { useControls } from 'leva'







export default class Checkers extends React.Component {
  width: number;
  height: number;




  constructor(props: any) {
    super(props);
    this.width = 0;
    this.height = 0;
  }

  componentDidMount() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const width = (this.width = windowWidth);
    const height = (this.height = windowHeight);

    const stage = new Konva.Stage({
      container: 'container',
      width: this.width,
      height: this.height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);



  function drawRect(x:number,y:number,width:number,height:number,color:string, stroke:string, strokeWidth:number) {

  var rect = new Konva.Rect({
    x: x,
    y: y,
    width: width,
    height: height,
    fill: color,
    stroke: stroke,
    strokeWidth: strokeWidth,
  })
  return rect
}


const squarePx = 50
// const cols = 4, rows = Math.ceil(canvas.height / squarePx)
const cols = 4, rows = 6
const posX = 20;
const posY = 20;
let outline = drawRect(posX, posY, cols*squarePx, rows*squarePx, 'transparent', 'white', 1)


for (let col = 0; col < cols; col++) {
  for (let row = 0; row < rows; row++) {
    let x = (col * squarePx) + posX, y = (row * squarePx) + posY
    // on even rows, even cols are dark. on odd rows, odd cols are dark
    let evenRow = row % 2 === 0, evenCol = col % 2 === 0
    let fillStyle = evenRow === evenCol ? '#040404' : '#222222'
    // draw at x, y, using fillStyle
    let group = new Konva.Group({})
    let rect = drawRect(x, y, squarePx, squarePx, fillStyle, 'black', 1)
    //let plus = plusShape(squarePx/2+posX,squarePx/2+posY,10,2, 'white')
    group.add(rect)
    //group.add(plus)

    layer.add(group)
  }

}




layer.add(outline)
layer.add(diagonals(posX, posY, cols*squarePx, rows*squarePx, 'grey'))
layer.add(text(posX, posY, cols*squarePx, rows*squarePx, 'CENTERED', 22, 'Helvetica-Bold'))
layer.add(cornerShapes(2, 10, posX, posY, cols*squarePx, rows*squarePx, 'white'))
}


  render() {
    return (
      <div>
        <div id="container"></div>
      </div>
    );
  }


}

function text(x:number, y:number,width:number, height:number, text:string, fontSize:number, fontFamily:string) {


  var backdrop = new Konva.Rect({
    x: x,
    y: y,
    fillLinearGradientStartPoint: { x: x, y: y/2 },
    fillLinearGradientEndPoint: { x: x+width, y: y/2 },

    fillLinearGradientColorStops: [0, 'transparent', 0.2, 'black', 0.5, 'black', .8, 'transparent', 1, 'transparent'],
  })


  var simpleText = new Konva.Text({
    x: x,
    y: y,

    justifyContent: 'center',
    align: 'center',
    verticalAlign: 'middle',
    horizontalAlign: 'center',
    text: text,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fill: 'white',
  })
  var group = new Konva.Group({
  })

  var round = fittedCircle(x, y, width,height, 'grey')
  round.x((x + (width - backdrop.width())/2))
  round.y((y + (height - backdrop.height())/2))
  backdrop.width(simpleText.width()*1.5)
  backdrop.height(simpleText.height()*1.6)

  backdrop.x((x + (width - backdrop.width())/2))
  backdrop.y((y + (height - backdrop.height())/2))
  simpleText.x((x + (width - simpleText.width())/2))
  simpleText.y((y + (height - simpleText.height())/2))

  group.add(round)
  group.add(backdrop)
  group.add(simpleText)
  return group
}


function cornerShapes(thickness:number, cornerSize:number, posX:number, posY:number, width:number, height:number, color:string) {
  var leftTop = new Konva.Line({
    points: [posX, posY, posX+cornerSize, posY, posX+cornerSize, posY+thickness, posX+thickness, posY+thickness, posX+thickness, posY+cornerSize, posX, posY+cornerSize, posX, posY],
    stroke: color,
    strokeWidth: 1,
    fill: color,
    closed: true,

  });

  var rightTop = new Konva.Line({
    points: [posX+width, posY, posX+width-cornerSize, posY, posX+width-cornerSize, posY+thickness, posX+width-thickness, posY+thickness, posX+width-thickness, posY+cornerSize, posX+width, posY+cornerSize, posX+width, posY],
    stroke: color,
    strokeWidth: 1,
    fill: color,
    closed: true,
  });

  var leftBottom = new Konva.Line({
    points: [posX, posY+height, posX+cornerSize, posY+height, posX+cornerSize, posY+height-thickness, posX+thickness, posY+height-thickness, posX+thickness, posY+height-cornerSize, posX, posY+height-cornerSize, posX, posY+height],
    stroke: color,
    strokeWidth: 1,
    fill: color,
    closed: true,
  });

  var rightBottom = new Konva.Line({
    points: [posX+width, posY+height, posX+width-cornerSize, posY+height, posX+width-cornerSize, posY+height-thickness, posX+width-thickness, posY+height-thickness, posX+width-thickness, posY+height-cornerSize, posX+width, posY+height-cornerSize, posX+width, posY+height],
    stroke: color,
    strokeWidth: 1,
    fill: color,
    closed: true,
  });
  var group = new Konva.Group({});
  group.add(leftTop);
  group.add(rightTop);
  group.add(leftBottom);
  group.add(rightBottom);
  return group

  }

  function fittedCircle(x: number, y: number,width:number,height:number, color: string) {
    const shape = new Konva.Circle({
      x: x,
      y: y,
      radius: fit(),
      stroke: color,
      strokeWidth: 1,
      dash: [5, 2],
    });

    function fit() {
      let radius = 0;
      if (width < height) {
        radius = width / 2;
      } else {
        radius = height / 2;
      }
     return radius
    }
    return shape
  }

  function diagonals(x:number, y:number, width:number, height:number, color:string) {
    var left = new Konva.Line({
      points: [x, y, x+width, y+height],
      stroke: color,
      strokeWidth: 1,
      dash: [5, 2],
    });
    var right = new Konva.Line({
      points: [x+width, y, x, y+height],
      stroke: color,
      strokeWidth: 1,
      dash: [5, 2],
    });
    var group = new Konva.Group({});
    group.add(left);
    group.add(right);
    return group
  }

