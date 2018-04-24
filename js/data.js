'use strict';

(function () {
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
  
  window.generateOffers = function () {
    var offers = [];
    for (var i = 0; i < OFFER_LIMIT; i++) {
      offer = generateOffer(i);
      offers.push(offer);
    }
    return offers;
  };  
})();
