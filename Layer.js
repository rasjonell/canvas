class Layer {
  constructor(canvas, zIndex) {
    this.canvas = canvas;
    this.zIndex = zIndex;
    this.children = new Map();
    this.id = window.UTILS.uuid();
  }

  addChild(x, y, width, height, draw) {
    const child = {
      x,
      y,
      draw,
      width,
      height,
      id: window.UTILS.uuid(),
    };

    this.children.set(child.id, child);
    this.canvas.dirty = true;
  }

  draw() {
    this.children.forEach((child) => {
      this.canvas.context.save();
      child.draw(this.canvas.context, child);
      this.canvas.context.restore();
    });
  }
}

window.Layer = Layer;
