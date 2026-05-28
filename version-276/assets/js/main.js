document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  function startSlider() {
    if (slides.length <= 1) {
      return;
    }
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      if (timer) {
        window.clearInterval(timer);
      }
      showSlide(index);
      startSlider();
    });
  });

  showSlide(0);
  startSlider();

  var searchInput = document.querySelector(".local-search-input");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-target .movie-card"));
  var emptyState = document.querySelector(".empty-state");
  var quickButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var clearButton = document.querySelector(".clear-filter");
  var params = new URLSearchParams(window.location.search);
  var query = params.get("q") || "";
  var quick = "";

  function applyFilter() {
    var text = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var shown = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute("data-search") || "").toLowerCase();
      var matchedText = !text || haystack.indexOf(text) !== -1;
      var matchedQuick = !quick || haystack.indexOf(quick.toLowerCase()) !== -1;
      var visible = matchedText && matchedQuick;
      card.style.display = visible ? "" : "none";
      if (visible) {
        shown += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("show", cards.length > 0 && shown === 0);
    }
  }

  if (searchInput && query) {
    searchInput.value = query;
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }

  quickButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-filter") || "";
      quick = quick === value ? "" : value;
      quickButtons.forEach(function (item) {
        item.classList.toggle("active", item === button && quick === value);
      });
      applyFilter();
    });
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      quick = "";
      if (searchInput) {
        searchInput.value = "";
      }
      quickButtons.forEach(function (item) {
        item.classList.remove("active");
      });
      applyFilter();
    });
  }

  applyFilter();
});
