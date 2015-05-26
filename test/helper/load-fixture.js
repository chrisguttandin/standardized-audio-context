'use strict';

module.exports = function loadFixture(fixture, callback) {
    var request = new XMLHttpRequest();

    request.onerror = function (event) {
        callback('request-failed');
    };
    request.onload = function (event) {
        callback(null, event.target.response);
    };
    request.open('GET', 'base/test/fixtures/' + fixture);
    request.responseType = 'arraybuffer';
    request.send();
};
