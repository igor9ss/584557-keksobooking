'use strict';

(function () {

  var loadData = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open(method, url);
    xhr.send(data);
  };

  window.load = {
    'LOAD_URL': 'https://js.dump.academy/keksobooking/data',
    'UPLOAD_URL': 'https://js.dump.academy/keksobooking',

    'loadFormData': function (onLoad, onError) {
      loadData('GET', this.LOAD_URL, onLoad, onError);
    },

    'sendFormData': function (data, onLoad, onError) {
      loadData('POST', this.UPLOAD_URL, onLoad, onError, data);
    }
  };
})();
