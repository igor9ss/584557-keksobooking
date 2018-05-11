'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var popupTemplateElement = document.querySelector('template').content.querySelector('.popup');
  var photoTemplateElement = popupTemplateElement.querySelector('.popup__photo').cloneNode(true);

  var mapElement = document.querySelector('.map');
  var mapFiltersContainerElement = mapElement.querySelector('.map__filters-container');

  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      popupElement.classList.add('hidden');
    }
  };

  var onPopupCloseElementClick = function () {
    popupElement.classList.add('hidden');
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

    features.forEach(function (item) {
      element = document.createElement('li');
      element.className = 'popup__feature popup__feature--' + item;
      fragment.appendChild(element);
    });

    return fragment;
  };

  var createPhotoElements = function (photos, pattern) {
    var element;
    var fragment = document.createDocumentFragment();

    photos.forEach(function (photo) {
      element = pattern.cloneNode(true);
      element.src = photo;
      fragment.appendChild(element);
    });

    return fragment;
  };

  mapElement.insertBefore(popupTemplateElement, mapFiltersContainerElement);
  popupTemplateElement.classList.add('hidden');

  var popupElement = document.querySelector('.popup');
  var popupClose = popupElement.querySelector('.popup__close');
  var featureElements = popupElement.querySelector('.popup__features');
  var photoElements = popupElement.querySelector('.popup__photos');

  window.mapPopup = {
    renderElement: function (data) {
      var offer = data.offer;

      popupElement.querySelector('.popup__title').textContent = offer.title;
      popupElement.querySelector('.popup__text--address').textContent = offer.address;
      popupElement.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
      popupElement.querySelector('.popup__type').textContent = translateOfferType(offer.type);
      popupElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
      popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ' , выезд до ' + offer.checkout;
      popupElement.querySelector('.popup__description').textContent = offer.description;

      popupElement.querySelector('.popup__avatar').src = data.author.avatar;

      featureElements.innerHTML = '';
      featureElements.appendChild(
          createFeatureElements(offer.features)
      );

      photoElements.innerHTML = '';
      photoElements.appendChild(
          createPhotoElements(offer.photos, photoTemplateElement)
      );

      return popupElement;
    },

    addListeners: function () {
      document.addEventListener('keydown', onPopupEscPress);
      popupClose.addEventListener('click', onPopupCloseElementClick);
    },

    removeListeners: function () {
      document.removeEventListener('keydown', onPopupEscPress);
      popupClose.removeEventListener('click', onPopupCloseElementClick);
    },

    showPopup: function () {
      if (popupElement.classList.contains('hidden')) {
        popupElement.classList.remove('hidden');
      }
    },

    hidePopup: function () {
      if (!popupElement.classList.contains('hidden')) {
        popupElement.classList.add('hidden');
      }
    }
  };
})();
