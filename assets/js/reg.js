var phoneInput = document.getElementsByClassName('js-tel-input')[0],
  submit = document.getElementsByClassName('js-submit')[0];

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
    errorMsg = document.getElementsByClassName('js-error')[0],
    proxy = input.value.replace(/\D/g, ""),
    curPos = input.selectionStart,
    curPosEnd = input.selectionEnd,
    pattern = "+_ ___ ___ __ __",
    i = 0,
    result = pattern.replace(/_/g, function (match, pos) {
      return proxy.charAt(0) === "" && pos === 1 ? 7 : proxy.charAt(i++) || "_";
    }),
    submit = document.getElementsByClassName('js-submit')[0];

  if (errorMsg) {
    if (errorMsg.classList.contains('reg__error_is_visible') && input.classList.contains('reg__input_has_error')) {
      console.log('myau');
      errorMsg.classList.remove('reg__error_is_visible');
      input.classList.remove('reg__input_has_error');
    }
  }

  if (submit.classList.contains('reg__submit_is_passive')) {
    submit.classList.remove('reg__submit_is_passive');
  }

  input.placeholder = "";
  input.value = result;
  curPos = curPos > result.replace(/\s_|_/g, "").length ? result.replace(/\s_|_/g, "").length : curPos;
  curPosEnd = curPosEnd > result.replace(/\s_|_/g, "").length ? result.replace(/\s_|_/g, "").length : curPosEnd;
  curPos === 0 ? setCursorPosition(3, 3, input) : setCursorPosition(curPos, curPosEnd, input);
  
});

phoneInput.addEventListener('input', function (e) {
  "use strict";
  var input = e.target,
    proxy = input.value.replace(/\D/g, ""),
    curPos = input.selectionStart,
    pattern = "+_ ___ ___ __ __",
    i = 0,
    result = pattern.replace(/_/g, function () {
      return proxy.charAt(i++) || "_";
    }),
    isBack = input.value.length - result.length < 0 ? 0 : 1,
    shift = result.charAt(curPos) === " " ? isBack : 0;

  curPos = curPos <= result.replace(/\s_|_/g, "").length ? curPos + shift : result.replace(/_\s|_/g, "").length;
  
  input.value = result;
  
  input.value === "+_ ___ ___ __ __" ? setCursorPosition(1, 1, input) : setCursorPosition(curPos, curPos, input);
  
});

phoneInput.addEventListener('blur', function (e) {
  "use strict";
  var input = e.target,
    proxy = input.value.replace(/\D/g, ""),
    errorMsg = document.getElementsByClassName('js-error')[0],
    pattern = new RegExp(/\+7\s\d{3}\s\d{3}\s\d{2}\s\d{2}/),
    patternTest = pattern.test(input.value),
    submit = document.getElementsByClassName('js-submit')[0];
  if (proxy === '') {
    input.value = "";
    input.placeholder = "+7 ___ ___ __ __";
  }
  if (!patternTest) {
    if (!errorMsg.classList.contains('reg__error_is_visible')) {
      errorMsg.classList.add('reg__error_is_visible');
    }
    if (!input.classList.contains('reg__input_has_error')) {
      input.classList.add('reg__input_has_error');
    }
    if (!submit.classList.contains('reg__submit_is_passive')) {
      submit.classList.add('reg__submit_is_passive');
    }
    errorMsg.innerHTML = 'Телефонный номер должен содержать 10&nbsp;цифр';
  }

});

submit.addEventListener('click', function (e) {
  var input = phoneInput,
    checkbox = document.getElementsByClassName('js-offer')[0],
    errorMsg = document.getElementsByClassName('js-error')[0],
    pattern = new RegExp(/\+7\s\d{3}\s\d{3}\s\d{2}\s\d{2}/),
    patternTest = pattern.test(input.value);


  if (!patternTest) {
    e.preventDefault();
  } else {
    if (!checkbox.checked) {
      if (!errorMsg.classList.contains('reg__error_is_visible')) {
        errorMsg.classList.add('reg__error_is_visible')
      }
      errorMsg.innerHTML = 'Чтобы продолжить необходимо принять публичную оферту';
      e.preventDefault();
    }
  }

});