'use strict';

(function () {
  var ERROR_TIMEOUT = 10000;
  var errorPopupElement = document.createElement('div');

  errorPopupElement.style.backgroundColor = 'red';
  errorPopupElement.style.color = 'white';
  errorPopupElement.style.margin = '0 auto';
  errorPopupElement.style.textAlign = 'center';
  errorPopupElement.style.position = 'absolute';
  errorPopupElement.style.left = 0;
  errorPopupElement.style.right = 0;
  errorPopupElement.style.fontSize = '45px';
  errorPopupElement.style.zIndex = 100;

  document.body.insertAdjacentElement('afterbegin', errorPopupElement);

  var hideErrorMessage = function () {
    errorPopupElement.classList.add('hidden');
  };

  window.errorMessage = {
    show: function (errorMessage) {
      if (errorPopupElement.classList.contains('hidden')) {
        errorPopupElement.classList.remove('hidden');
      }
      errorPopupElement.textContent = errorMessage;

      setTimeout(hideErrorMessage, ERROR_TIMEOUT);
    }
  };
})();
