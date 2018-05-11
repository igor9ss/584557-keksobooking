'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var BORDER_STYLE_ERROR = '2px solid red';
  var BORDER_STYLE_VALID = '2px solid lightgreen';
  var DEFAULT_USER_AVATAR = 'img/muffin-grey.svg';
  var MAIN_PIN_DEFAULT_COORDINATE_X = '570px';
  var MAIN_PIN_DEFAULT_COORDINATE_Y = '375px';
  var SUCCESS_MESSAGE_HIDE_TIMEOUT = 3000;
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

  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
  var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);

  var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
  var mainPinElementCenterY = mainPinElementTopY + MAIN_PIN_HEIGHT / 2;

  var formElement = document.querySelector('.ad-form');
  var titleInputFieldElement = formElement.querySelector('#title');
  var homeTypeSelectFieldElement = formElement.querySelector('#type');
  var rentPriceInputFieldElement = formElement.querySelector('#price');
  var timeInSelectFieldElement = formElement.querySelector('#timein');
  var timeOutSelectFieldElement = formElement.querySelector('#timeout');
  var roomsSelectFieldElement = formElement.querySelector('#room_number');
  var guestSelectFieldElement = formElement.querySelector('#capacity');
  var addressInputFieldElement = document.querySelector('#address');

  var userAvatarPreviewElement = document.querySelector('.ad-form-header__preview img');
  var photoPreviewBoxElement = document.querySelector('.ad-form__photo');

  var mapFilterFormElement = document.querySelector('.map__filters');

  var resetButtonElement = formElement.querySelector('.ad-form__reset');

  var fieldsetElements = document.querySelector('.notice').querySelectorAll('fieldset');

  var setStandartInputsBorders = function () {
    titleInputFieldElement.style.border = '';
    rentPriceInputFieldElement.style.border = '';
    guestSelectFieldElement.style.border = '';
  };

  var setMainPinToCenter = function () {
    mainPinElement.style.left = MAIN_PIN_DEFAULT_COORDINATE_X;
    mainPinElement.style.top = MAIN_PIN_DEFAULT_COORDINATE_Y;
  };

  var removePins = function () {
    var pinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinElements.forEach(function (pinElement) {
      pinElement.remove();
    });
  };

  var disableFieldset = function () {
    fieldsetElements.forEach(function (fieldsetElement) {
      fieldsetElement.disabled = true;
    });
  };

  var setAddressData = function (x, y) {
    addressInputFieldElement.value = x + ', ' + y;
  };

  var setDefaultValueForPriceElement = function () {
    rentPriceInputFieldElement.min = HOME_TYPE_VOCABULARY['flat'];
    rentPriceInputFieldElement.placeholder = HOME_TYPE_VOCABULARY['flat'];
  };

  var onLoad = function () {
    document.querySelector('.map').classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    userAvatarPreviewElement.src = DEFAULT_USER_AVATAR;
    photoPreviewBoxElement.innerHTML = '';

    window.mapPopup.hidePopup();

    removePins();
    setStandartInputsBorders();
    setMainPinToCenter();
    disableFieldset();
    formElement.reset();
    mapFilterFormElement.reset();
    setAddressData(mainPinElementCenterX, mainPinElementCenterY);

    document.querySelector('.success').classList.remove('hidden');

    setTimeout(function () {
      document.querySelector('.success').classList.add('hidden');
    }, SUCCESS_MESSAGE_HIDE_TIMEOUT);
  };

  disableFieldset();

  setAddressData(mainPinElementCenterX, mainPinElementCenterY);

  resetButtonElement.addEventListener('click', function (evt) {
    evt.preventDefault();

    window.mapPopup.removeListeners();

    document.querySelector('.map').classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    userAvatarPreviewElement.src = DEFAULT_USER_AVATAR;
    photoPreviewBoxElement.innerHTML = '';

    window.mapPopup.hidePopup();

    removePins();
    setStandartInputsBorders();
    setMainPinToCenter();
    disableFieldset();
    formElement.reset();
    mapFilterFormElement.reset();
    setAddressData(mainPinElementCenterX, mainPinElementCenterY);
    setDefaultValueForPriceElement();
  });

  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.mapPopup.removeListeners();

    window.backend.sendFormData(new FormData(formElement), onLoad, window.errorMessage.show);

    setDefaultValueForPriceElement();
  });

  homeTypeSelectFieldElement.addEventListener('change', function () {
    rentPriceInputFieldElement.value = '';
    rentPriceInputFieldElement.style.border = '';

    var typeIndex = homeTypeSelectFieldElement.selectedIndex;
    var housingType = Object.keys(HOME_TYPE_VOCABULARY)[typeIndex];

    rentPriceInputFieldElement.min = HOME_TYPE_VOCABULARY[housingType];
    rentPriceInputFieldElement.placeholder = HOME_TYPE_VOCABULARY[housingType];
  });

  timeOutSelectFieldElement.addEventListener('change', function () {
    timeInSelectFieldElement.value = timeOutSelectFieldElement.value;
  });

  timeInSelectFieldElement.addEventListener('change', function () {
    timeOutSelectFieldElement.value = timeInSelectFieldElement.value;
  });

  roomsSelectFieldElement.addEventListener('change', function () {
    guestSelectFieldElement.value = '';
    guestSelectFieldElement.style.border = BORDER_STYLE_ERROR;

    var roomIndex = roomsSelectFieldElement.selectedIndex;
    var guestSelectFieldElementOptions = guestSelectFieldElement.options;

    Array.from(guestSelectFieldElementOptions).forEach(function (option, i) {
      option.disabled = VALIDATION_ROOM_TO_GUEST_INDEXES_MAP[roomIndex].indexOf(i) === -1;
    });
  });

  guestSelectFieldElement.addEventListener('change', function () {
    if (guestSelectFieldElement.value) {
      guestSelectFieldElement.style.border = BORDER_STYLE_VALID;
    }
  });

  titleInputFieldElement.addEventListener('input', function () {
    titleInputFieldElement.style.border = titleInputFieldElement.validity.valid ? BORDER_STYLE_VALID : BORDER_STYLE_ERROR;
  });

  rentPriceInputFieldElement.addEventListener('input', function () {
    rentPriceInputFieldElement.style.border = rentPriceInputFieldElement.validity.valid ? BORDER_STYLE_VALID : BORDER_STYLE_ERROR;
  });

  titleInputFieldElement.addEventListener('invalid', function () {
    titleInputFieldElement.style.border = BORDER_STYLE_ERROR;
  });

  rentPriceInputFieldElement.addEventListener('invalid', function () {
    rentPriceInputFieldElement.style.border = BORDER_STYLE_ERROR;
  });

  window.form = {
    setAddressData: setAddressData
  };
})();
