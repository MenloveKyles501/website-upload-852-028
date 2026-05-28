function initMoviePlayer(streamUrl) {
  var video = document.getElementById("moviePlayer");
  var cover = document.querySelector(".player-cover");
  var sourceLoaded = false;
  var hlsInstance = null;

  if (!video || !streamUrl) {
    return;
  }

  function bindStream() {
    if (sourceLoaded) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    sourceLoaded = true;
  }

  function playVideo() {
    bindStream();
    if (cover) {
      cover.classList.add("hidden");
    }
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener("click", playVideo);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener("play", function () {
    if (cover) {
      cover.classList.add("hidden");
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
