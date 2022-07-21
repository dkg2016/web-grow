import { overlay } from '../main.js'

class PayBox {

  constructor(wrapId) {
    this.hostView = document.getElementById(wrapId);
    this.canPay = false;
  }

  static getInstance(domId) {
    if (!PayBox.instance) {
      PayBox.instance = new PayBox(domId);
    }
    return PayBox.instance;
  }

  render() {
    const html = `
      <div class="pay-item">
        <div class="text">支付宝</div>
        <div id="aliPay" class="select-icon" pay-type="ALIPAY"></div>
      </div>
      <div class="pay-item">
        <div class="text">微信</div>
        <div id="wePay" class="select-icon" pay-type="WEPAY"></div>
      </div>
      <div class="select-coupon">
        <div class="text">选择优惠券</div>
        <div class="coupon-text">已减 3 > </div>
      </div>
      <div id="confirmBtn" class="confirm-btn">确认</div>
    `;
    this.hostView.innerHTML = html;
    document.querySelectorAll('.select-icon').forEach(dom => {
      dom.addEventListener('click', e => {
        const payType = dom.getAttribute('pay-type');
        const wePayDom = document.getElementById('wePay');
        const aliPayDom = document.getElementById('aliPay');
        if (payType === 'ALIPAY') {
          wePayDom.className = 'select-icon';
          aliPayDom.className = aliPayDom.className.indexOf('active') > 0 ? 'select-icon' : 'select-icon active'
        } else {
          aliPayDom.className = 'select-icon';
          wePayDom.className = wePayDom.className.indexOf('active') > 0 ? 'select-icon' : 'select-icon active'
        }

        if (aliPayDom.className.indexOf('active') > 0 || wePayDom.className.indexOf('active') > 0) {
          document.getElementById('confirmBtn').className = 'confirm-btn active';
          this.canPay = true;
        } else {
          document.getElementById('confirmBtn').className = 'confirm-btn';
          this.canPay = false;
        }
      })
    });

    document.getElementById('confirmBtn').addEventListener('click', e => {
      if (!this.canPay) {
        return;
      }
      console.log('confirm')
    });
    return this;
  }

  show() {
    console.log(overlay)
    overlay.show();
    this.hostView.style.transform = 'translateY(-430rem)';
    return this;
  }

  hide() {
    this.hostView.style.transform = 'translateY(0)';
    return this;
  }


}

export default PayBox;