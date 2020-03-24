// const domToimage = require('dom-to-image');

document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('h1')

  document.addEventListener('paste', e => {
    const innerHTML = e.clipboardData.getData('text/html');
    h1.innerHTML = innerHTML;
  });

  window.addEventListener('message', e => {
    const message = e.data;
    switch (message.command) {
      case 'updateSelection':
        document.execCommand('paste');
        break;
    }
  })
})

