var SitePlayer = (function () {
  function start(url) {
    var video = document.getElementById("movie-player");
    var cover = document.getElementById("player-cover");
    if (!video || !url) {
      return;
    }

    function attach() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function play() {
      attach();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", play);
    }
    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  }

  return {
    start: start
  };
})();