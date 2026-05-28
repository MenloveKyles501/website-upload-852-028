(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.play-overlay');
    var message = player.querySelector('[data-player-message]');
    var source = video ? video.getAttribute('data-src') : '';
    var hls = null;
    var attached = false;

    if (!video || !source) {
      return;
    }

    var setMessage = function (text) {
      if (message) {
        message.textContent = text || '';
      }
    };

    var attachSource = function () {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }

      video.src = source;
    };

    var play = function () {
      attachSource();
      player.classList.add('is-playing');
      var promise = video.play();

      if (promise && promise.catch) {
        promise.catch(function () {
          player.classList.remove('is-playing');
          setMessage('点击视频控件继续播放');
        });
      }
    };

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
      setMessage('');
    });

    video.addEventListener('pause', function () {
      player.classList.remove('is-playing');
    });

    video.addEventListener('error', function () {
      setMessage('当前网络环境下播放源加载较慢，可稍后重试');
    });

    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  });
})();
