'use strict';

(function () {
  var X_OFFSET = 25;
  var Y_OFFSET = 70;

  window.mapPin = {
    createElement: function (offerData, template) {
      var pinElement = template.cloneNode(true);
      var imageElement = pinElement.querySelector('img');

      pinElement.style.left = (offerData.location.x - X_OFFSET) + 'px';
      pinElement.style.top = (offerData.location.y - Y_OFFSET) + 'px';
      pinElement.classList.add('hidden');

      imageElement.src = offerData.author.avatar;
      imageElement.alt = offerData.title;

      return pinElement;
    }
  };
})();
