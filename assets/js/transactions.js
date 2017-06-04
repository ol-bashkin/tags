var resize = function () {
  "use strict";
  [].forEach.call(document.getElementsByClassName('js-trans-caption'), function (transCaption, i) {
    var transCaptionStyle = window.getComputedStyle(transCaption, null),
      transItem = document.getElementsByClassName('js-trans-item')[i],
      transItemStyle = window.getComputedStyle(transItem, null),
      transValue = document.getElementsByClassName('js-trans-value')[i],
      transValueStyle = window.getComputedStyle(transValue, null);
    transCaption.style.width = parseInt(transItemStyle.width, 10) - parseInt(transCaptionStyle.marginLeft, 10) - parseInt(transValueStyle.width, 10) - 10 + 'px';
  });
};
resize();
window.addEventListener('resize', resize);