'use strict';

var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKIN = ['12:00', '13:00', '4:00'];
var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_LIMIT = 8;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var generateRandomFeatures = function () {
  var features = OFFER_FEATURES.slice();

  features.splice(
      getRandomNumber(0, OFFER_FEATURES.length - 1),
      getRandomNumber(1, OFFER_FEATURES.length - 1)
  );

  return features;
};

var generateOffer = function (index) {
  var x = getRandomNumber(300, 900);
  var y = getRandomNumber(150, 500);
  return {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: OFFER_TITLES[index],
      address: x + ', ' + y,
      price: getRandomNumber(1000, 1000000),
      type: OFFER_TYPE[getRandomNumber(0, OFFER_TYPE.length - 1)],
      rooms: getRandomNumber(1, 6),
      guests: Math.floor(Math.random() * 100),
      checkin: OFFER_CHECKIN[getRandomNumber(0, OFFER_CHECKIN.length - 1)],
      checkout: OFFER_CHECKOUT[getRandomNumber(0, OFFER_CHECKOUT.length - 1)],
      features: generateRandomFeatures(),
      description: '',
      photos: [
        'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
      ]
    },
    location: {
      x: x,
      y: y
    }
  };
};

var createPinElemet = function (offerData, template) {
  var pinElement = template.cloneNode(true);
  var imageElement = pinElement.querySelector('img');

  pinElement.style.left = (offerData.location.x - 25) + 'px';
  pinElement.style.top = (offerData.location.y - 70) + 'px';

  imageElement.setAttribute('src', offerData.author.avatar);
  imageElement.setAttribute('alt', offerData.title);

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

var createPhotoElements = function (photos, template) {
  var element;
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    element = template.cloneNode(true);
    element.setAttribute('src', photos[i]);
    fragment.appendChild(element);
  }
  return fragment;
};

var renderOfferCard = function (data, cardElement, photoElement) {
  var offer = data.offer;

  cardElement.querySelector('.popup__title').textContent = offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = translateOfferType(offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ' , выезд до ' + offer.checkout;
  cardElement.querySelector('.popup__description').textContent = offer.description;

  cardElement.querySelector('.popup__avatar').src = data.author.avatar;

  cardElement.querySelector('.popup__features').innerHTML = '';
  cardElement.querySelector('.popup__features').appendChild(
      createFeatureElements(offer.features)
  );

  cardElement.querySelector('.popup__photos').innerHTML = '';
  cardElement.querySelector('.popup__photos').appendChild(
      createPhotoElements(offer.photos, photoElement)
  );

};

var template = document.querySelector('template');

var pinElement = template.content.querySelector('.map__pin');
var cardElement = template.content.querySelector('.map__card').cloneNode(true);
var photoElement = cardElement.querySelector('.popup__photo');
var mapElement = document.querySelector('.map');

var fragment = document.createDocumentFragment();

var offers = [];
var offer;

for (var i = 0; i <= OFFER_LIMIT - 1; i++) {
  offer = generateOffer(i);
  offers.push(offer);
  fragment.appendChild(
      createPinElemet(offer, pinElement)
  );
}

renderOfferCard(offers[0], cardElement, photoElement);

document.querySelector('.map__pins').appendChild(fragment);
mapElement.classList.remove('map--faded');
mapElement.insertBefore(cardElement, document.querySelector('.map__filters-container'));
