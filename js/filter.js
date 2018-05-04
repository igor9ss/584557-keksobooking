'use strict';

(function () {
  var filtersForm = document.querySelector('.map__filters');

  var housingTypeElement = filtersForm.querySelector('#housing-type');
  var housingPriceElement = filtersForm.querySelector('#housing-price');
  var housingRoomsElement = filtersForm.querySelector('#housing-rooms');
  var housingGuestsElement = filtersForm.querySelector('#housing-guests');

  var wifiInput = filtersForm.querySelector('#filter-wifi');
  var dishwasherInput = filtersForm.querySelector('#filter-dishwasher');
  var parkingInput = filtersForm.querySelector('#filter-parking');
  var washerInput = filtersForm.querySelector('#filter-washer');
  var elevatorInput = filtersForm.querySelector('#filter-elevator');
  var conditionerInput = filtersForm.querySelector('#filter-conditioner');

  var housingTypeValue;
  var housingPriceValue;
  var PriceVac = {
    lowPrice: 10000,
    highPrice: 50000
  };

  var housingRoomsValue;
  var housingGuestsVlue;

  var getRank = function (data) {
    var rank = 0;

    if (data.offer.type === housingTypeValue) {
      rank += 2;
    }

    if ((housingPriceValue === 'low') && (data.offer.price <= PriceVac.lowPrice)) {
      rank += 2;
    } else if ((housingPriceValue === 'middle') &&
               (data.offer.price >= PriceVac.lowPrice) &&
               (data.offer.price <= PriceVac.highPrice)) {
      rank += 2;
    } else if ((housingPriceValue === 'high') &&
               (data.offer.price >= PriceVac.highPrice)) {
      rank += 2;
    }

    if (data.offer.rooms === +housingRoomsValue) {
      rank += 2;
    }

    if (data.offer.guests >= +housingGuestsVlue) {
      rank += 2;
    }

    if ((wifiInput.checked) && (data.offer.features.indexOf('wifi') !== -1)) {
      rank += 1;
    }

    if ((dishwasherInput.checked) && (data.offer.features.indexOf('dishwasher')) !== -1) {
      rank += 1;
    }

    if ((parkingInput.checked) && (data.offer.features.indexOf('parking')) !== -1) {
      rank += 1;
    }

    if ((washerInput.checked) && (data.offer.features.indexOf('washer')) !== -1) {
      rank += 1;
    }

    if ((elevatorInput.checked) && (data.offer.features.indexOf('elevator')) !== -1) {
      rank += 1;
    }

    if ((conditionerInput.checked) && (data.offer.features.indexOf('conditioner')) !== -1) {
      rank += 1;
    }

    return rank;
  };

  var updatePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    pins.forEach(function (it) {
      it.remove();
    });

    window.renderPin(window.pinData.sort(function (lef, rig) {
      return getRank(lef) - getRank(rig);
    }));
    pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (it) {
      it.classList.remove('hidden');
    });
  };

  housingTypeElement.addEventListener('change', function () {
    housingTypeValue = housingTypeElement.value;
    updatePins();
  });

  housingPriceElement.addEventListener('change', function () {
    housingPriceValue = housingPriceElement.value;
    updatePins();
  });

  housingRoomsElement.addEventListener('change', function () {
    housingRoomsValue = housingRoomsElement.value;
    updatePins();
  });

  housingGuestsElement.addEventListener('change', function () {
    housingGuestsVlue = housingGuestsElement.value;
    updatePins();
  });

  wifiInput.addEventListener('change', function () {
    updatePins();
  });

  dishwasherInput.addEventListener('change', function () {
    updatePins();
  });

  parkingInput.addEventListener('change', function () {
    updatePins();
  });

  washerInput.addEventListener('change', function () {
    updatePins();
  });

  elevatorInput.addEventListener('change', function () {
    updatePins();
  });

  conditionerInput.addEventListener('change', function () {
    updatePins();
  });
})();
