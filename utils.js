window.UTILS = {
  ALPHA: 'rgba(0, 0, 0, 0)',

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

  drawRandomRect(layerNum) {
    const layer = window[`layer${layerNum}`];

    const [x, y] = this.getRandomCoords();
    const [r, g, b] = this.getRandomColor();

    canvas.addChildToLayer((ctx) => {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, 200, 200);

      ctx.font = '50px Arial';
      ctx.fillStyle = `rgb(${Math.abs(255 - r)}, ${Math.abs(255 - g)}, ${Math.abs(255 - b)})`;
      ctx.fillText(layerNum, 170 + x, 195 + y);
    }, layer.id);
  },
};
