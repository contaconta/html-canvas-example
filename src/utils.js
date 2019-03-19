export default {
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = e => reject(e);
      img.src = src;
    });
  },
  getMousePositionFromCanvas: (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  },
  convertCanvasToBase64(canvas) {
    const base64_png = canvas.toDataURL("image/png");
    return base64_png;
  }
};
