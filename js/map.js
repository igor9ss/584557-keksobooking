'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_ARROW_HEIGHT = 22;
  var PIN_SHOW_LIMIT = 5;
  var ESC_KEYCODE = 27;

  var enableFieldset = function () {
    fieldsetElements.forEach(function (fieldsetElement) {
      fieldsetElement.disabled = false;
    });
  };

  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      popupElement.classList.add('hidden');
    }
  };

  var createClickHandler = function (data) {
    return function () {
      window.mapCard.renderElement(data);

      if (popupElement.classList.contains('hidden')) {
        popupElement.classList.remove('hidden');
      }
    };
  };

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();
    var pinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    pins
        .slice(0, PIN_SHOW_LIMIT)
        .forEach(function (pin) {
          var pinElement = window.mapPin.createElement(pin, pinTemplate);

          pinElement.addEventListener('click', createClickHandler(pin));

          fragment.appendChild(pinElement);
        });

    pinElements.forEach(function (pinElement) {
      pinElement.remove();
    });
    mapPinsElement.appendChild(fragment);
  };

  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var mainPinElement = document.querySelector('.map__pin--main');
  var mapFiltersElement = document.querySelector('.map__filters');
  var mapFiltersContainerElement = document.querySelector('.map__filters-container');

  var fieldsetElements = document.querySelectorAll('fieldset');
  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin').cloneNode(true);
  var cardElement = template.content.querySelector('.map__card').cloneNode(true);

  mapElement.insertBefore(cardElement, mapFiltersContainerElement);
  cardElement.classList.add('hidden');

  var popupElement = document.querySelector('.popup');
  var popupClose = popupElement.querySelector('.popup__close');
  var cachedPins;

  var onSuccessLoad = function (pins) {
    cachedPins = pins;
    renderPins(pins);
  };

  window.load.loadData(onSuccessLoad, window.errorMessage.show);

  document.addEventListener('keydown', onPopupEscPress);

  popupClose.addEventListener('click', function () {
    popupElement.classList.add('hidden');
  });

  mainPinElement.addEventListener('mousedown', function () {
    var formElement = document.querySelector('.ad-form');
    var adressInputField = document.querySelector('#address');
    var buttonElements = mapPinsElement.querySelectorAll('button[type="button"]');

    var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
    var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
    var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);
    var mainPinElementArrowY = mainPinElementTopY + MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT;

    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');

    window.form.setAddressData(mainPinElementCenterX, mainPinElementArrowY);

    enableFieldset();
    adressInputField.disabled = true;


    buttonElements.forEach(function (buttonElement) {
      buttonElement.classList.remove('hidden');
    });
  });

  mapFiltersElement.addEventListener('change', function () {
    window.debounce(function () {
      renderPins(
          window.filter.filterPins(cachedPins));

      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.classList.remove('hidden');
      });
    });
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

      window.form.setAddressData(currentArrowX, currentArrowY);
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
