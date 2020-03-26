// const domToimage = require('dom-to-image');
class CanvasManager {
  constructor(
    container
  ) {
    this.container = container;
    this.colour = "red";
    this.lineWidth = 3;

    this.mainCanvas;
    this.shadowCanvas;

    this.mainContext;
    this.shadowContext;

    this.pointA = null;
    this.pointB = null;
  }

  setColour(colour) {
    this.colour = colour;
  }

  createCanvases() {
    const mainCanvas = document.createElement('canvas');
    mainCanvas.setAttribute('width', `${document.body.offsetWidth}`);
    mainCanvas.setAttribute('height', `${document.body.offsetHeight}`);
    mainCanvas.style.position = "fixed";
    mainCanvas.style.top = "0";
    mainCanvas.style.left = "0";
    mainCanvas.style.zIndex = "50";

    this.mainCanvas = mainCanvas;
    this.mainContext = mainCanvas.getContext('2d');
    this.container.appendChild(mainCanvas);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.setAttribute('width', `${document.body.offsetWidth}`);
    shadowCanvas.setAttribute('height', `${document.body.offsetHeight}`);
    shadowCanvas.style.position = "fixed";
    shadowCanvas.style.top = "0";
    shadowCanvas.style.left = "0";
    shadowCanvas.style.zIndex = "100";

    this.shadowCanvas = shadowCanvas;
    this.shadowContext = shadowCanvas.getContext('2d');
    this.container.appendChild(shadowCanvas);

    this.setupListeners();
  }

  setupListeners() {
    this.shadowCanvas.addEventListener('click', e => {
      const x = e.clientX;
      const y = e.clientY;

      if (!this.pointA) {
        this.pointA = { x, y };
        this.pointB = null;
      } else if (this.pointA && !this.pointB) {
        this.pointB = { x, y };
        this.drawLine(this.mainContext, this.pointA, this.pointB);
        this.pointA = this.pointB = null;
      }
    });

    this.shadowCanvas.addEventListener('click', e => {
      const x = e.clientX;
      const y = e.clientY;

      if (this.pointA && !this.pointB) {
        this.shadowContext.clearRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
        this.drawLine(this.shadowContext, this.pointA, { x, y });
      }
    });

    this.shadowCanvas.addEventListener('mousemove', e => {
      const x = e.clientX;
      const y = e.clientY;

      if (this.pointA && !this.pointB) {
        this.shadowContext.clearRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
        this.drawLine(this.shadowContext, this.pointA, { x, y });
      }
    });

    this.shadowCanvas.addEventListener('contextmenu', e => {
      e.preventDefault();

      this.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

      if (this.pointA && !this.pointB) {
        this.pointA = null;
      } else {
        this.shadowContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
      }
    });
  }

  teardown() {
    if (this.shadowCanvas && this.mainCanvas) {
      this.container.removeChild(this.shadowCanvas);
      this.container.removeChild(this.mainCanvas);
      this.mainCanvas = this.shadowCanvas = undefined;
    }
  }

  drawLine(context, { x: x1, y: y1 }, { x: x2, y: y2 }) {
    context.beginPath();
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.colour;
    context.lineCap = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }
}


function doIt() {
  const vscode = acquireVsCodeApi();
  vscode.postMessage({ command: 'loaded' });

  const container = document.querySelector('#container');
  const snippet = document.querySelector('#snippet');

  const canvasManager = new CanvasManager(container);

  document.addEventListener('paste', e => {
    let innerHTML = e.clipboardData.getData('text/html');
    if (!innerHTML) { innerHTML = e.clipboardData.getData('text/plain'); };

    snippet.innerHTML = innerHTML;
  });

  window.addEventListener('message', e => {
    const message = e.data;
    switch (message.command) {
      case 'updateSelection':
        canvasManager.teardown();
        document.execCommand('paste');
        canvasManager.createCanvases();
        break;
      case 'changeColour':
        canvasManager.setColour(message.colour);
        console.log("changed to", message.colour);
        break;
    }
  });
};

document.addEventListener('DOMContentLoaded', doIt);
