export const loadFixture = (fixture, callback) => {
    var request = new XMLHttpRequest();

    request.onerror = () => {
        callback('request-failed');
    };
    request.onload = (event) => {
        callback(null, event.target.response);
    };
    request.open('GET', 'base/test/fixtures/' + fixture);
    request.responseType = 'arraybuffer';
    request.send();
};
