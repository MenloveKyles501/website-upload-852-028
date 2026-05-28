(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");

    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function activate(index) {
        current = index;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function next() {
        if (slides.length > 1) {
          activate((current + 1) % slides.length);
        }
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          activate(index);
          if (timer) {
            window.clearInterval(timer);
          }
          timer = window.setInterval(next, 5200);
        });
      });

      if (slides.length > 1) {
        timer = window.setInterval(next, 5200);
      }
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var search = scope.querySelector("[data-filter-search]");
      var year = scope.querySelector("[data-filter-year]");
      var type = scope.querySelector("[data-filter-type]");
      var category = scope.querySelector("[data-filter-category]");
      var reset = scope.querySelector("[data-filter-reset]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));

      function valueOf(element) {
        return element ? element.value.trim().toLowerCase() : "";
      }

      function apply() {
        var keyword = valueOf(search);
        var selectedYear = valueOf(year);
        var selectedType = valueOf(type);
        var selectedCategory = valueOf(category);

        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
          var cardType = (card.getAttribute("data-type") || "").toLowerCase();
          var cardCategory = (card.getAttribute("data-category") || "").toLowerCase();
          var visible = true;

          if (keyword && text.indexOf(keyword) === -1) {
            visible = false;
          }
          if (selectedYear && cardYear !== selectedYear) {
            visible = false;
          }
          if (selectedType && cardType !== selectedType) {
            visible = false;
          }
          if (selectedCategory && cardCategory !== selectedCategory) {
            visible = false;
          }

          card.classList.toggle("is-hidden", !visible);
        });
      }

      [search, year, type, category].forEach(function (element) {
        if (element) {
          element.addEventListener("input", apply);
          element.addEventListener("change", apply);
        }
      });

      if (reset) {
        reset.addEventListener("click", function () {
          [search, year, type, category].forEach(function (element) {
            if (element) {
              element.value = "";
            }
          });
          apply();
        });
      }
    });

    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play]");
      var stream = player.getAttribute("data-stream");
      var loaded = false;
      var hls = null;

      function load() {
        if (!video || !stream || loaded) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }

        loaded = true;
      }

      function play() {
        load();
        player.classList.add("is-playing");
        if (button) {
          button.hidden = true;
        }
        if (video) {
          video.controls = true;
          var promise = video.play();
          if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
              if (button) {
                button.hidden = false;
              }
              player.classList.remove("is-playing");
            });
          }
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (!loaded) {
            play();
          }
        });
      }

      player.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          play();
        }
      });
    });
  });
})();
