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
  window.mainPinElement = document.querySelector('.map__pin--main');
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

  window.backend.loadData(onSuccessLoad, window.errorMessage.show);

  document.addEventListener('keydown', onPopupEscPress);

  popupClose.addEventListener('click', function () {
    popupElement.classList.add('hidden');
  });

  window.mainPinElement.addEventListener('mousedown', function () {
    var formElement = document.querySelector('.ad-form');
    var adressInputField = document.querySelector('#address');
    var buttonElements = mapPinsElement.querySelectorAll('button[type="button"]');

    var mainPinElementLeftX = parseInt(window.mainPinElement.style.left, 10);
    var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
    var mainPinElementTopY = parseInt(window.mainPinElement.style.top, 10);
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
    cardElement.classList.add('hidden');
    window.debounce(function () {
      renderPins(
          window.mapFilter.filterPins(cachedPins));

      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pin) {
        pin.classList.remove('hidden');
      });
    });
  });
})();
