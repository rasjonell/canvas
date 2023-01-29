window.UTILS = {
  ALPHA: 'rgba(0, 0, 0, 0)',

  uuid() {
    return Math.random().toString(36).substring(2, 9);
  },

  getRandomCoords() {
    return [
      Math.max(Math.floor(Math.random() * window.innerWidth - 200), 0),
      Math.max(Math.floor(Math.random() * window.innerHeight - 200), 0),
    ];
  },

  getRandomColor() {
    return [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
  },

  drawRandomRect(id, num) {
    const layer = window.canvas.layers.get(id);

    const [x, y] = this.getRandomCoords();
    const [r, g, b] = this.getRandomColor();

    layer.addChild(x, y, 200, 200, (ctx, child) => {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(child.x, child.y, child.width, child.height);

      ctx.font = '50px Arial';
      ctx.fillStyle = `rgb(${Math.abs(255 - r)}, ${Math.abs(255 - g)}, ${Math.abs(255 - b)})`;
      ctx.fillText(num, child.x + child.width - 30, child.y + child.height - 5);
    });
  },
};
