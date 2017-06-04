function setCursorPosition(pos, e) {
  "use strict";
  e.focus();
  if (e.setSelectionRange) {
    e.setSelectionRange(pos, pos);
  } else if (e.createTextRange) {
    var range = e.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
}

function mask(e) {
  var matrix = this.placeholder,
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = this.value.replace(/\D/g, "");
  def.length >= val.length && (val = def);
  matrix = matrix.replace(/[_\d]/g, function (a) {
    return val.charAt(i++) || "_";
  });
  this.value = matrix;
  i = matrix.lastIndexOf(val.substr(-1));
  i < matrix.length && matrix !== this.placeholder ? i++ : i = matrix.indexOf("_");
  setCursorPosition(i, this);
}

window.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementsByClassName('js-code-input')[0];
  input.addEventListener("input", mask, false);
  input.focus();
  setCursorPosition(3, input);
});