'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_ARROW_HEIGHT = 22;
  var PIN_SHOW_LIMIT = 5;

  var enableFieldset = function () {
    fieldsetElements.forEach(function (fieldsetElement) {
      fieldsetElement.disabled = false;
    });
  };

  var createClickHandler = function (data) {
    return function () {
      window.mapPopup.renderElement(data);
      window.mapPopup.showPopup();
    };
  };

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();
    var pinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    pins
        .slice(0, PIN_SHOW_LIMIT)
        .forEach(function (pin) {
          var pinElement = window.mapPin.createElement(pin, pinTemplateElement);

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

  var fieldsetElements = document.querySelectorAll('fieldset');
  var templateElement = document.querySelector('template');
  var pinTemplateElement = templateElement.content.querySelector('.map__pin').cloneNode(true);

  var cachedPins;

  var onSuccessLoad = function (pins) {
    cachedPins = pins;
    renderPins(pins);
  };

  window.backend.loadData(onSuccessLoad, window.errorMessage.show);

  mainPinElement.addEventListener('mousedown', function () {

    window.mapPopup.addListeners();

    var formElement = document.querySelector('.ad-form');
    var buttonElements = mapPinsElement.querySelectorAll('button[type="button"]');

    var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
    var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);

    var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
    var mainPinElementArrowY = mainPinElementTopY + MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT;

    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');

    window.form.setAddressData(mainPinElementCenterX, mainPinElementArrowY);

    enableFieldset();

    buttonElements.forEach(function (buttonElement) {
      buttonElement.classList.remove('hidden');
    });
  });

  mapFiltersElement.addEventListener('change', function () {
    window.mapPopup.hidePopup();
    window.debounce(function () {
      renderPins(
          window.mapFilter.filterPins(cachedPins));
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pinElement) {
        pinElement.classList.remove('hidden');
      });
    });
  });
})();
