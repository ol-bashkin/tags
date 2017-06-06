var phoneInput = document.getElementsByClassName('js-tel-input')[0];

function setCursorPosition(pos1, pos2, e) {
  "use strict";
  //e.focus();
  if (e.setSelectionRange) {
    e.setSelectionRange(pos1, pos2);
  } else if (e.createTextRange) {
    var range = e.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos2);
    range.moveStart("character", pos1);
    range.select();
  }
}

phoneInput.addEventListener('click', function (e) {
  "use strict";
  var input = e.target,
    proxy = input.value.replace(/\D/g, "").substr(0, 11),
    curPos = input.selectionStart,
    curPosEnd = input.selectionEnd,
    pattern = "+_ ___ ___ __ __",
    i = 0,
    result = pattern.replace(/_/g, function () {
      return proxy.charAt(i++) || "_";
    });
  input.placeholder = "";
  input.value = result;
  
  curPos === 0 ? setCursorPosition(1, curPosEnd, input) : setCursorPosition(curPos, curPosEnd, input);
  
});

phoneInput.addEventListener('input', function (e) {
  "use strict";
  var input = e.target,
    proxy = input.value.replace(/\D/g, ""),//.substr(0, 11),
    pattern = "+_ ___ ___ __ __",
    i = 0,
    result = pattern.replace(/_/g, function () {
      return proxy.charAt(i++) || "_";
    });
  
  input.value = result;
  
  setCursorPosition(result.replace(/_\s|_/g, "").length, result.replace(/_\s|_/g, "").length, input);
  
});

phoneInput.addEventListener('blur', function (e) {
  var input = e.target,
    proxy = input.value.replace(/\D/g, "");
  if (proxy === '') {
    input.value = "";
    input.placeholder = "+7 ___ ___ __ __";
  }
});

/*
phoneInput.addEventListener('input', function (e) {
  'use strict';
  var errorMsg = document.getElementsByClassName('js-error')[0],
    input = e.target,
    proxy = input.value.replace(/\D/g, ""),
    pattern = '_ ___ ___ __ __';
  
  
  
  if (errorMsg.classList.contains('reg__error_is_visible') && input.value.length !== 0 && input.classList.contains('reg__input_has_error')) {
    errorMsg.classList.remove('reg__error_is_visible');
    input.classList.remove('reg__input_has_error');
  }
  
});

*/



/*


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
  var input = document.getElementsByClassName('js-tel-input')[0];
  input.addEventListener("input", mask, false);
  input.focus();
  setCursorPosition(2, input);
});
*/