(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var menuPanel = document.querySelector("[data-menu-panel]");

  if (menuButton && menuPanel) {
    menuButton.addEventListener("click", function () {
      menuPanel.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  });

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    var root = form.closest("main") || document;
    var cards = Array.prototype.slice.call(root.querySelectorAll(".filter-card"));
    var searchInput = form.querySelector("[data-filter-search]");
    var categoryInput = form.querySelector("[data-filter-category]");
    var yearInput = form.querySelector("[data-filter-year]");

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function applyFilter() {
      var keyword = normalize(searchInput ? searchInput.value : "");
      var category = normalize(categoryInput ? categoryInput.value : "");
      var year = normalize(yearInput ? yearInput.value : "");

      cards.forEach(function (card) {
        var title = normalize(card.getAttribute("data-title"));
        var cardCategory = normalize(card.getAttribute("data-category"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var tags = normalize(card.getAttribute("data-tags"));
        var textMatch = !keyword || title.indexOf(keyword) >= 0 || tags.indexOf(keyword) >= 0 || cardCategory.indexOf(keyword) >= 0;
        var categoryMatch = !category || cardCategory === category;
        var yearMatch = !year || cardYear.indexOf(year) >= 0;
        card.classList.toggle("is-hidden", !(textMatch && categoryMatch && yearMatch));
      });
    }

    [searchInput, categoryInput, yearInput].forEach(function (input) {
      if (input) {
        input.addEventListener("input", applyFilter);
        input.addEventListener("change", applyFilter);
      }
    });
  });
}());
