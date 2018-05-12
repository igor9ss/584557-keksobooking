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

  var onPinElementClick = function (data) {
    return function () {
      window.mapPopup.renderElement(data);
      window.mapPopup.showPopup();
    };
  };

  var createPins = function (pins) {
    var fragment = document.createDocumentFragment();
    pins
        .slice(0, PIN_SHOW_LIMIT)
        .forEach(function (pin) {
          var pinElement = window.mapPin.createElement(pin, pinTemplateElement);

          pinElement.addEventListener('click', onPinElementClick(pin));

          fragment.appendChild(pinElement);
        });
    mapPinsElement.appendChild(fragment);
  };

  var removePins = function () {
    var pinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinElements.forEach(function (pinElement) {
      pinElement.remove();
    });
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
  };

  var onMainPinElementMousedown = function () {
    var formElement = document.querySelector('.ad-form');
    var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
    var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);

    var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
    var mainPinElementArrowY = mainPinElementTopY + MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT;

    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');

    removePins();
    createPins(cachedPins);
    enableFieldset();

    var buttonElements = mapPinsElement.querySelectorAll('button[type="button"]');
    buttonElements.forEach(function (buttonElement) {
      buttonElement.classList.remove('hidden');
    });

    window.mapPopup.addListeners();
    window.form.setAddressData(mainPinElementCenterX, mainPinElementArrowY);

    mainPinElement.removeEventListener('mousedown', onMainPinElementMousedown);
  };

  window.backend.loadData(onSuccessLoad, window.errorMessage.show);

  mainPinElement.addEventListener('mousedown', onMainPinElementMousedown);

  mapFiltersElement.addEventListener('change', function () {
    window.mapPopup.hidePopup();
    window.debounce(function () {
      createPins(window.mapFilter.filterPins(cachedPins));
      document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (pinElement) {
        pinElement.classList.remove('hidden');
      });
    });
  });

  window.map = {
    removePins: removePins,
    onMainPinElementMousedown: onMainPinElementMousedown
  };
})();
