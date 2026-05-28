(function() {
    window.setupMoviePlayer = function(source) {
        var video = document.getElementById("movie-video");
        var overlay = document.getElementById("play-cover");
        if (!video || !overlay || !source) {
            return;
        }
        var initialized = false;
        var hls = null;
        var initialize = function() {
            if (initialized) {
                return;
            }
            initialized = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        };
        var start = function() {
            initialize();
            overlay.setAttribute("hidden", "");
            video.controls = true;
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function() {
                    overlay.removeAttribute("hidden");
                });
            }
        };
        overlay.addEventListener("click", start);
        video.addEventListener("click", function() {
            if (!initialized || video.paused) {
                start();
            }
        });
        video.addEventListener("play", function() {
            overlay.setAttribute("hidden", "");
        });
        window.addEventListener("beforeunload", function() {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
