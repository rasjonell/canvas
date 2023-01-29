class Canvas {
  constructor() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.zIndex = 0;
    this.dirty = false;
    this.canvas = canvas;
    this.layers = new Map();
    this.context = this.canvas.getContext('2d');
    this.highlightProcessor = MouseProcessor.Highlight(this);
    this.dragAndDropProcessor = MouseProcessor.DragAndDrop(this);

    this.highlightLayer = new Layer(this, Infinity);

    this.canvas.addEventListener('click', this.highlightProcessor.click);
    this.canvas.addEventListener('mousedown', this.dragAndDropProcessor.mouseDown);
    this.canvas.addEventListener('mousemove', this.dragAndDropProcessor.mouseMove);
    this.canvas.addEventListener('mouseup', this.dragAndDropProcessor.mouseUp);

    document.body.appendChild(canvas);
  }

  addLayer() {
    const layer = new Layer(this, this.zIndex++);
    this.layers.set(layer.id, layer);
    return layer;
  }

  highlight(child) {
    this.highlightLayer.children = new Map();
    this.highlightLayer.addChild(
      child.x - 2,
      child.y - 2,
      child.width + 4,
      child.height + 4,
      (ctx, child) => {
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.strokeRect(child.x, child.y, child.width, child.height);
      },
    );

    this.dirty = true;
  }

  clearHighlight() {
    this.highlightLayer.children = new Map();
    this.dirty = true;
  }

  removeLayer(id) {
    this.layers.delete(id);
    this.dirty = true;
  }

  reorderLayers() {
    const newLayers = new Map();
    const zIndexes = [...this.layers.values()]
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((layer) => layer.zIndex);

    [...this.layers.values()].reverse().forEach((layer, index) => {
      layer.zIndex = zIndexes[index];
      newLayers.set(layer.id, layer);
    });

    this.layers = newLayers;
    this.dirty = true;
  }

  clearLayer(layerId) {
    this.layers.get(layerId).children = new Map();
    this.dirty = true;
  }

  draw() {
    if (!this.dirty) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    [...this.layers.values()].sort((a, b) => a.zIndex - b.zIndex).forEach((layer) => layer.draw());
    this.highlightLayer.draw();
    this.dirty = false;
  }
}

const canvas = new Canvas();

const layer1 = canvas.addLayer();
const layer2 = canvas.addLayer();

layer1.addChild(100, 100, 200, 200, (ctx, child) => {
  ctx.fillStyle = 'red';
  ctx.fillRect(child.x, child.y, child.width, child.height);

  ctx.font = '50px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('1', child.x + child.width - 30, child.y + child.width - 5);
});

layer2.addChild(50, 50, 200, 200, (ctx, child) => {
  ctx.fillStyle = 'black';
  ctx.fillRect(child.x, child.y, child.width, child.height);

  ctx.font = '50px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('2', child.x + child.width - 30, child.y + child.width - 5);
});

window.canvas = canvas;
window.layer1 = layer1;
window.layer2 = layer2;

function render() {
  window.canvas.draw();
  requestAnimationFrame(render);
}

render();
