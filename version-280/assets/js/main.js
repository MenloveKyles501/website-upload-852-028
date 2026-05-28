(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var mobileNav = document.querySelector(".mobile-nav");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero-carousel]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var prev = hero.querySelector(".hero-prev");
      var next = hero.querySelector(".hero-next");
      var index = Math.max(0, slides.findIndex(function (slide) {
        return slide.classList.contains("is-active");
      }));

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          var active = slideIndex === index;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", active ? "false" : "true");
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
        });
      }
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
        });
      });
      setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    var query = new URLSearchParams(window.location.search).get("q") || "";
    var panels = document.querySelectorAll("[data-filter-panel]");
    panels.forEach(function (panel) {
      var input = panel.querySelector(".filter-input");
      var year = panel.querySelector(".filter-year");
      var type = panel.querySelector(".filter-type");
      var category = panel.querySelector(".filter-category");
      var grid = panel.parentElement.querySelector(".filter-grid");
      if (!grid) {
        return;
      }
      var items = Array.prototype.slice.call(grid.querySelectorAll(".search-item"));
      if (input && query) {
        input.value = query;
      }

      function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
      }

      function applyFilter() {
        var q = normalize(input ? input.value : "");
        var y = normalize(year ? year.value : "");
        var t = normalize(type ? type.value : "");
        var c = normalize(category ? category.value : "");
        items.forEach(function (item) {
          var text = normalize(item.getAttribute("data-search"));
          var itemYear = normalize(item.getAttribute("data-year"));
          var itemType = normalize(item.getAttribute("data-type"));
          var itemCategory = normalize(item.getAttribute("data-category"));
          var matched = true;
          if (q && text.indexOf(q) === -1) {
            matched = false;
          }
          if (y && itemYear.indexOf(y) === -1) {
            matched = false;
          }
          if (t && itemType.indexOf(t) === -1 && text.indexOf(t) === -1) {
            matched = false;
          }
          if (c && itemCategory !== c) {
            matched = false;
          }
          item.classList.toggle("is-hidden", !matched);
        });
      }

      [input, year, type, category].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
      applyFilter();
    });
  });
})();