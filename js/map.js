'use strict';

// pinAndCard.js создаем и рендерим пины и попап.

(function () {

  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_ARROW_HEIGHT = 22;
  var ESC_KEYCODE = 27;

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

  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      popupElement.classList.add('hidden');
    }
  };

  var createClickHandler = function (data) {
    return function () {
      window.renderCardElement(data);

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

  var mapElement = document.querySelector('.map');

  var fragment = document.createDocumentFragment();
  var offers = window.generateOffers();

  var pinElements = [];
  var pinElement;

  mapElement.insertBefore(cardElement, document.querySelector('.map__filters-container'));

  var popupElement = document.querySelector('.popup');
  var popupClose = popupElement.querySelector('.popup__close');

  for (var i = 0; i < offers.length; i++) {
    pinElement = createPinElemet(offers[i], pinTemplate);
    pinElement.addEventListener('click', createClickHandler(offers[i]));
    pinElements.push(pinElement);

    fragment.appendChild(pinElement);
  }

  document.querySelector('.map__pins').appendChild(fragment);

//  cardElement.classList.add('hidden');

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
