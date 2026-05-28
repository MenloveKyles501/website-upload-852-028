(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', menu.classList.contains('open'));
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    var show = function (nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  var input = document.querySelector('[data-filter-input]');
  var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
  var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
  var emptyStates = Array.prototype.slice.call(document.querySelectorAll('[data-empty-state]'));

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q');

  if (input && query) {
    input.value = query;
  }

  var normalize = function (value) {
    return String(value || '').toLowerCase().trim();
  };

  var filter = function () {
    var q = normalize(input ? input.value : '');
    var selected = {};

    selects.forEach(function (select) {
      selected[select.getAttribute('data-filter-select')] = normalize(select.value);
    });

    var visibleTotal = 0;

    scopes.forEach(function (scope) {
      var items = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-row'));
      var scopeVisible = 0;

      items.forEach(function (item) {
        var haystack = normalize([
          item.getAttribute('data-title'),
          item.getAttribute('data-region'),
          item.getAttribute('data-type'),
          item.getAttribute('data-year'),
          item.getAttribute('data-genre'),
          item.getAttribute('data-keywords')
        ].join(' '));

        var match = true;

        if (q && haystack.indexOf(q) === -1) {
          match = false;
        }

        Object.keys(selected).forEach(function (key) {
          if (!selected[key]) {
            return;
          }
          if (normalize(item.getAttribute('data-' + key)) !== selected[key]) {
            match = false;
          }
        });

        item.style.display = match ? '' : 'none';
        if (match) {
          scopeVisible += 1;
          visibleTotal += 1;
        }
      });

      scope.setAttribute('data-visible', String(scopeVisible));
    });

    emptyStates.forEach(function (empty) {
      empty.classList.toggle('show', visibleTotal === 0);
    });
  };

  if (input || selects.length) {
    if (input) {
      input.addEventListener('input', filter);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', filter);
    });
    filter();
  }
})();
