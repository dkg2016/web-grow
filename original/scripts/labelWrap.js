export default class LabelWrap {
  constructor(hostId) {
    this.hostView = document.getElementById(hostId);
  }

  render() {
    const html = `
      <div class="label">
        <div class="label-icon appointed"></div>
        <div class="label-name">已预约</div>
      </div>
      <div class="label">
        <div class="label-icon available"></div>
        <div class="label-name">可预约</div>
      </div>
      <div class="label">
        <div class="label-icon"></div>
        <div class="label-name">不可用</div>
      </div>
    `;
    this.hostView.innerHTML = html;
  }
}