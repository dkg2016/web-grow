import { svgText, placeData } from './globaldata.js';

function SVGService() {}

SVGService.prototype.init = function() {
  this.innerDOM = document.getElementById('SVGInner');
  this.fullSVGXML = '';
  this.checkedSeatDOM = null;
  this.transInfo = {
    transX: 0,
    transY: 0,
    scale: 0,
    minScale: 0,
    maxScale: 0
  };

  this.seatDOMArr = [];
  this.addXMLUI(svgText);
  this.renderSVG();
}

SVGService.prototype.addXMLUI = function(svgText) {
  svgText = svgText.replace('</defs>', `
    <linearGradient xmlns="http://www.w3.org/2000/svg" x1="50%" y1="100%"     x2="50%" y2="0%" id="occupy-desk">
      <stop stop-color="#E4E4E4" offset="0%"></stop>
      <stop stop-color="#D2D2D2" offset="100%"></stop>
    </linearGradient>
    <linearGradient xmlns="http://www.w3.org/2000/svg" x1="50%" y1="0%" x2="50%" y2="100%" id="occupy-seat">
      <stop stop-color="#E4E4E4" offset="0%"></stop>
      <stop stop-color="#D2D2D2" offset="100%"></stop>
    </linearGradient>
    <linearGradient xmlns="http://www.w3.org/2000/svg" x1="50%" y1="100%"       x2="50%" y2="0%" id="select-desk">
      <stop stop-color="#3CA1FC" offset="0%"></stop>
      <stop stop-color="#3C7CFC" offset="100%"></stop>
    </linearGradient>
    <linearGradient xmlns="http://www.w3.org/2000/svg" x1="50%" y1="0%" x2="50%" y2="100%" id="select-seat">
      <stop stop-color="#5DB3FF" offset="0%"></stop>
      <stop stop-color="#3C6FFC" offset="100%"></stop>
    </linearGradient>
    <linearGradient xmlns="http://www.w3.org/2000/svg" x1="50%" y1="100%"       x2="50%" y2="0%" id="default-desk">
      <stop stop-color="#E5EDFF" offset="0%"></stop>
      <stop stop-color="#E0E9FF" offset="100%"></stop>
    </linearGradient>
    <linearGradient xmlns="http://www.w3.org/2000/svg" x1="50%" y1="0%" x2="50%" y2="100%" id="default-seat">
      <stop stop-color="#E5EDFF" offset="0%"></stop>
      <stop stop-color="#D5E1FC" offset="100%"></stop>
    </linearGradient>
    <pattern id="disable-x" x="0" y="0" width="22" height="22" patternUnits="objectBoundingBox">
      <path xmlns="http://www.w3.org/2000/svg" d="M39.3933983,15.3933983 C40.5649712,14.2218254 42.4644661,14.2218254 43.636039,15.3933983 L43.636039,15.3933983 L49.9997186,21.7567186 L56.363961,15.3933983 C57.5355339,14.2218254 59.4350288,14.2218254 60.6066017,15.3933983 C61.7781746,16.5649712 61.7781746,18.4644661 60.6066017,19.636039 L54.2417186,25.9997186 L60.6066017,32.363961 C61.7313117,33.488671 61.7763001,35.2842339 60.7415669,36.4626121 L60.6066017,36.6066017 C59.4350288,37.7781746 57.5355339,37.7781746 56.363961,36.6066017 L56.363961,36.6066017 L49.9997186,30.2417186 L43.636039,36.6066017 C42.4644661,37.7781746 40.5649712,37.7781746 39.3933983,36.6066017 C38.2218254,35.4350288 38.2218254,33.5355339 39.3933983,32.363961 L45.7567186,25.9997186 L39.3933983,19.636039 C38.2686883,18.511329 38.2236999,16.7157661 39.2584331,15.5373879 Z" id=""></path>
    </pattern>
    </defs>
  `);
  this.fullSVGXML = svgText;
}

SVGService.prototype.renderSVG = function() {
  
  let { innerDOM, fullSVGXML } = this;
  innerDOM.innerHTML = fullSVGXML;

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

SVGService.prototype.initStyle = function() {
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

SVGService.prototype.addClickEvents = function() {
  // const GDoms = this.innerDOM.querySelectorAll('g');
  // const seatDOMArr = Array.from(GDoms).filter(gDOM => /\w{4}\d+-\w{4}\d+/.test(gDOM.id));
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
      }
    })
  })
}

SVGService.prototype.setSeatUI = function(wrapDOM, type) {
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

SVGService.prototype.addGestures = function() {
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

export default new SVGService();