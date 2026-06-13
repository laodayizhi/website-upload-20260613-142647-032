(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var navMenu = document.querySelector("[data-nav-menu]");
        if (menuButton && navMenu) {
            menuButton.addEventListener("click", function () {
                navMenu.classList.toggle("is-open");
            });
        }

        var slider = document.querySelector("[data-hero-slider]");
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-dot]"));
            var current = 0;
            var showSlide = function (index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === current);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    showSlide(i);
                });
            });
            showSlide(0);
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        var filterForm = document.querySelector("[data-filter-form]");
        var filterInput = document.querySelector("[data-filter-input]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get("q") || "";
        if (filterInput && queryValue) {
            filterInput.value = queryValue;
        }
        var applyFilter = function () {
            if (!filterInput || !cards.length) {
                return;
            }
            var value = filterInput.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = card.getAttribute("data-search") || "";
                card.classList.toggle("hidden-card", value && haystack.indexOf(value) === -1);
            });
        };
        if (filterInput) {
            filterInput.addEventListener("input", applyFilter);
            applyFilter();
        }
        if (filterForm) {
            filterForm.addEventListener("submit", function (event) {
                event.preventDefault();
                applyFilter();
            });
        }

        var players = Array.prototype.slice.call(document.querySelectorAll("[data-stream-url]"));
        players.forEach(function (box) {
            var video = box.querySelector("video");
            var cover = box.querySelector(".player-cover");
            var started = false;
            var streamUrl = box.getAttribute("data-stream-url");
            var start = function () {
                if (!video || !streamUrl) {
                    return;
                }
                if (!started) {
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = streamUrl;
                    } else if (window.Hls && window.Hls.isSupported()) {
                        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                        hls.loadSource(streamUrl);
                        hls.attachMedia(video);
                    } else {
                        video.src = streamUrl;
                    }
                    started = true;
                }
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                var playResult = video.play();
                if (playResult && typeof playResult.catch === "function") {
                    playResult.catch(function () {});
                }
            };
            if (cover) {
                cover.addEventListener("click", start);
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (!started) {
                        start();
                    }
                });
            }
        });
    });
})();
