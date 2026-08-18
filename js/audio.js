const storyAudio = document.querySelector("#story-audio");
const audioButton = document.querySelector("#audio-button");
const audioButtonLabel = document.querySelector("#audio-button-label");
const audioIcon = audioButton.querySelector(".audio-icon");

function updateAudioButton(isPlaying) {
  audioButtonLabel.textContent = isPlaying ? "Pausar audio" : "Reproducir audio";
  audioIcon.textContent = isPlaying ? "Ⅱ" : "▶";
}


function setAudioSource(src) {

  storyAudio.pause();

  storyAudio.currentTime = 0;

  if (!src) {
    storyAudio.removeAttribute("src");
    audioButton.hidden = true;
    return;
  }

  storyAudio.src = src;
  storyAudio.load();
  audioButton.hidden = false;
  updateAudioButton(false);

}


audioButton.addEventListener("click", async () => {

  if (storyAudio.paused) {

    try {

      await storyAudio.play();

      updateAudioButton(true);

    }

    catch (error) {

      console.error(
        "No se pudo reproducir el audio:",
        error
      );

    }

  }

  else {

    storyAudio.pause();

    updateAudioButton(false);

  }

});


storyAudio.addEventListener("ended", () => {

  updateAudioButton(false);

});


window.AudioController = {

  setSource: setAudioSource,
  stop() {
    storyAudio.pause();
    storyAudio.currentTime = 0;
    updateAudioButton(false);
  }

};
