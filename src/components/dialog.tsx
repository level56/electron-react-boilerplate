import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Stage } from 'konva/lib/Stage';
import React from 'react';

import './dialog.css'

class ContextMenu extends React.Component {
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

    // add default shape
    const shape = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 50,
      fill: 'red',
      shadowBlur: 10,
    });
    layer.add(shape);

    stage.on('dblclick dbltap', function () {
      // add a new shape
      const newShape = new Konva.Circle({
        // @ts-ignore
        x: stage.getPointerPosition().x,
        // @ts-ignore
        y: stage.getPointerPosition().y,
        radius: 10 + Math.random() * 30,
        fill: Konva.Util.getRandomColor(),
        shadowBlur: 10,
      });
      layer.add(newShape);
    });

    // setup menu
    let currentShape: Stage | Shape<ShapeConfig>;
    const menuNode = document.getElementById('menu');
    // @ts-ignore
    document.getElementById('pulse-button').addEventListener('click', () => {
      currentShape.to({
        scaleX: 2,
        scaleY: 2,
        onFinish: () => {
          currentShape.to({ scaleX: 1, scaleY: 1 });
        },
      });
    });
    // @ts-ignore
    document.getElementById('delete-button').addEventListener('click', () => {
      currentShape.destroy();
    });

    window.addEventListener('click', () => {
      // hide menu
      // @ts-ignore
      menuNode.style.display = 'none';
    });

    stage.on('contextmenu', function (e) {
      // prevent default behavior
      e.evt.preventDefault();
      if (e.target === stage) {
        // if we are on empty place of the stage we will do nothing
        return;
      }
      currentShape = e.target;
      // show menu
      // @ts-ignore
      menuNode.style.display = 'initial';
      const containerRect = stage.container().getBoundingClientRect();
      // @ts-ignore
      menuNode.style.top = `${
        // @ts-ignore
        containerRect.top + stage.getPointerPosition().y + 4
      }px`;
      // @ts-ignore
      menuNode.style.left = `${
        // @ts-ignore
        containerRect.left + stage.getPointerPosition().x + 4
      }px`;
    });

    layer.draw();
  }

  render() {
    return (
      <div>
        <div id="container"></div>
        <div id="menu" style={{ display: 'none' }}>
          <button id="pulse-button">Pulse</button>
          <button id="delete-button">Delete</button>
        </div>
      </div>
    );
  }
}
export default ContextMenu;
