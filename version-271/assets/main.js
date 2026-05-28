(function() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobile = document.querySelector('[data-mobile-nav]');

  if (toggle && mobile) {
    toggle.addEventListener('click', function() {
      mobile.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var next = parseInt(dot.getAttribute('data-hero-dot'), 10) || 0;
        showSlide(next);
      });
    });

    window.setInterval(function() {
      showSlide(index + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-search-scope]').forEach(function(scope) {
    var input = scope.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
    var empty = scope.querySelector('.empty-state');

    function activeFilter() {
      var current = scope.querySelector('[data-filter].is-active');
      return current ? current.getAttribute('data-filter') : 'all';
    }

    function updateCards() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var filter = activeFilter();
      var visible = 0;

      cards.forEach(function(card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-meta') || ''
        ].join(' ').toLowerCase();
        var kind = card.getAttribute('data-kind') || '';
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchFilter = filter === 'all' || kind.indexOf(filter) !== -1 || haystack.indexOf(filter.toLowerCase()) !== -1;
        var show = matchQuery && matchFilter;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (input) {
      input.addEventListener('input', updateCards);
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        buttons.forEach(function(item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        updateCards();
      });
    });
  });
}());
