'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_ARROW_HEIGHT = 22;
  var ESC_KEYCODE = 27;

  var mapElement = document.querySelector('.map');
  var offers = window.generateOffers();
  var mainPinElement = document.querySelector('.map__pin--main');

  var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
  var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
  var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);
  var mainPinElementArrowY = mainPinElementTopY + MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT;

  var fieldsetElements = document.querySelector('.notice').querySelectorAll('fieldset');

  var fragment = document.createDocumentFragment();

  var enableFieldset = function () {
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = false;
    }
  };

  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      document.querySelector('.popup').classList.add('hidden');
    }
  };

  var createClickHandler = function (data) {
    return function () {
      var cardElement = window.renderCardElement(data);
      mapElement.insertBefore(cardElement, document.querySelector('.map__filters-container'));

      var popupClose = cardElement.querySelector('.popup__close');

      popupClose.addEventListener('click', function () {
        cardElement.classList.add('hidden');
      });

      if (!cardElement.classList.contains('hidden')) {
        document.addEventListener('keydown', onPopupEscPress);
      }

      if (cardElement.classList.contains('hidden')) {
        cardElement.classList.remove('hidden');
      }
    };
  };

  var pinElements = [];
  var pinElement;

  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);

  for (var i = 0; i < offers.length; i++) {
    pinElement = window.createPinElemet(offers[i], pinTemplate);
    pinElement.addEventListener('click', createClickHandler(offers[i]));
    pinElements.push(pinElement);

    fragment.appendChild(pinElement);
  }

  document.querySelector('.map__pins').appendChild(fragment);

  mainPinElement.addEventListener('mousedown', function () {
    var formElement = document.querySelector('.ad-form');
    var adressInputField = document.querySelector('#address');
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');

    window.setAdressData(mainPinElementCenterX, mainPinElementArrowY);

    enableFieldset();
    adressInputField.disabled = true;

    for (i = 0; i < pinElements.length; i++) {
      pinElements[i].classList.remove('hidden');
    }
  });
  mainPinElement.addEventListener('mousedown', function (mouseDownEvt) {
    var startCoords = {
      x: mouseDownEvt.clientX,
      y: mouseDownEvt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var currentArrowX = parseInt(mainPinElement.style.left, 10) + MAIN_PIN_WIDTH / 2;
      var currentArrowY = parseInt(mainPinElement.style.top, 10) + MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPinElement.style.top = (mainPinElement.offsetTop - shift.y) + 'px';
      mainPinElement.style.left = (mainPinElement.offsetLeft - shift.x) + 'px';

      if (mainPinElement.offsetTop < 0) {
        mainPinElement.style.top = 0 + 'px';
      }

      if (mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2 < 0) {
        mainPinElement.style.left = 0 - MAIN_PIN_WIDTH / 2 + 'px';
      }

      if (mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2 > mapElement.offsetWidth) {
        mainPinElement.style.left = mapElement.offsetWidth - MAIN_PIN_WIDTH / 2 + 'px';
      }

      if (mainPinElement.offsetTop + MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT > mapElement.offsetHeight) {
        mainPinElement.style.top = mapElement.offsetHeight - MAIN_PIN_HEIGHT - MAIN_PIN_ARROW_HEIGHT + 'px';
      }

      window.setAdressData(currentArrowX, currentArrowY);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
