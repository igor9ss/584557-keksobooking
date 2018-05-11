'use strict';

(function () {
  var popupTemplateElement = document.querySelector('template').content.querySelector('.popup');
  var photoTemplateElement = popupTemplateElement.querySelector('.popup__photo').cloneNode(true);
  var popupElement = document.querySelector('.popup');
  var featureElements = popupElement.querySelector('.popup__features');
  var photoElements = popupElement.querySelector('.popup__photos');

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
    }
  };
})();
