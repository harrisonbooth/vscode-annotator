// const domToimage = require('dom-to-image');

(function () {
  const container = document.querySelector('#container');
  const snippet = document.querySelector('#snippet');

  const mainCanvas = document.createElement('canvas');
  mainCanvas.setAttribute('width', `${document.body.offsetWidth}`);
  mainCanvas.setAttribute('height', `${document.body.offsetHeight}`);
  // mainCanvas.style.backgroundColor = "rgba(255,255,255,0.4)";
  mainCanvas.style.position = "fixed";
  mainCanvas.style.top = "0";
  mainCanvas.style.left = "0";
  mainCanvas.style.zIndex = "50";
  container.appendChild(mainCanvas);

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.setAttribute('width', `${document.body.offsetWidth}`);
  shadowCanvas.setAttribute('height', `${document.body.offsetHeight}`);
  shadowCanvas.style.position = "fixed";
  shadowCanvas.style.top = "0";
  shadowCanvas.style.left = "0";
  shadowCanvas.style.zIndex = "100";
  container.appendChild(shadowCanvas);

  let pointA = null;
  let pointB = null;

  const context = mainCanvas.getContext("2d");
  const shadowContext = shadowCanvas.getContext("2d");

  function drawLine(context, { x: x1, y: y1 }, { x: x2, y: y2 }) {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.lineCap = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  shadowCanvas.addEventListener('click', e => {
    const x = e.clientX;
    const y = e.clientY;

    if (!pointA) {
      pointA = { x, y };
      pointB = null;
    } else if (pointA && !pointB) {
      pointB = { x, y };
      drawLine(context, pointA, pointB);
      pointA = pointB = null;
    }

  });

  shadowCanvas.addEventListener('click', e => {
    const x = e.clientX;
    const y = e.clientY;

    if (pointA && !pointB) {
      shadowContext.clearRect(0, 0, shadowCanvas.width, shadowCanvas.height);
      drawLine(shadowContext, pointA, { x, y });
    }
  });

  shadowCanvas.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY;

    if (pointA && !pointB) {
      shadowContext.clearRect(0, 0, shadowCanvas.width, shadowCanvas.height);
      drawLine(shadowContext, pointA, { x, y });
    }
  });

  shadowCanvas.addEventListener('contextmenu', e => {
    e.preventDefault();

    shadowContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    if (pointA && !pointB) {
      pointA = null;
    } else {
      shadowContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    }
  });

  document.addEventListener('paste', e => {
    let innerHTML = e.clipboardData.getData('text/html');
    if (!innerHTML) { innerHTML = e.clipboardData.getData('text/plain'); };
    snippet.innerHTML = innerHTML;
  });

  window.addEventListener('message', e => {
    const message = e.data;
    switch (message.command) {
      case 'init':
        console.log("initing");

        document.execCommand('paste');
        break;
      case 'updateSelection':
        console.log("being updated");
        document.execCommand('paste');
        break;
    }
  });


}());
