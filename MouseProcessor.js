window.MouseProcessor = {
  currentLayer: null,
  currentChild: null,
  clickedChild: null,

  offset: {
    x: 0,
    y: 0,
  },

  current: {
    x: 0,
    y: 0,
  },

  utils: {
    isInBound: (coords, bound) =>
      coords.x > bound.x &&
      coords.x < bound.x + bound.width &&
      coords.y > bound.y &&
      coords.y < bound.y + bound.height,
  },

  Highlight(canvasInstance) {
    const canvas = canvasInstance.canvas;
    const layers = canvasInstance.layers;

    return {
      click: (event) => {
        const layersArray = [...layers.values()].sort((a, b) => b.zIndex - a.zIndex);
        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        [...layers.values()]
          .sort((a, b) => a.zIndex - b.zIndex)
          .forEach((layer) => {
            layer.children.forEach((child) => {
              if (this.utils.isInBound({ x, y }, child)) {
                this.clickedChild = child.id === this.clickedChild?.id ? null : child;
              }
            });
          });

        if (this.clickedChild) {
          canvasInstance.highlight(this.clickedChild);
        } else {
          canvasInstance.clearHighlight();
        }
      },
    };
  },

  DragAndDrop(canvasInstance) {
    const canvas = canvasInstance.canvas;
    const layers = canvasInstance.layers;

    return {
      mouseDown: (event) => {
        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;

        [...layers.values()]
          .sort((a, b) => a.zIndex - b.zIndex)
          .forEach((layer) => {
            layer.children.forEach((child) => {
              if (this.utils.isInBound({ x, y }, child)) {
                this.current = { x, y };
                this.offset = { x: x - child.x, y: y - child.y };
                this.currentChild = child;
                this.currentLayer = layer;
              }
            });
          });
      },

      mouseMove: (event) => {
        if (!(this.currentChild && this.currentLayer)) return;
        canvasInstance.clearHighlight();

        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;
        this.currentChild.x = x - this.offset.x;
        this.currentChild.y = y - this.offset.y;

        layers.get(this.currentLayer.id).children.set(this.currentChild.id, this.currentChild);

        canvasInstance.dirty = true;
      },

      mouseUp: (_event) => {
        this.currentChild = null;
        this.currentLayer = null;
      },
    };
  },
};
