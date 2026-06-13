(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-redirect]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('.js-search-input');
      var query = input ? input.value.trim() : '';
      var target = './search.html';
      if (query) {
        target += '?q=' + encodeURIComponent(query);
      }
      window.location.href = target;
    });
  });

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var input = document.querySelector('.filter-panel .js-search-input');
  var year = document.querySelector('.filter-panel .js-year-filter');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope] .movie-card'));
  var empty = document.querySelector('[data-empty-state]');

  if (input && initialQuery) {
    input.value = initialQuery;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }
    var query = normalize(input ? input.value : '');
    var selectedYear = year ? year.value : '';
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.region,
        card.dataset.type
      ].join(' '));
      var matchedQuery = !query || haystack.indexOf(query) !== -1;
      var matchedYear = !selectedYear || card.dataset.year === selectedYear;
      var show = matchedQuery && matchedYear;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });
    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  if (input) {
    input.addEventListener('input', applyFilter);
  }
  if (year) {
    year.addEventListener('change', applyFilter);
  }
  applyFilter();

  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 4800);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.dataset.heroDot || 0));
        start();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  });
}());
