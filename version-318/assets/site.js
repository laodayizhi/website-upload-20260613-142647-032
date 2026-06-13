(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuToggle = document.querySelector("[data-menu-toggle]");
        var mainNav = document.querySelector("[data-main-nav]");
        if (menuToggle && mainNav) {
            menuToggle.addEventListener("click", function () {
                mainNav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input");
                var value = input ? input.value.trim() : "";
                window.location.href = "./search.html" + (value ? "?q=" + encodeURIComponent(value) : "");
            });
        });

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dotsWrap = hero.querySelector(".hero-dots");
            var current = 0;
            var timer = null;

            function setSlide(next) {
                if (!slides.length) {
                    return;
                }
                current = (next + slides.length) % slides.length;
                slides.forEach(function (slide, index) {
                    slide.classList.toggle("is-active", index === current);
                });
                if (dotsWrap) {
                    Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, index) {
                        dot.classList.toggle("is-active", index === current);
                    });
                }
            }

            function startTimer() {
                clearInterval(timer);
                timer = setInterval(function () {
                    setSlide(current + 1);
                }, 5200);
            }

            if (dotsWrap) {
                slides.forEach(function (_, index) {
                    var dot = document.createElement("button");
                    dot.type = "button";
                    dot.setAttribute("aria-label", "切换推荐 " + (index + 1));
                    dot.addEventListener("click", function () {
                        setSlide(index);
                        startTimer();
                    });
                    dotsWrap.appendChild(dot);
                });
            }

            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            if (prev) {
                prev.addEventListener("click", function () {
                    setSlide(current - 1);
                    startTimer();
                });
            }
            if (next) {
                next.addEventListener("click", function () {
                    setSlide(current + 1);
                    startTimer();
                });
            }
            setSlide(0);
            startTimer();
        }

        document.querySelectorAll("[data-movie-search]").forEach(function (input) {
            var target = input.getAttribute("data-movie-search") || "body";
            var scope = document.querySelector(target) || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
            var empty = scope.querySelector("[data-empty-state]");
            var url = new URL(window.location.href);
            var initial = url.searchParams.get("q") || "";
            if (initial && !input.value) {
                input.value = initial;
            }

            function apply() {
                var query = input.value.trim().toLowerCase();
                var visible = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search-text") || card.textContent || "").toLowerCase();
                    var hit = !query || text.indexOf(query) !== -1;
                    card.style.display = hit ? "" : "none";
                    if (hit) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            input.addEventListener("input", apply);
            apply();
        });
    });

    window.initMoviePlayer = function (source) {
        var video = document.querySelector(".movie-video");
        var cover = document.querySelector(".play-cover");
        var hlsReady = false;
        var hlsInstance = null;

        function playVideo() {
            if (!video || !source) {
                return;
            }
            if (cover) {
                cover.classList.add("is-hidden");
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (video.getAttribute("src") !== source) {
                    video.setAttribute("src", source);
                }
                video.play().catch(function () {});
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                if (!hlsReady) {
                    hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    hlsReady = true;
                } else {
                    video.play().catch(function () {});
                }
                return;
            }
            if (video.getAttribute("src") !== source) {
                video.setAttribute("src", source);
            }
            video.play().catch(function () {});
        }

        if (cover) {
            cover.addEventListener("click", playVideo);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    playVideo();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        }
    };
})();
