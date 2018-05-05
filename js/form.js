'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var BORDER_STYLE_ERROR = '2px solid red';
  var BORDER_STYLE_VALID = '2px solid lightgreen';

  var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

  var popupElement = document.querySelector('.popup');

  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
  var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
  var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);
  var mainPinElementCenterY = mainPinElementTopY + MAIN_PIN_HEIGHT / 2;

  var formElement = document.querySelector('.ad-form');
  var titleInputField = formElement.querySelector('#title');
  var homeTypeSelectField = formElement.querySelector('#type');
  var rentPriceInputField = formElement.querySelector('#price');
  var timeInSelectField = formElement.querySelector('#timein');
  var timeOutSelectField = formElement.querySelector('#timeout');
  var roomsSelectField = formElement.querySelector('#room_number');
  var guestSelectField = formElement.querySelector('#capacity');

  var fieldsetElements = document.querySelector('.notice').querySelectorAll('fieldset');

  var addressInputField = document.querySelector('#address');

  var disableFieldset = function () {
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = true;
    }
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

    for (var i = 0; i < pins.length; i++) {
      pins[i].classList.add('hidden');
    }

    titleInputField.style.border = '';
    rentPriceInputField.style.border = '';
    guestSelectField.style.border = '';

    mainPinElement.style.left = '570px';
    mainPinElement.style.top = '375px';

    disableFieldset();
    document.querySelector('.success').classList.remove('hidden');
  };

  disableFieldset();

  setAddressData(mainPinElementCenterX, mainPinElementCenterY);

  formElement.addEventListener('reset', function () {
    document.querySelector('.map').classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');

    if (!popupElement.classList.contains('hidden')) {
      popupElement.classList.add('hidden');
    }

    for (var i = 0; i < pins.length; i++) {
      pins[i].classList.add('hidden');
    }

    titleInputField.style.border = '';
    rentPriceInputField.style.border = '';
    guestSelectField.style.border = '';

    mainPinElement.style.left = '570px';
    mainPinElement.style.top = '375px';

    disableFieldset();
  });

  homeTypeSelectField.addEventListener('change', function () {
    switch (homeTypeSelectField.value) {
      case 'bungalo':
        rentPriceInputField.min = '0';
        rentPriceInputField.placeholder = '0';
        break;

      case 'flat':
        rentPriceInputField.min = '1000';
        rentPriceInputField.placeholder = '1000';
        break;

      case 'house':
        rentPriceInputField.min = '5000';
        rentPriceInputField.placeholder = '5000';
        break;

      case 'palace':
        rentPriceInputField.min = '10000';
        rentPriceInputField.placeholder = '10000';
    }
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

    var validationRoomToGuestIndexesMap = {
      0: [0],
      1: [0, 1],
      2: [0, 1, 2],
      3: [3]
    };

    var roomIndex = roomsSelectField.selectedIndex;

    for (var i = 0; i < guestSelectField.options.length; i++) {
      guestSelectField.options[i].disabled = validationRoomToGuestIndexesMap[roomIndex].indexOf(i) === -1;
    }
  });

  guestSelectField.addEventListener('change', function () {
    if (guestSelectField.value) {
      guestSelectField.style.border = BORDER_STYLE_VALID;
    }
  });

  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.load.sendFormData(new FormData(formElement), onLoad, window.errorMessage.show);
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
