'use strict';

// pinAndCard.js создаем и рендерим пины и попап.

(function () {
  
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_ARROW_HEIGHT = 22;
  var ESC_KEYCODE = 27;
  var OFFER_LIMIT = 8;
  
  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card').cloneNode(true);
  var photoTemplate = cardTemplate.querySelector('.popup__photo').cloneNode(true);
  var pinTemplate = template.content.querySelector('.map__pin').cloneNode(true);

  var mainPinElement = document.querySelector('.map__pin--main');
  var mainPinElementLeftX = parseInt(mainPinElement.style.left, 10);
  var mainPinElementTopY = parseInt(mainPinElement.style.top, 10);
  var mainPinElementCenterX = mainPinElementLeftX + MAIN_PIN_WIDTH / 2;
  var mainPinElementArrowY = mainPinElementTopY + MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT;

  var fieldsetElements = document.querySelector('.notice').querySelectorAll('fieldset');

  var createPinElemet = function (offerData, pattern) {
    var pinElement = pattern.cloneNode(true);
    var imageElement = pinElement.querySelector('img');

    pinElement.style.left = (offerData.location.x - 25) + 'px';
    pinElement.style.top = (offerData.location.y - 70) + 'px';
    pinElement.classList.add('hidden');

    imageElement.src = offerData.author.avatar;
    imageElement.alt = offerData.title;

    return pinElement;
  };

  var translateOfferType = function (offerType) {
    switch (offerType) {
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
    }
    return offerType;
  };

  var createFeatureElements = function (features) {
    var element;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < features.length - 1; i++) {
      element = document.createElement('li');
      element.className = 'popup__feature popup__feature--' + features[i];
      fragment.appendChild(element);
    }

    return fragment;
  };

  var createPhotoElements = function (photos, pattern) {
    var element;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      element = pattern.cloneNode(true);
      element.src = photos[i];
      fragment.appendChild(element);
    }
    return fragment;
  };

  var renderCardElement = function (data) {
    var features = cardElement.querySelector('.popup__features');
    var photos = cardElement.querySelector('.popup__photos');
    var offer = data.offer;

    cardElement.querySelector('.popup__title').textContent = offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = translateOfferType(offer.type);
    cardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ' , выезд до ' + offer.checkout;
    cardElement.querySelector('.popup__description').textContent = offer.description;

    cardElement.querySelector('.popup__avatar').src = data.author.avatar;

    features.innerHTML = '';
    features.appendChild(
        createFeatureElements(offer.features)
    );

    photos.innerHTML = '';
    photos.appendChild(
        createPhotoElements(offer.photos, photoTemplate)
    );
  };

  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      popupElement.classList.add('hidden');
    }
  };

  var createClickHandler = function (data) {
    return function () {
      renderCardElement(data);

      if (cardElement.classList.contains('hidden')) {
        popupElement.classList.remove('hidden');
        document.addEventListener('keydown', onPopupEscPress);
      }
    };
  };

  var enableFieldset = function () {
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = false;
    }
  };

  var cardElement = cardTemplate.cloneNode(true);

  var mapElement = document.querySelector('.map');

  var fragment = document.createDocumentFragment();
  var offers = [];
  var offer;
  var pinElements = [];
  var pinElement;

  mapElement.insertBefore(cardElement, document.querySelector('.map__filters-container'));

  var popupElement = document.querySelector('.popup');
  var popupClose = popupElement.querySelector('.popup__close');

  for (var i = 0; i < OFFER_LIMIT; i++) {
    offer = window.generateOffer(i);
    offers.push(offer);

    pinElement = createPinElemet(offer, pinTemplate);
    pinElement.addEventListener('click', createClickHandler(offer));
    pinElements.push(pinElement);

    fragment.appendChild(pinElement);
  }

  document.querySelector('.map__pins').appendChild(fragment);

  cardElement.classList.add('hidden');

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

  popupClose.addEventListener('keydown', function (evt) {
    onPopupEscPress(evt);
  });

  popupClose.addEventListener('click', function () {
    popupElement.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  });
})();

// form.js работаем с формой

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

  window.setAdressData = function (x, y) {
    document.querySelector('#address').value = x + ' ' + y;
  };

  var disableFieldset = function () {
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = true;
    }
  };

  disableFieldset();

  window.setAdressData(mainPinElementCenterX, mainPinElementCenterY);

  formElement.addEventListener('reset', function () {
    document.querySelector('.map').classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');

    if (popupElement) {
      popupElement.classList.add('hidden');
    }

    for (var i = 0; i < pins.length; i++) {
      pins[i].classList.add('hidden');
    }

    titleInputField.style.border = '';
    rentPriceInputField.style.border = '';
    guestSelectField.style.border = '';

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
})();
