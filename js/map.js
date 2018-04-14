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
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;
var MAIN_PIN_ARROW_HEIGHT = 22;

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
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
      rooms: getRandomNumber(1, 5),
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

var createPhotoElements = function (photos, template) {
  var element;
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    element = template.cloneNode(true);
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
  cardElement.classList.add('hidden');
  mapElement.insertBefore(cardElement, document.querySelector('.map__filters-container'));
};

var onMainPinDrag = function () {

  mapElement.classList.remove('map--faded');
  formElement.classList.remove('ad-form--disabled');

  setAdressData(mainPinElementArrowX, mainPinElementArrowY);

  disableFieldset();
  fieldAdressElement.disabled = true;
};

var setAdressData = function (x, y) {
  fieldAdressElement.value = (x - MAIN_PIN_WIDTH / 2) + ' ' + (y - MAIN_PIN_HEIGHT / 2);
};

var enableFieldset = function () {
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = true;
  }
};

var disableFieldset = function () {
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = false;
  }
};

var createClickHandler = function (data) {
  return function () {
    renderCardElement(data);

    var popupClose = document.querySelector('.popup__close');

    openPopup();

    popupClose.addEventListener('keydown', function (e) {
      onPopupEscPress(e);
    });

    popupClose.addEventListener('click', function () {
      closePopup();
    });
  };
};

var closePopup = function () {
  document.querySelector('.popup').classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

var openPopup = function () {
  document.querySelector('.popup').classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var onPopupEscPress = function (e) {
  if (e.keyCode === 27) {
    document.querySelector('.popup').classList.add('hidden');
  }
};

var template = document.querySelector('template');
var cardTemplate = template.content.querySelector('.map__card').cloneNode(true);
var photoTemplate = cardTemplate.querySelector('.popup__photo').cloneNode(true);
var pinTemplate = template.content.querySelector('.map__pin').cloneNode(true);

var formElement = document.querySelector('.ad-form');
var cardElement = cardTemplate.cloneNode(true);
var mainPinElement = document.querySelector('.map__pin--main');
var mapElement = document.querySelector('.map');
var fieldAdressElement = document.querySelector('#address');
var fieldsetElements = document.querySelector('.notice').querySelectorAll('fieldset');

var mainPinElementCenterX = parseInt(mainPinElement.style.left, 10);
var mainPinElementCenterY = parseInt(mainPinElement.style.top, 10);
var mainPinElementArrowY = mainPinElementCenterY + MAIN_PIN_HEIGHT / 2 + MAIN_PIN_ARROW_HEIGHT;
var mainPinElementArrowX = mainPinElementCenterX;

var fragment = document.createDocumentFragment();

var offers = [];
var offer;

var pinElements = [];
var pinElement;

for (var i = 0; i < OFFER_LIMIT; i++) {
  offer = generateOffer(i);
  offers.push(offer);

  pinElement = createPinElemet(offer, pinTemplate);
  pinElement.addEventListener('click', createClickHandler(offer));
  pinElements.push(pinElement);

  fragment.appendChild(pinElement);
}

document.querySelector('.map__pins').appendChild(fragment);

mainPinElement.addEventListener('mouseup', function () {
  onMainPinDrag();

  for (i = 0; i < pinElements.length; i++) {
    pinElements[i].classList.remove('hidden');
  }
});

enableFieldset();

setAdressData(mainPinElementCenterX, mainPinElementCenterY);
