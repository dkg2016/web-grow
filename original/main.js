import { selectSeatSub } from './scripts/globaldata.js';
import svg from './scripts/svg.js';
import InfoBox from './scripts/infoBox.js';

// 顶部 label
import LabelWrap from './scripts/labelWrap.js';
new LabelWrap('labelWrap').render();

// SVG
svg.render();

// 所选座位信息
selectSeatSub.subscribe(res => {
  if (res) {
    InfoBox.render(res).show();
  } else {
    InfoBox.hide();
  }
});