import { overlaySub } from './globaldata.js';

class Overlay {
  constructor() {
    const overlayDiv = document.createElement('div');
    overlayDiv.style = `position: fixed; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0,0,0,0); z-index: 3; visibility: hidden; transition: background .3s`;

    this.hostView = overlayDiv;
    document.body.appendChild(this.hostView);

    this.addClickEvent();
  }

  static getInstance() {
    if (!Overlay.instance) {
      Overlay.instance = new Overlay();
    }
    return Overlay.instance;
  }

  show() {
    this.hostView.style.background = 'rgba(0,0,0,0.5)';
    this.hostView.style.visibility = 'visible';
  }

  hide() {
    overlaySub.next();
    this.hostView.style.visibility = 'hidden';
    this.hostView.style.background = 'rgba(0,0,0,0)';
  }

  addClickEvent() {
    this.hostView.addEventListener('click', e => {
     this.hide();
    });
  }
}

export default Overlay.getInstance();