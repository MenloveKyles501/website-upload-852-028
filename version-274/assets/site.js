(function() {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    ready(function() {
        var toggle = document.querySelector(".mobile-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (toggle && panel) {
            toggle.addEventListener("click", function() {
                var isOpen = !panel.hasAttribute("hidden");
                if (isOpen) {
                    panel.setAttribute("hidden", "");
                    toggle.setAttribute("aria-expanded", "false");
                } else {
                    panel.removeAttribute("hidden");
                    toggle.setAttribute("aria-expanded", "true");
                }
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
        if (slides.length > 1) {
            var index = 0;
            var showSlide = function(next) {
                index = (next + slides.length) % slides.length;
                slides.forEach(function(slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === index);
                });
                dots.forEach(function(dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === index);
                });
            };
            dots.forEach(function(dot, dotIndex) {
                dot.addEventListener("click", function() {
                    showSlide(dotIndex);
                });
            });
            setInterval(function() {
                showSlide(index + 1);
            }, 5600);
        }

        var filterInput = document.querySelector("[data-filter-input]");
        var regionSelect = document.querySelector("[data-filter-region]");
        var yearSelect = document.querySelector("[data-filter-year]");
        var typeSelect = document.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var empty = document.querySelector("[data-empty]");
        if (filterInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query) {
                filterInput.value = query;
            }
            var applyFilter = function() {
                var q = normalize(filterInput.value);
                var region = normalize(regionSelect && regionSelect.value);
                var year = normalize(yearSelect && yearSelect.value);
                var type = normalize(typeSelect && typeSelect.value);
                var visible = 0;
                cards.forEach(function(card) {
                    var text = normalize(card.getAttribute("data-search"));
                    var cardRegion = normalize(card.getAttribute("data-region"));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardType = normalize(card.getAttribute("data-type"));
                    var match = (!q || text.indexOf(q) !== -1) &&
                        (!region || cardRegion.indexOf(region) !== -1) &&
                        (!year || cardYear === year) &&
                        (!type || cardType.indexOf(type) !== -1);
                    card.hidden = !match;
                    if (match) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("visible", visible === 0);
                }
            };
            [filterInput, regionSelect, yearSelect, typeSelect].forEach(function(element) {
                if (element) {
                    element.addEventListener("input", applyFilter);
                    element.addEventListener("change", applyFilter);
                }
            });
            applyFilter();
        }

        var petals = document.createElement("div");
        petals.className = "petal-layer";
        document.body.appendChild(petals);
        for (var i = 0; i < 14; i += 1) {
            var petal = document.createElement("span");
            petal.className = "cherry-blossom";
            petal.style.left = Math.floor(Math.random() * 100) + "vw";
            petal.style.animationDuration = (9 + Math.random() * 9).toFixed(2) + "s";
            petal.style.animationDelay = (Math.random() * 7).toFixed(2) + "s";
            petals.appendChild(petal);
        }
    });
})();
