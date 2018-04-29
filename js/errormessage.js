'use strict';

(function () {
  window.errorMessage = {
    'show': function (errorMessage) {
      var errorPopupElement = document.createElement('div');
      errorPopupElement.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; color: white;';
      errorPopupElement.style.position = 'absolute';
      errorPopupElement.style.left = 0;
      errorPopupElement.style.right = 0;
      errorPopupElement.style.fontSize = '45px';

      errorPopupElement.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorPopupElement);
    }
  };
})();
