const storyAudio = document.querySelector("#story-audio");
const audioButton = document.querySelector("#audio-button");


function setAudioSource(src) {

  storyAudio.pause();

  storyAudio.currentTime = 0;

  storyAudio.src = src;

  storyAudio.load();

  audioButton.textContent = "▶ Escuchar";

}


audioButton.addEventListener("click", async () => {

  if (storyAudio.paused) {

    try {

      await storyAudio.play();

      audioButton.textContent = "⏸ Pausar";

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

    audioButton.textContent = "▶ Escuchar";

  }

});


storyAudio.addEventListener("ended", () => {

  audioButton.textContent = "▶ Escuchar";

});


window.AudioController = {

  setSource: setAudioSource

};