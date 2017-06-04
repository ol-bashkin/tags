// JavaScript Document


var overlay  = document.getElementsByClassName('js-menuOverlay-toggle')[0],
  menu       = document.getElementsByClassName('js-menu-toggle')[0],
  hamburger  = document.getElementsByClassName('js-hamburger-toggle')[0],
  user       = document.getElementsByClassName('js-user-toggle')[0],
  menuUser   = document.getElementsByClassName('js-menuUser-toggle')[0],
  menuMain   = document.getElementsByClassName('js-menuMain-toggle'),
  menuTel    = document.getElementsByClassName('js-menu-tel')[0];

overlay.addEventListener('click', function () {
  'use strict';
  this.classList.add('c-menu__overlay_hidden');
  menu.classList.add('menu_hidden');
});

hamburger.addEventListener('click', function () {
  'use strict';
  overlay.classList.remove('c-menu__overlay_hidden');
  menu.classList.remove('menu_hidden');
});

user.addEventListener('click', function () {
  'use strict';
  if (this.classList.contains('menu__link_user_collapsed')) {
    this.classList.remove('menu__link_user_collapsed');
    this.classList.add('menu__link_user_expanded');
    menuUser.classList.remove('menu__list_user_hidden');
    menuMain[0].classList.add('menu__list_hidden');
    menuMain[1].classList.add('menu__list_hidden');
    
  } else if (this.classList.contains('menu__link_user_expanded')) {
    this.classList.remove('menu__link_user_expanded');
    this.classList.add('menu__link_user_collapsed');
    menuUser.classList.add('menu__list_user_hidden');
    menuMain[0].classList.remove('menu__list_hidden');
    menuMain[1].classList.remove('menu__list_hidden');
    
  } else {
    this.classList.add('menu__link_user_expanded');
    menuUser.classList.remove('menu__list_user_hidden');
    menuMain[0].classList.add('menu__list_hidden');
    menuMain[1].classList.add('menu__list_hidden');
  }
  
});

menuTel.addEventListener('click', function (event) {
  "use strict";
  event.preventDefault();
});


