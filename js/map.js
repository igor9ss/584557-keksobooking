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
var OFFER_FEATURES_WORDS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_LIMIT = 7;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getFeatures = function () {
  var features = [];
  for (var key in OFFER_FEATURES_WORDS) {
    if (features.hasOwnProperty.call(OFFER_FEATURES_WORDS, key)) {
      features[key] = OFFER_FEATURES_WORDS[key];
    }
  }
  features.splice(getRandomNumber(0, OFFER_FEATURES_WORDS.length - 1), getRandomNumber(1, 3));

  return features;
};

var generateOffer = function (index) {
  var xCoordinate = getRandomNumber(300, 901);
  var yCoordinate = getRandomNumber(150, 501);
  return {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: OFFER_TITLES[index],
      address: xCoordinate + ', ' + yCoordinate,
      price: getRandomNumber(1000, 1000001),
      type: OFFER_TYPE[getRandomNumber(0, OFFER_TYPE.length)],
      rooms: getRandomNumber(1, 6),
      guests: Math.floor(Math.random() * 100),
      checkin: OFFER_CHECKIN[getRandomNumber(0, OFFER_CHECKIN.length)],
      checkout: OFFER_CHECKOUT[getRandomNumber(0, OFFER_CHECKOUT.length)],
      features: getFeatures(),
      description: '',
      photos: [
        'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
      ]
    },
    location: {
      x: xCoordinate,
      y: yCoordinate
    }
  };
};

var generateOffers = function () {
  var offers = [];
  for (var i = 0; i <= OFFER_LIMIT; i++) {
    offers.push(generateOffer(i));
  }
  return offers;
};

var createPinElemet = function (objct) {
  var pin = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);

  pin.setAttribute('style', 'left: ' + (objct.location.x - 25) + 'px; top: ' + (objct.location.y - 70) + 'px;');
  pin.querySelector('img').setAttribute('src', objct.author.avatar);
  pin.querySelector('img').setAttribute('alt', objct.offer.title);

  return pin;
};

var fragment = document.createDocumentFragment();

for (var i = 0; i < generateOffers().length; i++) {
  fragment.appendChild(createPinElemet(generateOffers()[i]));
}

document.querySelector('.map__pins').appendChild(fragment);

var getTypeOfDigs = function (key) {
  switch (key) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
  }
  return key;
};

var offers = generateOffers();

var getFeaturesList = function (ind) {
  for (i = 0; i < offers[ind].offer.features.length; i++) {
    var featuresName = offers[ind].offer.features[i];
    var newElement = document.createElement('li');
    newElement.className = 'popup__feature ' + 'popup__feature--' + featuresName;
    fragment.appendChild(newElement);
  }
  return fragment;
};
var getImgSrcs = function (ind) {
  for (i = 1; i <= offers[ind].offer.photos.length - 1; i++) {
    var newImg = card.querySelector('.popup__photo').cloneNode(true);
    newImg.setAttribute('src', offers[ind].offer.photos[i]);
    fragment.appendChild(newImg);
  }
  return fragment;
};

document.querySelector('.map').classList.remove('map--faded');

var card = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);

var renderOfferCard = function (index) {
  var offer = offers[index].offer;
  card.querySelector('.popup__title').textContent = offer.title;
  card.querySelector('.popup__text--address').textContent = offer.address;
  card.querySelector('.popup__text--price').textContent = offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = getTypeOfDigs(offer.type);
  card.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ' , выезд до ' + offer.checkout;
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(getFeaturesList(index));
  card.querySelector('.popup__description').textContent = offer.description;
  card.querySelector('.popup__photo').setAttribute('src', offer.photos[0]);
  card.querySelector('.popup__photos').appendChild(getImgSrcs(index));
  document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));
  card.querySelector('.popup__avatar').setAttribute('src', offers[index].author.avatar);
};
renderOfferCard(4);
