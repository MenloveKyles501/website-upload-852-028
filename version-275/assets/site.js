document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            var expanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!expanded));
            mobilePanel.hidden = expanded;
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startHero() {
            stopHero();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        function stopHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
                startHero();
            });
        });

        hero.addEventListener("mouseenter", stopHero);
        hero.addEventListener("mouseleave", startHero);
        showSlide(0);
        startHero();
    }

    var toolbars = Array.prototype.slice.call(document.querySelectorAll("[data-filter-toolbar]"));
    toolbars.forEach(function (toolbar) {
        var input = toolbar.querySelector("[data-card-search]");
        var yearButtons = Array.prototype.slice.call(toolbar.querySelectorAll("[data-filter-year]"));
        var categoryButtons = Array.prototype.slice.call(toolbar.querySelectorAll("[data-filter-category]"));
        var selectedYear = "all";
        var selectedCategory = "all";

        var urlQuery = new URLSearchParams(window.location.search).get("q");
        if (input && urlQuery) {
            input.value = urlQuery;
        }

        function applyFilter() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var cards = Array.prototype.slice.call(document.querySelectorAll(".search-item"));
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-category"),
                    card.getAttribute("data-genre")
                ].join(" ").toLowerCase();
                var year = card.getAttribute("data-year") || "";
                var category = card.getAttribute("data-category") || "";
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchYear = selectedYear === "all" || year === selectedYear;
                var matchCategory = selectedCategory === "all" || category === selectedCategory;
                card.hidden = !(matchQuery && matchYear && matchCategory);
            });
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        yearButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedYear = button.getAttribute("data-filter-year") || "all";
                yearButtons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                applyFilter();
            });
        });

        categoryButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedCategory = button.getAttribute("data-filter-category") || "all";
                categoryButtons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                applyFilter();
            });
        });

        applyFilter();
    });

    var players = Array.prototype.slice.call(document.querySelectorAll(".player-card"));
    players.forEach(function (player) {
        var video = player.querySelector("video");
        var cover = player.querySelector(".player-cover");
        var url = player.getAttribute("data-video-url");
        var hlsInstance = null;
        var loaded = false;

        function attachSource() {
            if (!video || !url || loaded) {
                return;
            }
            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
            } else {
                video.src = url;
            }
        }

        function playVideo() {
            attachSource();
            player.classList.add("is-playing");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    player.classList.remove("is-playing");
                });
            }
        }

        if (cover && video) {
            cover.addEventListener("click", playVideo);
            video.addEventListener("click", function () {
                if (!loaded) {
                    playVideo();
                }
            });
            video.addEventListener("play", function () {
                player.classList.add("is-playing");
            });
            video.addEventListener("ended", function () {
                player.classList.remove("is-playing");
            });
        }

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
});
