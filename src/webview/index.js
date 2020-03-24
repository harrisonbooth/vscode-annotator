// const domToimage = require('dom-to-image');

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#container');
  const snippet = document.querySelector('#snippet');

  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', `${document.body.offsetWidth}`);
  canvas.setAttribute('height', `${document.body.offsetHeight}`);
  // canvas.style.backgroundColor = "rgba(255,255,255,0.4)";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  container.appendChild(canvas);

  let draw = false;
  let pointA = null;
  let pointB = null;

  const context = canvas.getContext("2d");

  function drawLine() {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.lineCap = "round";
    context.moveTo(pointA.x, pointA.y);
    context.lineTo(pointB.x, pointB.y);
    context.stroke();
  }

  canvas.addEventListener('click', e => {
    const x = e.clientX;
    const y = e.clientY;

    if (!pointA) {
      pointA = { x, y };
      pointB = null;
    } else if (pointA && !pointB) {
      pointB = { x, y };
      drawLine();
      pointA = pointB = null;
    }

  });

  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.addEventListener('paste', e => {
    const innerHTML = e.clipboardData.getData('text/html');
    snippet.innerHTML = innerHTML;
  });

  window.addEventListener('message', e => {
    const message = e.data;
    switch (message.command) {
      case 'init':
        document.execCommand('paste');
        break;
      case 'updateSelection':
        document.execCommand('paste');
        break;
    }
  });
});

