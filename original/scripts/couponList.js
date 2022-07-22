import { couponList } from './globaldata.js';
import { payBoxInstance } from '../main.js';
class CouponList {
  selectCouponDom = null;
  constructor(wrapId) {
    this.hostView = document.getElementById(wrapId);
    let html = couponList.map(({name, expiredTime, discount}) => {
      return `<div class="coupon" data-discount=${discount}>
        <div class="coupon-name">${name}</div>
        <div class="expire-time">到期时间：${expiredTime}</div>
      </div>`;
    });
    this.hostView.innerHTML = 
    `<div id="couponList" class="coupon-list"><div class="title">优惠券</div>`
    + html.join('') 
    + `
      <div id="closeCoupon" class="close-btn"></div>
      </div>`;
    payBoxInstance.updateCouponText(`可用优惠券 ${couponList.length} 张 >`);

    this.addListener();
  }
  
  show() {
    this.hostView.style.transform = 'rotate(0)';
  }

  hide() {
    this.hostView.style.transform = 'rotate(90deg)';
  }

  addListener() {
    document.getElementById('closeCoupon').addEventListener('click', e => {
      this.hide();
    });

    const couponDomList = Array.from(document.getElementsByClassName('coupon'));
    couponDomList.forEach((element, idx) => {
      element.addEventListener('click', e => {
        if (this.selectCouponDom) {
          this.selectCouponDom.setAttribute('class',"coupon");
        }
        couponDomList[idx].setAttribute('class',"coupon select");
        this.selectCouponDom = couponDomList[idx];
        payBoxInstance.updateCouponText(`- ${couponList[idx].discount} >`)
      })
    });
  }
}

export default CouponList;