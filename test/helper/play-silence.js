if (window.audioElement === undefined) {
    const audioElement = new Audio();

    audioElement.loop = true;
    audioElement.src = 'base/test/fixtures/a-second-of-silence.aif';
    audioElement.play();

    window.audioElement = audioElement;
}
