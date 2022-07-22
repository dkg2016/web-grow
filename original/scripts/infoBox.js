import { payBoxInstance } from '../main.js'

class InfoBox {
  constructor() {
    this.hostView = document.getElementById('infoBox');
  }

  static getInstance() {
    if (!infoBox.instance) {
      infoBox.instance = new InfoBox();
    }
    return infoBox.instance;
  }

  show() {
    this.hostView.style.transform = 'translateY(-259rem)';
    return this;
  }

  hide() {
    this.hostView.style.transform = 'translateY(0)';
    return this;
  }

  render(seatInfo = '') {
    const html = `
      <div class="place-info">${seatInfo}</div>
      <div id="appointBtn" class="appoint-btn">立即预约</div>
    `;
    this.hostView.innerHTML = html;
    document.getElementById('appointBtn').addEventListener('click', e => {
      payBoxInstance.show();
    });
    return this;
  }
}

export default InfoBox.getInstance();