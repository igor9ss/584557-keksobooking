'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var BORDER_STYLE_ERROR = '2px solid red';
  var BORDER_STYLE_VALID = '2px solid lightgreen';
  var VALIDATION_ROOM_TO_GUEST_INDEXES_MAP = {
    0: [0],
    1: [0, 1],
    2: [0, 1, 2],
    3: [3]
  };
  var HOME_TYPE_VOCABULARY = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  var popupElement = document.querySelector('.popup');

  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
  var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);

  var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
  var mainPinElementCenterY = mainPinElementTopY + MAIN_PIN_HEIGHT / 2;

  var formElement = document.querySelector('.ad-form');
  var titleInputField = formElement.querySelector('#title');
  var homeTypeSelectField = formElement.querySelector('#type');
  var rentPriceInputField = formElement.querySelector('#price');
  var timeInSelectField = formElement.querySelector('#timein');
  var timeOutSelectField = formElement.querySelector('#timeout');
  var roomsSelectField = formElement.querySelector('#room_number');
  var guestSelectField = formElement.querySelector('#capacity');

  var resetButtonElement = formElement.querySelector('.ad-form__reset');

  var fieldsetElements = document.querySelector('.notice').querySelectorAll('fieldset');

  var addressInputField = document.querySelector('#address');

  var setStandartInputsBorders = function () {
    titleInputField.style.border = '';
    rentPriceInputField.style.border = '';
    guestSelectField.style.border = '';
  };

  var setMainPinToCenter = function () {
    mainPinElement.style.left = '570px';
    mainPinElement.style.top = '375px';
  };

  var hidePins = function () {
    var pinsElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinsElements.forEach(function (pinElement) {
      pinElement.classList.add('hidden');
    });
  };

  var disableFieldset = function () {
    fieldsetElements.forEach(function (fieldsetElement) {
      fieldsetElement.disabled = true;
    });
  };

  var setAddressData = function (x, y) {
    addressInputField.value = x + ' ' + y;
  };

  var onLoad = function () {
    document.querySelector('.map').classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');

    if (!popupElement.classList.contains('hidden')) {
      popupElement.classList.add('hidden');
    }

    hidePins();
    setStandartInputsBorders();
    setMainPinToCenter();
    disableFieldset();
    setAddressData(mainPinElementCenterX, mainPinElementCenterY);

    document.querySelector('.success').classList.remove('hidden');

    setTimeout(function () {
      document.querySelector('.success').classList.add('hidden');
    }, 3000);
  };

  disableFieldset();

  setAddressData(mainPinElementCenterX, mainPinElementCenterY);

  resetButtonElement.addEventListener('click', function (evt) {
    evt.preventDefault();

    document.querySelector('.map').classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');

    if (!popupElement.classList.contains('hidden')) {
      popupElement.classList.add('hidden');
    }

    hidePins();
    setStandartInputsBorders();
    setMainPinToCenter();
    disableFieldset();
    formElement.reset();
    setAddressData(mainPinElementCenterX, mainPinElementCenterY);
  });

  homeTypeSelectField.addEventListener('change', function () {
    rentPriceInputField.value = '';
    rentPriceInputField.style.border = '';

    var typeIndex = homeTypeSelectField.selectedIndex;
    var objK = Object.keys(HOME_TYPE_VOCABULARY)[typeIndex];

    rentPriceInputField.min = HOME_TYPE_VOCABULARY[objK];
    rentPriceInputField.placeholder = HOME_TYPE_VOCABULARY[objK];
  });

  timeOutSelectField.addEventListener('change', function () {
    timeInSelectField.value = timeOutSelectField.value;
  });

  timeInSelectField.addEventListener('change', function () {
    timeOutSelectField.value = timeInSelectField.value;
  });

  roomsSelectField.addEventListener('change', function () {
    guestSelectField.value = '';
    guestSelectField.style.border = BORDER_STYLE_ERROR;

    var roomIndex = roomsSelectField.selectedIndex;
    var guestSelectFieldOptions = guestSelectField.options;

    Array.from(guestSelectFieldOptions).forEach(function (option, i) {
      option.disabled = VALIDATION_ROOM_TO_GUEST_INDEXES_MAP[roomIndex].indexOf(i) === -1;
    });
  });

  guestSelectField.addEventListener('change', function () {
    if (guestSelectField.value) {
      guestSelectField.style.border = BORDER_STYLE_VALID;
    }
  });

  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.sendFormData(new FormData(formElement), onLoad, window.errorMessage.show);
  });

  titleInputField.addEventListener('input', function () {
    titleInputField.style.border = titleInputField.validity.valid ? BORDER_STYLE_VALID : BORDER_STYLE_ERROR;
  });

  rentPriceInputField.addEventListener('input', function () {
    rentPriceInputField.style.border = rentPriceInputField.validity.valid ? BORDER_STYLE_VALID : BORDER_STYLE_ERROR;
  });

  titleInputField.addEventListener('invalid', function () {
    titleInputField.style.border = BORDER_STYLE_ERROR;
  });

  rentPriceInputField.addEventListener('invalid', function () {
    rentPriceInputField.style.border = BORDER_STYLE_ERROR;
  });

  window.form = {
    setAddressData: setAddressData
  };
})();
