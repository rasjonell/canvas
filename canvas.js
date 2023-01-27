class Layer {
  constructor(options) {
    this.children = [];
    this.x = options.x;
    this.y = options.y;
    this.id = options.id;
    this.width = options.width;
    this.height = options.height;
  }

  addChild(drawFunction) {
    this.children.push(drawFunction);
  }
}

class Canvas {
  constructor() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.dirty = false;
    this.canvas = canvas;
    this.layers = new Map();
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(canvas);
  }

  addLayer(options) {
    const id =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    options.id = id;

    const layer = new Layer(options);

    this.context.save();
    this.context.fillStyle = UTILS.ALPHA;
    this.context.fillRect(options.x, options.y, options.width, options.height);
    this.layers.set(id, layer);
    this.context.restore();

    this.dirty = true;

    return layer;
  }

  removeLayer(id) {
    const layer = this.layers.get(id);

    this.context.save();
    this.context.clearRect(layer.x, layer.y, layer.width, layer.height);
    this.layers.delete(id);
    this.context.restore();

    this.dirty = true;
  }

  drawChildren(id) {
    this.context.save();
    this.layers.get(id).children.forEach((childDrawer) => childDrawer(this.context));
    this.context.restore();

    this.dirty = true;
  }

  addChildToLayer(drawFunction, id) {
    this.layers.get(id).addChild(drawFunction);

    this.dirty = true;
  }

  clearLayer(layerId) {
    if (!this.layers.has(layerId)) {
      throw new Error('Layer not found');
    }

    this.layers.get(layerId).children = [];

    this.dirty = true;
  }

  reorderLayers() {
    const newLayers = new Map();
    [...this.layers.values()].reverse().forEach((layer) => newLayers.set(layer.id, layer));
    this.layers = newLayers;

    this.dirty = true;
  }

  draw() {
    if (!this.dirty) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.layers.forEach((layer, id) => {
      this.context.save();
      this.context.fillStyle = UTILS.ALPHA;
      this.context.fillRect(layer.x, layer.y, layer.width, layer.height);
      this.drawChildren(id);
      this.context.restore();
    });
    this.dirty = false;
  }
}

window.canvas = new Canvas();

window.layer1 = window.canvas.addLayer({
  x: 0,
  y: 0,
  width: window.canvas.canvas.width,
  height: window.canvas.canvas.height,
});

window.layer2 = window.canvas.addLayer({
  x: 0,
  y: 0,
  width: window.canvas.canvas.width,
  height: window.canvas.canvas.height,
});

window.canvas.addChildToLayer((ctx) => {
  ctx.fillStyle = 'red';
  ctx.fillRect(100, 100, 200, 200);

  ctx.font = '50px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('1', 270, 295);
}, window.layer1.id);

window.canvas.addChildToLayer((ctx) => {
  ctx.fillStyle = 'black';
  ctx.fillRect(50, 50, 200, 200);

  ctx.font = '50px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('2', 220, 245);
}, window.layer2.id);

function render() {
  window.canvas.draw();
  requestAnimationFrame(render);
}

render();
