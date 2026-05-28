(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobile = document.querySelector('[data-mobile-nav]');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', mobile.classList.contains('is-open'));
      toggle.textContent = mobile.classList.contains('is-open') ? '×' : '☰';
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var active = 0;
    var timer = null;
    var show = function (index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    var start = function () {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    };
    var restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });
    start();
  }

  var filterScope = document.querySelector('[data-filter-scope]');
  var cardList = document.querySelector('[data-card-list]');
  if (filterScope && cardList) {
    var search = filterScope.querySelector('[data-filter-search]');
    var selects = Array.prototype.slice.call(filterScope.querySelectorAll('[data-filter-select]'));
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('[data-card]'));
    var empty = filterScope.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (search && q) {
      search.value = q;
    }
    var apply = function () {
      var term = search ? search.value.trim().toLowerCase() : '';
      var filters = {};
      selects.forEach(function (select) {
        filters[select.getAttribute('data-filter-select')] = select.value;
      });
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.getAttribute('data-keywords') || '';
        var ok = true;
        if (term && text.indexOf(term) === -1) {
          ok = false;
        }
        Object.keys(filters).forEach(function (key) {
          if (filters[key] && card.getAttribute('data-' + key) !== filters[key]) {
            ok = false;
          }
        });
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };
    if (search) {
      search.addEventListener('input', apply);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', apply);
    });
    apply();
  }
})();

function initMoviePlayer(source) {
  var video = document.getElementById('movie-player');
  var trigger = document.getElementById('play-trigger');
  if (!video || !trigger || !source) {
    return;
  }
  var attached = false;
  var hls = null;
  var attach = function () {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        maxBufferLength: 30,
        enableWorker: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }
    video.src = source;
  };
  var start = function () {
    attach();
    trigger.classList.add('is-hidden');
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        trigger.classList.remove('is-hidden');
      });
    }
  };
  trigger.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function () {
    trigger.classList.add('is-hidden');
  });
  video.addEventListener('ended', function () {
    trigger.classList.remove('is-hidden');
  });
  window.addEventListener('beforeunload', function () {
    if (hls && hls.destroy) {
      hls.destroy();
    }
  });
}
