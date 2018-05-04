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
      rank += 4;
    }

    if ((housingPriceValue === 'low') && (data.offer.price <= PriceVac.lowPrice)) {
      rank += 3;
    } else if ((housingPriceValue === 'middle') &&
               (data.offer.price >= PriceVac.lowPrice) &&
               (data.offer.price <= PriceVac.highPrice)) {
      rank += 3;
    } else if ((housingPriceValue === 'high') &&
               (data.offer.price >= PriceVac.highPrice)) {
      rank += 3;
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
      return getRank(rig) - getRank(lef);
    }));

    pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (it) {
      it.classList.remove('hidden');
    });
  };

  var getSelectValue = function (elem) {
    window.setTimeout(function () {
      updatePins();
    }, 500);
    return elem.value;
  };

  filtersForm.addEventListener('change', function (evt) {
    if (evt.target.tagName === 'SELECT') {
      switch (evt.target) {
        case housingTypeElement:
          housingTypeValue = getSelectValue(housingTypeElement);
          break;

        case housingPriceElement:
          housingPriceValue = getSelectValue(housingPriceElement);
          break;

        case housingRoomsElement:
          housingRoomsValue = getSelectValue(housingRoomsElement);
          break;

        case housingGuestsElement:
          housingGuestsVlue = getSelectValue(housingGuestsElement);
      }
    }

    if (evt.target.tagName === 'INPUT') {
      window.setTimeout(function () {
        updatePins();
      }, 500);
    }
  });
})();
