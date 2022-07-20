import { svgText, placeData, uiXMLText, selectSeatSub } from './globaldata.js';

class svgService {
  constructor() {
    this.innerDOM = document.getElementById('SVGInner');
    this.svgDOM = null;
    this.checkedSeatDOM = null;
    this.transInfo = {
      transX: 0,
      transY: 0,
      scale: 0,
      minScale: 0,
      maxScale: 0
    };

    this.seatDOMArr = [];
    this.uiXmlDOM = this.getUiXmlDOM();
  }

  static getInstance() {
    if (!svgService.instance) {
      svgService.instance = new svgService();
    }
    return svgService.instance;
  }

  render() {
    this.addXMLUI();
    this.renderSVG();
  }

  addXMLUI() {
    const svgDom = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const defsDOM = svgDom.querySelector('defs');
    if (defsDOM) {
      defsDOM.append(...this.uiXmlDOM.childNodes[0].childNodes)
    }
    this.svgDom = svgDom;
  }

  renderSVG() {
    let { innerDOM, svgDom } = this;
    innerDOM.append(svgDom.childNodes[0]);

    const { clientWidth: outerWidth, clientHeight: outerHeight } = document.getElementById('SVGOuter');

    const { clientWidth: innerWidth, clientHeight: innerHeight } = innerDOM;
    const scale = Math.min(outerWidth / innerWidth, outerHeight / innerHeight);
    const transX = (outerWidth - innerWidth) / 2;
    const transY = (outerHeight - innerHeight) / 2;

    const defaultTransform = `translate(${transX}px, ${transY}px) scale(${scale})`;
    innerDOM.style.transform = defaultTransform;

    Object.assign(this.transInfo, {
      transX,
      transY,
      scale,
      minScale: scale,
      maxScale: 0.5
    });

    this.initStyle();
    this.addGestures();
    this.addClickEvents();
  }

  initStyle() {
    placeData.forEach(room => {
      const { roomName } = room;
      room.seats.forEach(seat => {
        const { svgObjId, seatNum,  } = seat;
        const seatDOM = document.getElementById(svgObjId);
        seatDOM.setAttribute('occupied', false);
        seatDOM.setAttribute('seat-checked', false);
        seatDOM.setAttribute('select-seat', `杭州西湖店-${roomName} 座位${seatNum}`);
        this.seatDOMArr.push(seatDOM);
        
        // 模拟
        if (!(seatNum % 5)) {
          seatDOM.setAttribute('occupied', true);
          this.setSeatUI(seatDOM, 'occupy');
        }
      });
    });
  }

  addClickEvents() {
    this.seatDOMArr.forEach(seatDOM => {
      seatDOM.addEventListener('click', () => {
        const seatChecked = seatDOM.getAttribute('seat-checked');
        const seatOccupied = seatDOM.getAttribute('occupied');
        if (seatOccupied === 'true') {
          return;
        }
  
        if (seatChecked === 'true') {
          seatDOM.setAttribute('seat-checked', false);
          this.setSeatUI(seatDOM, 'default');
          this.checkedSeatDOM = null;
          selectSeatSub.next(null);
        } else {
          seatDOM.setAttribute('seat-checked', true);
          this.setSeatUI(seatDOM, 'select');
          if (this.checkedSeatDOM) {
            this.checkedSeatDOM.setAttribute('seat-checked', false);
            this.setSeatUI(this.checkedSeatDOM, 'default');
          }
          this.checkedSeatDOM = seatDOM;
          let selectInfo = seatDOM.getAttribute('select-seat');
          console.log('selectInfo:', selectInfo);
          selectSeatSub.next(selectInfo);
        }
      })
    });
  }

  setSeatUI(wrapDOM, type) {
    let deskFillUrl = '';
    let seatFillUrl = '';
    let textFillColor = '';
    if (type === 'select') {
      deskFillUrl = 'url(#select-desk)';
      seatFillUrl = 'url(#select-seat)';
      textFillColor = '#FFF';
    } else if (type === 'occupy') {
      deskFillUrl = 'url(#occupy-desk)';
      seatFillUrl = 'url(#occupy-seat)';
      textFillColor = '#FFF';
    }  else if (type === 'disable') {
      deskFillUrl = 'rgb(245, 247, 250)';
      seatFillUrl = 'rgb(245, 247, 250)';
      textFillColor = '#FFF';
    } else if (type === 'default') {
      deskFillUrl = 'url(#default-desk)';
      seatFillUrl = 'url(#default-seat)';
      textFillColor = '#B2C1DD';
    } else {
      deskFillUrl = 'url(#default-desk)';
      seatFillUrl = 'url(#default-seat)';
      textFillColor = '#B2C1DD';
    }

    wrapDOM.querySelectorAll('rect#desk').forEach((deskDom) => {
      deskDom.setAttribute('fill', deskFillUrl);
    });
    wrapDOM.querySelectorAll('path#cushion').forEach((cushionDom) => {
      cushionDom.setAttribute('fill', seatFillUrl)
    });
    wrapDOM.querySelectorAll('path#armrest').forEach((armDom) => {
      armDom.setAttribute('fill', seatFillUrl)
    });
    if (type === 'disable') {
      wrapDOM.querySelectorAll('text').forEach((textDom) => {
        textDom.setAttribute('fill', textFillColor)
      });
    } else {
      wrapDOM.querySelectorAll('text').forEach((textDom) => {
        textDom.setAttribute('fill', textFillColor)
      });
    }
  }

  addGestures() {
    const hammer = new Hammer(this.innerDOM)
    hammer.get('pinch').set({ enable: true });
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    
    // 开始移动
    hammer.on('panmove', e => {
      const { scale, transX, transY } = this.transInfo;
      const x = transX + e.deltaX;
      const y = transY + e.deltaY;
      this.innerDOM.style.transform = `translate(${x}px,${y}px) scale(${scale})`
    });
    // 移动停止
    hammer.on('panend', e => {
      const { transX, transY } = this.transInfo;
      const x = transX + e.deltaX
      const y = transY + e.deltaY
      this.transInfo.transY = y;
      this.transInfo.transX = x;
    });

    // 缩放
    hammer.on('pinchmove', e => {
      let { scale, minScale, maxScale, transX, transY } = this.transInfo;
      scale *= e.scale;
      scale = scale > maxScale ? maxScale : (scale < minScale ? minScale : scale);
      this.innerDOM.style.transform = `translate(${transX}px,${transY}px) scale(${scale})`;
    });

    hammer.on('pinchend', e => {
      let { scale, minScale, maxScale } = this.transInfo;
      scale *= e.scale;
      scale = scale > maxScale ? maxScale : (scale < minScale ? minScale : scale);
      this.transInfo.scale = scale;
    });
  }

  getUiXmlDOM() {
    return new DOMParser().parseFromString(uiXMLText, 'image/svg+xml');
  }
}

export default svgService.getInstance();
