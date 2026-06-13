(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupMenu() {
        var button = qs('[data-menu-toggle]');
        var menu = qs('[data-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function setupBackTop() {
        qsa('[data-back-top]').forEach(function (button) {
            button.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    function setupHero() {
        var hero = qs('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function setupLocalFilter() {
        var panel = qs('[data-filter-form]');
        var list = qs('[data-movie-list]');
        if (!panel || !list) {
            return;
        }
        var keywordInput = qs('[data-filter-keyword]', panel);
        var yearSelect = qs('[data-filter-year]', panel);
        var typeSelect = qs('[data-filter-type]', panel);
        var resetButton = qs('[data-filter-reset]', panel);
        var cards = qsa('.movie-card', list);
        var empty = qs('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && keywordInput) {
            keywordInput.value = query;
        }
        function apply() {
            var keyword = normalize(keywordInput && keywordInput.value);
            var year = normalize(yearSelect && yearSelect.value);
            var type = normalize(typeSelect && typeSelect.value);
            var visibleCount = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.tags,
                    card.dataset.category,
                    card.dataset.year
                ].join(' '));
                var cardYear = normalize(card.dataset.year);
                var cardType = normalize(card.dataset.type);
                var matched = true;
                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (type && cardType !== type) {
                    matched = false;
                }
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visibleCount += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('show', visibleCount === 0);
            }
        }
        [keywordInput, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
        if (resetButton) {
            resetButton.addEventListener('click', function () {
                if (keywordInput) {
                    keywordInput.value = '';
                }
                if (yearSelect) {
                    yearSelect.value = '';
                }
                if (typeSelect) {
                    typeSelect.value = '';
                }
                apply();
            });
        }
        apply();
    }

    function setupGlobalSearch() {
        var form = qs('[data-site-search]');
        if (!form || !window.MOVIE_SEARCH_INDEX) {
            return;
        }
        var input = qs('input[name="q"]', form);
        var results = qs('[data-search-results]', form);
        if (!input || !results) {
            return;
        }
        function closeResults() {
            results.classList.remove('open');
            results.innerHTML = '';
        }
        function render(items) {
            if (!items.length) {
                closeResults();
                return;
            }
            results.innerHTML = items.slice(0, 8).map(function (item) {
                return [
                    '<a class="search-result-item" href="' + item.url + '">',
                    '<img class="search-result-thumb" src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" onerror="this.style.display=\'none\';">',
                    '<span>',
                    '<strong class="search-result-title">' + escapeHtml(item.title) + '</strong>',
                    '<small class="search-result-meta">' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.type) + '</small>',
                    '</span>',
                    '</a>'
                ].join('');
            }).join('');
            results.classList.add('open');
        }
        function escapeHtml(value) {
            return String(value || '').replace(/[&<>"']/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char];
            });
        }
        input.addEventListener('input', function () {
            var keyword = normalize(input.value);
            if (!keyword) {
                closeResults();
                return;
            }
            var matched = window.MOVIE_SEARCH_INDEX.filter(function (item) {
                var haystack = normalize([
                    item.title,
                    item.year,
                    item.region,
                    item.type,
                    item.category,
                    item.oneLine
                ].join(' '));
                return haystack.indexOf(keyword) !== -1;
            });
            render(matched);
        });
        form.addEventListener('submit', function (event) {
            var keyword = normalize(input.value);
            if (!keyword) {
                event.preventDefault();
                input.focus();
            }
        });
        document.addEventListener('click', function (event) {
            if (!form.contains(event.target)) {
                closeResults();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupBackTop();
        setupHero();
        setupLocalFilter();
        setupGlobalSearch();
    });
}());
