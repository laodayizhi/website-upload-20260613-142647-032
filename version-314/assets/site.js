(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var siteNav = document.querySelector("[data-site-nav]");

    if (menuButton && siteNav) {
        menuButton.addEventListener("click", function () {
            siteNav.classList.toggle("open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5600);
    }

    var searchInput = document.querySelector("[data-card-search]");
    var regionFilter = document.querySelector("[data-region-filter]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var genreFilter = document.querySelector("[data-genre-filter]");
    var countTarget = document.querySelector("[data-filter-count]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));

    function textOf(value) {
        return (value || "").toString().toLowerCase();
    }

    function matchSelect(cardValue, selectedValue, allLabel) {
        if (!selectedValue || selectedValue === allLabel) {
            return true;
        }
        return textOf(cardValue).indexOf(textOf(selectedValue)) !== -1;
    }

    function filterCards() {
        if (!cards.length) {
            return;
        }
        var query = textOf(searchInput && searchInput.value).trim();
        var region = regionFilter ? regionFilter.value : "";
        var type = typeFilter ? typeFilter.value : "";
        var genre = genreFilter ? genreFilter.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = [
                card.dataset.title,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type,
                card.dataset.genre,
                card.textContent
            ].join(" ").toLowerCase();
            var ok = true;

            if (query && haystack.indexOf(query) === -1) {
                ok = false;
            }
            if (!matchSelect(card.dataset.region, region, "全部地区")) {
                ok = false;
            }
            if (!matchSelect(card.dataset.type, type, "全部类型")) {
                ok = false;
            }
            if (!matchSelect(card.dataset.genre, genre, "全部题材")) {
                ok = false;
            }

            card.classList.toggle("is-hidden", !ok);
            if (ok) {
                visible += 1;
            }
        });

        if (countTarget) {
            countTarget.textContent = visible + " 部影片";
        }
    }

    [searchInput, regionFilter, typeFilter, genreFilter].forEach(function (control) {
        if (control) {
            control.addEventListener("input", filterCards);
            control.addEventListener("change", filterCards);
        }
    });

    filterCards();
})();
