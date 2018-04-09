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

var getFeatures = function () {
  var features = [];
  for (var key in OFFER_FEATURES) {
    if (features.hasOwnProperty.call(OFFER_FEATURES, key)) {
      features[key] = OFFER_FEATURES[key];
    }
  }
  features.splice(getRandomNumber(0, OFFER_FEATURES.length - 1), getRandomNumber(1, 3));

  return features;
};

var generateOffer = function (index) {
  var x = getRandomNumber(300, 901);
  var y = getRandomNumber(150, 501);
  return {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: OFFER_TITLES[index],
      address: x + ', ' + y,
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
      x: x,
      y: y
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

var createPinElemet = function (data, templ) {
  var pin = templ.cloneNode(true);
  pin.style.left = (data.location.x - 25) + 'px';
  pin.style.top = (data.location.y - 70) + 'px';
  pin.querySelector('img').setAttribute('src', data.author.avatar);
  pin.querySelector('img').setAttribute('alt', data.offer.title);

  return pin;
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

var getFeaturesList = function (features) {
  var newElement = document.createElement('li');
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < features.length; i++) {
    newElement = document.createElement('li');
    newElement.className = 'popup__feature ' + 'popup__feature--' + features[i];
    featuresFragment.appendChild(newElement);
  }
  return featuresFragment;
};

//var card = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);

var getImgSrcs = function (photos, imgTempl) {
  var newImg = imgTempl.cloneNode(true);
  var imgSrcsFragment = document.createDocumentFragment();

  for (var i = 1; i <= photos.length - 1; i++) {
    newImg = imgTempl.cloneNode(true);
    newImg.setAttribute('src', photos[i]);
    imgSrcsFragment.appendChild(newImg);
  }
  return imgSrcsFragment;
};

var renderOfferCard = function (data) {

  card.querySelector('.popup__title').textContent = data.offer.title;
  card.querySelector('.popup__text--address').textContent = data.offer.address;
  card.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = getTypeOfDigs(data.offer.type);
  card.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ' , выезд до ' + data.offer.checkout;
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(getFeaturesList(data.offer.features));
  card.querySelector('.popup__description').textContent = data.offer.description;
  card.querySelector('.popup__photo').setAttribute('src', data.offer.photos[0]);
  card.querySelector('.popup__photos').appendChild(getImgSrcs(data.offer.photos, imgTempl));
  document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));
  card.querySelector('.popup__avatar').setAttribute('src', data.author.avatar);
};

var pinTempl = document.querySelector('template').content.querySelector('.map__pin');

var fragment = document.createDocumentFragment();

var offers = generateOffers();

var imgTempl = document.querySelector('template').content.querySelector('.map__card').cloneNode(true).querySelector('.popup__photo')

var card = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);

for (var j = 0; j < offers.length; j++) {
  fragment.appendChild(createPinElemet(offers[j], pinTempl));
}

document.querySelector('.map__pins').appendChild(fragment);

document.querySelector('.map').classList.remove('map--faded');

renderOfferCard(offers[0]);
