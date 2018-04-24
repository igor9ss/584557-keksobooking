'use strict';

(function () {
  window.createPinElemet = function (offerData, pattern) {
    var pinElement = pattern.cloneNode(true);
    var imageElement = pinElement.querySelector('img');

    pinElement.style.left = (offerData.location.x - 25) + 'px';
    pinElement.style.top = (offerData.location.y - 70) + 'px';
    pinElement.classList.add('hidden');

    imageElement.src = offerData.author.avatar;
    imageElement.alt = offerData.title;

    return pinElement;
  };
})();
