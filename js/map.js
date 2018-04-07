'use strict';

var TITLE = [
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
  for (var i = 0; i <= OFFER_FEATURES_WORDS.length; i++) {
    features[i] = OFFER_FEATURES_WORDS[getRandomNumber(0, OFFER_FEATURES_WORDS.length)];
  }
  function unique(arr) {
    var obj = {};

    for (i = 0; i < arr.length; i++) {
      var str = arr[i];
      obj[str] = true;
    }

    return Object.keys(obj);
  }

  return unique(features);
};

var generateOffer = function (index) {
  var xCoordinate = getRandomNumber(300, 901);
  var yCoordinate = getRandomNumber(150, 501);
  var avatarImgNumber = '0' + (index + 1);
  return {
    author: {
      avatar: 'img/avatars/user' + avatarImgNumber + '.png'
    },
    offer: {
      title: TITLE[index],
      address: xCoordinate + ', ' + yCoordinate,
      price: getRandomNumber(1000, 1000001),
      type: OFFER_TYPE[getRandomNumber(0, OFFER_TYPE.length - 1)],
      rooms: getRandomNumber(1, 6),
      guests: Math.floor(Math.random() * 100),
      checkin: OFFER_CHECKIN[getRandomNumber(0, OFFER_CHECKIN.length - 1)],
      checkout: OFFER_CHECKOUT[getRandomNumber(0, OFFER_CHECKOUT.length - 1)],
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
  var PrimaryMass = [];
  for (var i = 0; i <= OFFER_LIMIT; i++) {
    PrimaryMass[i] = generateOffer(i);
  }
  return PrimaryMass;
};

var renderPin = function (mass1) {
  for (var i = 0; i < mass1.length; i++) {
    var pin = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
    pin.setAttribute('style', 'left: ' + (mass1[i].location.x - 25) + 'px; top: ' + (mass1[i].location.y - 70) + 'px;');
    pin.querySelector('img').setAttribute('src', mass1[i].author.avatar);
    pin.querySelector('img').setAttribute('alt', mass1[i].offer.title);
    fragment.appendChild(pin);
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

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

var getFeaturesList = function () {
  for (var i = 0; i < featuresMass.length; i++) {
    var featuresName = PrimaryMass[0].offer.features[i];
    var newElement = document.createElement('li');
    newElement.className = 'popup__feature ' + 'popup__feature--' + featuresName;
    fragment.appendChild(newElement);
  }
  return fragment;
};

var getImgSrcs = function () {
  for (var i = 1; i <= massLength - 1; i++) {
    var newImg = card.querySelector('.popup__photo').cloneNode(true);
    newImg.setAttribute('src', PrimaryMass[0].offer.photos[i]);
    fragment.appendChild(newImg);
  }
  return fragment;
};

document.querySelector('.map').classList.remove('map--faded');

var PrimaryMass = generateOffers();

var fragment = document.createDocumentFragment();
var card = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);

renderPin(PrimaryMass);

var featuresMass = PrimaryMass[0].offer.features;
var massLength = PrimaryMass[0].offer.photos.length;

card.querySelector('.popup__title').textContent = PrimaryMass[0].offer.title;
card.querySelector('.popup__text--address').textContent = PrimaryMass[0].offer.address;
card.querySelector('.popup__text--price').textContent = PrimaryMass[0].offer.price + '₽/ночь';
card.querySelector('.popup__type').textContent = getTypeOfDigs(PrimaryMass[0].offer.type);
card.querySelector('.popup__text--capacity').textContent = PrimaryMass[0].offer.rooms + ' комнаты для ' + PrimaryMass[0].offer.guests + ' гостей';
card.querySelector('.popup__text--time').textContent = 'Заезд после ' + PrimaryMass[0].offer.checkin + ' , выезд до ' + PrimaryMass[0].offer.checkout;
card.querySelector('.popup__features').innerHTML = '';
card.querySelector('.popup__features').appendChild(getFeaturesList(featuresMass));
card.querySelector('.popup__description').textContent = PrimaryMass[0].offer.description;
card.querySelector('.popup__photo').setAttribute('src', PrimaryMass[0].offer.photos[0]);
card.querySelector('.popup__photos').appendChild(getImgSrcs(massLength));
document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));
card.querySelector('.popup__avatar').setAttribute('src', PrimaryMass[0].author.avatar);
