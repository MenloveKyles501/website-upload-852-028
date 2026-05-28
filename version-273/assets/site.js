(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  function setupSearch() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-search-scope]"));
    scopes.forEach(function (panel) {
      var section = panel.parentElement;
      var input = panel.querySelector("[data-search-input]");
      var buttons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-button]"));
      var sort = panel.querySelector("[data-sort-select]");
      var list = section ? section.querySelector("[data-card-list]") : null;
      if (!list) {
        return;
      }
      function cards() {
        return Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
      }
      function activeGroup() {
        var active = panel.querySelector("[data-filter-button].is-active");
        return active ? active.getAttribute("data-filter-button") : "";
      }
      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var group = activeGroup();
        cards().forEach(function (card) {
          var text = (card.getAttribute("data-title") || "").toLowerCase();
          var cardGroup = card.getAttribute("data-group") || "";
          var visible = (!query || text.indexOf(query) !== -1) && (!group || cardGroup === group);
          card.classList.toggle("is-hidden", !visible);
        });
      }
      function sortCards() {
        if (!sort) {
          return;
        }
        var value = sort.value;
        var nodes = cards();
        if (value === "year") {
          nodes.sort(function (a, b) {
            return (b.getAttribute("data-title") || "").localeCompare(a.getAttribute("data-title") || "", "zh-Hans");
          });
        } else if (value === "title") {
          nodes.sort(function (a, b) {
            return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans");
          });
        } else {
          nodes.sort(function (a, b) {
            return 0;
          });
        }
        nodes.forEach(function (node) {
          list.appendChild(node);
        });
        apply();
      }
      if (input) {
        input.addEventListener("input", apply);
      }
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          buttons.forEach(function (item) {
            item.classList.remove("is-active");
          });
          button.classList.add("is-active");
          apply();
        });
      });
      if (sort) {
        sort.addEventListener("change", sortCards);
      }
    });
  }

  function getHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector("script[data-hls-loader]");
      if (existing) {
        existing.addEventListener("load", function () {
          resolve(window.Hls);
        });
        existing.addEventListener("error", reject);
        return;
      }
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
      script.async = true;
      script.setAttribute("data-hls-loader", "1");
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function bindPlayer(shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector(".player-start");
    var stream = shell.getAttribute("data-stream");
    var loaded = false;
    if (!video || !button || !stream) {
      return;
    }
    function attach() {
      if (loaded) {
        return Promise.resolve();
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return Promise.resolve();
      }
      return getHls().then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }).catch(function () {
        video.src = stream;
      });
    }
    function play() {
      shell.classList.add("is-playing");
      attach().then(function () {
        var result = video.play();
        if (result && typeof result.catch === "function") {
          result.catch(function () {});
        }
      });
    }
    button.addEventListener("click", function (event) {
      event.preventDefault();
      play();
    });
    shell.addEventListener("click", function (event) {
      if (event.target === video) {
        return;
      }
      play();
    });
  }

  function setupPlayers() {
    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(bindPlayer);
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
    setupPlayers();
  });
})();
