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
  var housingRoomsValue;
  var housingGuestsVlue;
  var PriceVac = {
    lowPrice: 10000,
    highPrice: 50000
  };

  var getCheckboxesBoolValue = function (elem, string, data) {
    if ((elem.checked) && (data.offer.features.indexOf(string) !== -1)) {
      return true;
    }
    return false;
  };

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

    if (getCheckboxesBoolValue(wifiInput, 'wifi', data)) {
      rank += 1;
    }

    if (getCheckboxesBoolValue(dishwasherInput, 'dishwasher', data)) {
      rank += 1;
    }

    if (getCheckboxesBoolValue(parkingInput, 'parking', data)) {
      rank += 1;
    }

    if (getCheckboxesBoolValue(washerInput, 'washer', data)) {
      rank += 1;
    }

    if (getCheckboxesBoolValue(elevatorInput, 'elevator', data)) {
      rank += 1;
    }

    if (getCheckboxesBoolValue(conditionerInput, 'conditioner', data)) {
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
