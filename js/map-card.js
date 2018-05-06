'use strict';

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var photoTemplate = cardTemplate.querySelector('.popup__photo').cloneNode(true);
  var popupElement = document.querySelector('.popup');

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

  window.mapCard = {
    renderElement: function (data) {
      var features = popupElement.querySelector('.popup__features');
      var photos = popupElement.querySelector('.popup__photos');
      var offer = data.offer;

      popupElement.querySelector('.popup__title').textContent = offer.title;
      popupElement.querySelector('.popup__text--address').textContent = offer.address;
      popupElement.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
      popupElement.querySelector('.popup__type').textContent = translateOfferType(offer.type);
      popupElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
      popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ' , выезд до ' + offer.checkout;
      popupElement.querySelector('.popup__description').textContent = offer.description;

      popupElement.querySelector('.popup__avatar').src = data.author.avatar;

      features.innerHTML = '';
      features.appendChild(
          createFeatureElements(offer.features)
      );

      photos.innerHTML = '';
      photos.appendChild(
          createPhotoElements(offer.photos, photoTemplate)
      );

      return popupElement;
    }
  };
})();
