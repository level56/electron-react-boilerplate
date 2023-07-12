import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange } :any) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      // @ts-ignore
      trRef.current.nodes([shapeRef.current]);
      // @ts-ignore
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          // @ts-ignore
          const scaleX = node.scaleX();
          // @ts-ignore
          const scaleY = node.scaleY();

          // we will reset it back
          // @ts-ignore
          node.scaleX(1);
          // @ts-ignore
          node.scaleY(1);
          onChange({
            ...shapeProps,
            // @ts-ignore
            x: node.x(),
            // @ts-ignore
            y: node.y(),
            // set minimal value
            // @ts-ignore
            width: Math.max(5, node.width() * scaleX),
            // @ts-ignore
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
        // @ts-ignore
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: 'rect2',
  },
];

const TransformStage = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedId, selectShape] = React.useState(null);

  const checkDeselect = (e:any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id as any);
              }}
              onChange={(newAttrs:any) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

// const container = document.getElementById('root');
// const root = createRoot(container as any);
// root.render(<Transform />);

export default TransformStage;
