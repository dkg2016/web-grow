import { selectSeatSub, overlaySub } from './scripts/globaldata.js';
import svg from './scripts/svg.js';
import InfoBox from './scripts/infoBox.js';

import PayBox from './scripts/payBox.js'


// 顶部 label
import LabelWrap from './scripts/labelWrap.js';
new LabelWrap('labelWrap').render();

// SVG
svg.render();

// payBox
export const payBoxInstance = PayBox.getInstance('payBox');

// overlay
export { default as overlay } from './scripts/overlay.js';

// 所选座位信息
selectSeatSub.subscribe(res => {
  if (res) {
    InfoBox.render(res).show();
  } else {
    InfoBox.hide();
  }
});

overlaySub.subscribe(res => {
  payBoxInstance.hide();
})