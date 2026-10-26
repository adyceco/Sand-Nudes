document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCustomCursor();
    initPhotosSection();
    const resetCredits = initCreditsSection();
    initEasterEggs();
    initGoofyEggs();

    // Wait for YouTube API to be ready, then init films
    window.resetCredits = resetCredits;
    waitForYouTubeAPI().then(() => initFilmsSection());
});

/* =========================================
   WAIT FOR YOUTUBE API (with timeout)
   ========================================= */
function waitForYouTubeAPI() {
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            resolve();
        } else {
            const original = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (original) original();
                resolve();
            };
            // safety timeout after 5 seconds
            setTimeout(resolve, 5000);
        }
    });
}

/* =========================================
   NAVIGATION
   ========================================= */
function initNavigation() {
    const buttons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".view-section");
    const logo = document.getElementById("logo-container");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");

            buttons.forEach(b => b.classList.remove("active"));
            sections.forEach(s => s.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(target).classList.add("active");
            
            logo.style.transform = "translateX(-50%) translateY(15px) scale(0.95)";
            setTimeout(() => {
                logo.style.transform = "translateX(-50%) translateY(0) scale(1)";
            }, 250);

            if (target === "view-credits" && window.resetCredits) {
                window.resetCredits();
            }
        });
    });
}

/* =========================================
   CUSTOM CURSOR
   ========================================= */
function initCustomCursor() {
    const cursor = document.getElementById("custom-cursor");
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function tick() {
        let errorX = mouseX - cursorX;
        let errorY = mouseY - cursorY;
        cursorX += errorX * 0.4;
        cursorY += errorY * 0.4;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(tick);
    }
    tick();

    const videoContainer = document.getElementById("film-player-container");
    if (videoContainer) {
        videoContainer.addEventListener("mouseenter", () => cursor.classList.add("cursor-normal"));
        videoContainer.addEventListener("mouseleave", () => cursor.classList.remove("cursor-normal"));
    }

    document.addEventListener("mouseover", (e) => {
        if (e.target.closest("button, a, .archive-item, .credit-name, #lightbox-close, #festival-logo")) {
            cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
        }
    });
    document.addEventListener("mouseout", (e) => {
        if (e.target.closest("button, a, .archive-item, .credit-name, #lightbox-close, #festival-logo")) {
            cursor.style.transform = "translate(-50%, -50%) scale(1)";
        }
    });
}

/* =========================================
   FILMS – SESSION NO‑REPEAT, AUTOPLAY, YT API
   ========================================= */
function initFilmsSection() {
    const playerContainer = document.getElementById("film-player-container");
    const captionEl = document.getElementById("film-caption");
    const watchYtEl = document.getElementById("film-watch-yt");
    const rollBtn = document.getElementById("btn-random-film");
    const rollBtnMobile = document.getElementById("btn-random-film-mobile");
    const autoplayToggle = document.getElementById("btn-autoplay-toggle");

    const videoPool = [
        // SN 2018
        { id: "3mSTECXqrcU", edition: "SN 2018" },
        { id: "aPK4Gt22Mjk", edition: "SN 2018" },
        { id: "wfO5CDXnitw", edition: "SN 2018" },
        { id: "aCbk4M6kyvY", edition: "SN 2018" },
        { id: "HKYn04ilATw", edition: "SN 2018" },
        { id: "LiLxzn0NVrE", edition: "SN 2018" },
        { id: "nbLDPfCRZ48", edition: "SN 2018" },
        { id: "krk8REqE3OU", edition: "SN 2018" },
        { id: "VlFbPyENPzQ", edition: "SN 2018" },
        // SN 2019
        { id: "gguvOuZg5Xc", edition: "SN 2019" },
        { id: "vG2uDXLG95s", edition: "SN 2019" },
        { id: "k8REY7D00LU", edition: "SN 2019" },
        { id: "XUtXf7hwK88", edition: "SN 2019" },
        { id: "RjJDZu0t4Cg", edition: "SN 2019" },
        { id: "XCtGiX_DWRU", edition: "SN 2019" },
        { id: "EOyOilULin8", edition: "SN 2019" },
        { id: "CY417_36Wng", edition: "SN 2019" },
        { id: "XjP28Hq7TyY", edition: "SN 2019" },
        // SN 2021
        { id: "bml6IDXpUs4", edition: "SN 2021" },
        { id: "m47_hKzaNGQ", edition: "SN 2021" },
        { id: "ZRfg0NF2hD0", edition: "SN 2021" },
        { id: "EVca1qN9jK4", edition: "SN 2021" },
        { id: "ut7sUj5BD40", edition: "SN 2021" },
        { id: "uXu6ekVaESc", edition: "SN 2021" },
        { id: "-M0m425Xygc", edition: "SN 2021" },
        { id: "QIjeiIvny9M", edition: "SN 2021" },
        { id: "9jy2NjGro2c", edition: "SN 2021" },
        { id: "vIhrB0t301g", edition: "SN 2021" },
        { id: "Vvrf79JCKsQ", edition: "SN 2021" },
        // SN 2022
        { id: "V-UfekvyG-E", edition: "SN 2022" },
        { id: "nobdm3C3lm0", edition: "SN 2022" },
        { id: "FsG6Z0e9NN0", edition: "SN 2022" },
        { id: "E8puzAl0fdE", edition: "SN 2022" },
        { id: "cUAHescA_2M", edition: "SN 2022" },
        { id: "Mnf7G7cxtC4", edition: "SN 2022" },
        { id: "AQpbcX8VhBo", edition: "SN 2022" },
        { id: "p8lN3azCjbw", edition: "SN 2022" },
        { id: "vz_-glGeGnc", edition: "SN 2022" },
        { id: "CKygohz1WgA", edition: "SN 2022" },
        { id: "Z43oEs5eKsQ", edition: "SN 2022" },
        { id: "ShP-O7VAqeU", edition: "SN 2022" },
        { id: "-gH2Ba7lNLs", edition: "SN 2022" },
        // SN 2023
        { id: "gxuLZltqCZg", edition: "SN 2023" },
        { id: "T5GJruBU6gg", edition: "SN 2023" },
        { id: "akBS9b3hDsE", edition: "SN 2023" },
        { id: "2WTwTy9KZeA", edition: "SN 2023" },
        { id: "7OFlaGuOWXo", edition: "SN 2023" },
        { id: "ACtu8fhBeU8", edition: "SN 2023" },
        { id: "CFh6JCTh6IQ", edition: "SN 2023" },
        { id: "PlNeDP7fMEo", edition: "SN 2023" },
        { id: "TRqpB8vQ3sA", edition: "SN 2023" },
        { id: "cUZyrxVrulg", edition: "SN 2023" },
        { id: "fdPkFfQfLlI", edition: "SN 2023" },
        { id: "isLBW2qaDWI", edition: "SN 2023" },
        { id: "kFHtqwY1sxk", edition: "SN 2023" },
        { id: "ksjfSO5HKME", edition: "SN 2023" },
        { id: "uV1pA_6aCFQ", edition: "SN 2023" },
        // SN 2024
        { id: "nEXyR2NjOIQ", edition: "SN 2024" },
        { id: "8wpnG2K20Ls", edition: "SN 2024" },
        { id: "560xze4Mcto", edition: "SN 2024" },
        { id: "DpYPpiY839w", edition: "SN 2024" },
        { id: "KxVx-YNJ2Xo", edition: "SN 2024" },
        { id: "LPYrM7AY0gM", edition: "SN 2024" },
        { id: "8FoBLwvdsIM", edition: "SN 2024" },
        { id: "M94BtMb1JcM", edition: "SN 2024" },
        { id: "c7E0hvb6CZg", edition: "SN 2024" },
        { id: "esIhfxNM86g", edition: "SN 2024" },
        { id: "htOgCboA1IM", edition: "SN 2024" },
        // SN 2025
        { id: "JfXAFlCB_TE", edition: "SN 2025" },
        { id: "sgceJB59Ex8", edition: "SN 2025" },
        { id: "kDdfOtscZL8", edition: "SN 2025" },
        { id: "o5K8qbnW38c", edition: "SN 2025" },
        { id: "p083M709IRg", edition: "SN 2025" },
        { id: "nQ78ahYT5kM", edition: "SN 2025" },
        { id: "rVLK1g5lX1Q", edition: "SN 2025" },
        { id: "wh56zQgJhhQ", edition: "SN 2025" },
        { id: "U7THLSVsWC4", edition: "SN 2025" },
        { id: "GfMVhQEMgtQ", edition: "SN 2025" },
        { id: "aytuZ9VOqZ8", edition: "SN 2025" },
        { id: "iM1l9SwrXAY", edition: "SN 2025" },
        { id: "5kfBynDrSgQ", edition: "SN 2025" },
        { id: "7-HO3cTIsP8", edition: "SN 2025" },
        { id: "gt3Uurg0qo8", edition: "SN 2025" },
        { id: "EtCQ-3YTLxM", edition: "SN 2025" }
    ];

    let player = null;
    let isPlayerReady = false;
    let hasUserPlayedInsideIframe = false;
    let shownVideos = new Set();
    let autoplay = (localStorage.getItem('sn_autoplay') === 'true');
    updateAutoplayUI();

    function updateAutoplayUI() {
        autoplayToggle.textContent = autoplay ? 'AUTOPLAY: ON' : 'AUTOPLAY: OFF';
        autoplayToggle.classList.toggle('active', autoplay);
    }

    autoplayToggle.addEventListener('click', () => {
        autoplay = !autoplay;
        localStorage.setItem('sn_autoplay', autoplay);
        updateAutoplayUI();
    });

    function getNextVideo() {
        const unseen = videoPool.filter(v => !shownVideos.has(v.id));
        if (unseen.length === 0) {
            shownVideos.clear();
            return videoPool[Math.floor(Math.random() * videoPool.length)];
        }
        return unseen[Math.floor(Math.random() * unseen.length)];
    }

    function updateFilmMeta(videoObj) {
        captionEl.textContent = videoObj.edition;
        if (watchYtEl) {
            watchYtEl.href = `https://www.youtube.com/watch?v=${videoObj.id}`;
        }
    }

    function createFallbackIframe(videoId, shouldAutoplay) {
        playerContainer.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${shouldAutoplay ? 1 : 0}&playsinline=1&rel=0&modestbranding=1`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        playerContainer.appendChild(iframe);
    }

    // Reuses a single persistent YT.Player instance with youtube-nocookie.com to avoid redirect loops and bot checks
    function loadVideo(videoObj, shouldAutoplay = false) {
        updateFilmMeta(videoObj);
        shownVideos.add(videoObj.id);

        if (!window.YT || !window.YT.Player) {
            const ph = document.getElementById('video-placeholder');
            if (ph) ph.remove();
            createFallbackIframe(videoObj.id, shouldAutoplay);
            return;
        }

        // Reuse persistent player if already initialized
        if (player && isPlayerReady) {
            try {
                player.unMute();
                if (shouldAutoplay) {
                    player.loadVideoById(videoObj.id);
                } else {
                    player.cueVideoById(videoObj.id);
                }
                return;
            } catch (e) {
                console.warn('Error reusing YT.Player, re-initializing:', e);
                try { player.destroy(); } catch (_) {}
                player = null;
                isPlayerReady = false;
            }
        }

        let ytDiv = document.getElementById('yt-player');
        if (!ytDiv) {
            playerContainer.innerHTML = `
                <div id="video-placeholder">LOADING FILM...</div>
                <div id="yt-player"></div>
            `;
        }

        try {
            player = new YT.Player('yt-player', {
                videoId: videoObj.id,
                host: 'https://www.youtube-nocookie.com',
                playerVars: {
                    autoplay: shouldAutoplay ? 1 : 0,
                    playsinline: 1,
                    rel: 0,
                    modestbranding: 1,
                    enablejsapi: 1,
                    origin: window.location.origin
                },
                events: {
                    onReady: () => {
                        isPlayerReady = true;
                        const ph = document.getElementById('video-placeholder');
                        if (ph) ph.remove();
                    },
                    onStateChange: (event) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            hasUserPlayedInsideIframe = true;
                        }
                        if (event.data === YT.PlayerState.ENDED && autoplay) {
                            const next = getNextVideo();
                            loadVideo(next, true);
                        }
                    },
                    onError: (event) => {
                        console.warn('YouTube Player error:', event.data);
                        createFallbackIframe(videoObj.id, shouldAutoplay);
                    }
                }
            });
        } catch (e) {
            console.warn('YT.Player failed, falling back to iframe', e);
            const ph = document.getElementById('video-placeholder');
            if (ph) ph.remove();
            createFallbackIframe(videoObj.id, shouldAutoplay);
        }
    }

    function playRandomFilm(isInitialLoad = false) {
        rollBtn.classList.add("clicked");
        if (rollBtnMobile) rollBtnMobile.classList.add("clicked");
        setTimeout(() => {
            rollBtn.classList.remove("clicked");
            if (rollBtnMobile) rollBtnMobile.classList.remove("clicked");
        }, 200);
        const next = getNextVideo();
        // On initial load, cue without forced autoplay so the browser/YouTube doesn't flag automated playback.
        // On user click ("RANDOM FILM"), play the film immediately!
        const shouldAutoplay = isInitialLoad ? false : true;
        loadVideo(next, shouldAutoplay);
    }

    rollBtn.addEventListener("click", () => playRandomFilm(false));
    if (rollBtnMobile) rollBtnMobile.addEventListener("click", () => playRandomFilm(false));

    // Cue first video right away
    if (document.getElementById('view-films').classList.contains('active')) {
        playRandomFilm(true);
    }
}

/* =========================================
   PHOTOS – SESSION NO‑REPEAT, 20 DESKTOP / 15 MOBILE
   ========================================= */
const photoData = {
    1: [
        "Edition1_48.JPG", "Edition1_64.JPG", "Edition1_70.jpg", "Edition1_66.JPG",
        "Edition1_73.jpg", "Edition1_28.jpg", "Edition1_14.jpg", "Edition1_15.jpg",
        "Edition1_17.jpg", "Edition1_2.jpg", "Edition1_12.jpg", "Edition1_7.jpg",
        "Edition1_6.jpg", "Edition1_13.jpg", "Edition1_11.jpg", "Edition1_4.jpg",
        "Edition1_5.jpg", "Edition1_38.jpg", "Edition1_10.jpg", "Edition1_21.jpg",
        "Edition1_34.JPG", "Edition1_20.jpg", "Edition1_36.JPG", "Edition1_22.jpg",
        "Edition1_23.jpg", "Edition1_37.JPG", "Edition1_33.jpg", "Edition1_27.JPG",
        "Edition1_26.jpg", "Edition1_32.JPG", "Edition1_24.jpg", "Edition1_18.jpg",
        "Edition1_31.JPG", "Edition1_25.jpg", "Edition1_42.JPG", "Edition1_43.JPG",
        "Edition1_55.JPG", "Edition1_41.JPG", "Edition1_40.JPG", "Edition1_50.JPG",
        "Edition1_44.JPG", "Edition1_51.JPG", "Edition1_53.JPG", "Edition1_52.JPG"
    ],
    2: [
        "Edition2_32.jpg", "Edition2_134.jpg", "Edition2_120.jpg", "Edition2_108.jpg",
        "Edition2_109.jpg", "Edition2_121.jpg", "Edition2_135.jpg", "Edition2_33.jpg",
        "Edition2_123.jpg", "Edition2_137.jpg", "Edition2_136.jpg", "Edition2_30.JPG",
        "Edition2_34.jpg", "Edition2_126.jpg", "Edition2_132.jpg", "Edition2_133.jpg",
        "Edition2_127.jpg", "Edition2_35.jpg", "Edition2_37.jpg", "Edition2_119.jpg",
        "Edition2_131.jpg", "Edition2_125.jpg", "Edition2_124.jpg", "Edition2_130.jpg",
        "Edition2_118.jpg", "Edition2_36.jpg", "Edition2_92.jpg", "Edition2_86.jpg",
        "Edition2_51.jpg", "Edition2_45.jpg", "Edition2_79.jpg", "Edition2_194.jpg",
        "Edition2_180.jpg", "Edition2_157.jpg", "Edition2_156.jpg", "Edition2_195.jpg",
        "Edition2_78.jpg", "Edition2_44.jpg", "Edition2_50.jpg", "Edition2_87.jpg",
        "Edition2_93.jpg", "Edition2_91.jpg", "Edition2_46.jpg", "Edition2_52.jpg",
        "Edition2_197.jpg", "Edition2_140.jpg", "Edition2_154.jpg", "Edition2_168.jpg",
        "Edition2_169.jpg", "Edition2_155.jpg", "Edition2_196.jpg", "Edition2_182.jpg",
        "Edition2_47.jpg", "Edition2_90.jpg", "Edition2_84.jpg", "Edition2_80.jpg",
        "Edition2_43.jpg", "Edition2_57.jpg", "Edition2_192.jpg", "Edition2_179.jpg",
        "Edition2_145.jpg", "Edition2_151.jpg", "Edition2_150.jpg", "Edition2_178.jpg",
        "Edition2_193.jpg", "Edition2_187.jpg", "Edition2_56.jpg", "Edition2_81.jpg",
        "Edition2_97.jpg", "Edition2_83.jpg", "Edition2_68.jpg", "Edition2_40.jpg",
        "Edition2_185.jpg", "Edition2_152.jpg", "Edition2_153.jpg", "Edition2_184.jpg",
        "Edition2_190.jpg", "Edition2_41.jpg", "Edition2_55.jpg", "Edition2_69.jpg",
        "Edition2_82.jpg", "Edition2_96.jpg", "Edition2_200.jpg", "Edition2_70.jpg",
        "Edition2_64.jpg", "Edition2_58.jpg", "Edition2_189.jpg", "Edition2_162.jpg",
        "Edition2_163.jpg", "Edition2_177.JPG", "Edition2_188.jpg", "Edition2_59.jpg",
        "Edition2_65.jpg", "Edition2_71.jpg", "Edition2_98.jpg", "Edition2_67.jpg",
        "Edition2_73.jpg", "Edition2_161.jpg", "Edition2_149.jpg", "Edition2_148.jpg",
        "Edition2_160.jpg", "Edition2_72.jpg", "Edition2_66.jpg", "Edition2_99.jpg",
        "Edition2_62.jpg", "Edition2_76.jpg", "Edition2_158.jpg", "Edition2_164.jpg",
        "Edition2_171.jpg", "Edition2_165.jpg", "Edition2_63.jpg", "Edition2_88.jpg",
        "Edition2_49.jpg", "Edition2_75.jpg", "Edition2_61.jpg", "Edition2_198.jpg",
        "Edition2_173.JPG", "Edition2_167.jpg", "Edition2_166.jpg", "Edition2_172.jpg",
        "Edition2_199.jpg", "Edition2_60.jpg", "Edition2_74.jpg", "Edition2_48.jpg",
        "Edition2_115.jpg", "Edition2_101.jpg", "Edition2_129.jpg", "Edition2_128.jpg",
        "Edition2_100.jpg", "Edition2_114.jpg", "Edition2_38.jpg", "Edition2_102.jpg",
        "Edition2_116.jpg", "Edition2_103.jpg", "Edition2_39.jpg", "Edition2_29.jpg",
        "Edition2_15.jpg", "Edition2_107.jpg", "Edition2_113.jpg", "Edition2_112.jpg",
        "Edition2_106.jpg", "Edition2_28.jpg", "Edition2_138.jpg", "Edition2_110.jpg",
        "Edition2_104.jpg", "Edition2_105.jpg", "Edition2_111.jpg", "Edition2_139.jpg"
    ],
    3: [
        "IMG_0275.jpg", "IMG_0261.jpg", "IMG_0260.jpg", "IMG_0274.jpg",
        "IMG_0276.jpg", "IMG_0277.jpg", "IMG_0272.jpg", "IMG_0270.jpg",
        "IMG_0265.jpg", "IMG_0268.jpg", "IMG_0269.jpg", "IMG_0279.jpg",
        "IMG_0278.jpg"
    ],
    4: [
        "edition4_53.jpg", "edition4_47.jpg", "edition4_46.jpg", "edition4_52.jpg",
        "edition4_7.JPG", "edition4_44.jpg", "edition4_50.jpg", "edition4_51.jpg",
        "edition4_45.jpg", "edition4_41.jpg", "edition4_55.jpg", "edition4_54.jpg",
        "edition4_1.JPG", "edition4_2.jpeg", "edition4_56.jpg", "edition4_43.jpg",
        "edition4_57.jpg", "edition4_30.jpg", "edition4_24.jpg", "edition4_18.jpg",
        "edition4_19.jpg", "edition4_25.jpg", "edition4_31.jpg", "edition4_27.jpg",
        "edition4_33.jpg", "edition4_32.jpg", "edition4_26.jpg", "edition4_22.jpg",
        "edition4_37.jpg", "edition4_23.jpg", "edition4_35.jpg", "edition4_21.jpg",
        "edition4_20.jpg", "edition4_34.jpg", "edition4_39.jpg", "edition4_38.jpg",
        "edition4_17.jpg", "edition4_16.jpg", "edition4_3.jpg", "edition4_28.jpg",
        "edition4_15.jpg", "edition4_9.JPG", "edition4_48.jpg", "edition4_49.jpg"
    ],
    5: [
        "edition5_13.jpg", "edition5_410.jpg", "edition5_362.jpg", "edition5_389.jpg",
        "edition5_388.jpg", "edition5_363.jpg", "edition5_411.jpg", "edition5_12.jpg",
        "edition5_38.jpg", "edition5_10.jpg", "edition5_375.jpg", "edition5_349.jpg",
        "edition5_348.jpg", "edition5_374.jpg", "edition5_412.jpg", "edition5_406.jpg",
        "edition5_11.jpg", "edition5_39.jpg", "edition5_358.jpg", "edition5_364.jpg",
        "edition5_370.jpg", "edition5_371.jpg", "edition5_365.jpg", "edition5_403.jpg",
        "edition5_28.jpg", "edition5_14.jpg", "edition5_373.jpg", "edition5_401.jpg",
        "edition5_367.jpg", "edition5_398.jpg", "edition5_399.jpg", "edition5_372.jpg",
        "edition5_261.jpg", "edition5_275.jpg", "edition5_249.jpg", "edition5_301.jpg",
        "edition5_329.jpg", "edition5_328.jpg", "edition5_300.jpg", "edition5_314.jpg",
        "edition5_65.JPG", "edition5_248.jpg", "edition5_260.jpg", "edition5_276.jpg",
        "edition5_262.jpg", "edition5_289.jpg", "edition5_67.JPG", "edition5_302.jpg",
        "edition5_316.jpg", "edition5_36_compressed_compressed.jpg", "edition5_303.jpg",
        "edition5_277.jpg", "edition5_7.jpg", "edition5_3.jpg", "edition5_273.jpg",
        "edition5_267.jpg", "edition5_298.jpg", "edition5_307.jpg", "edition5_313.jpg",
        "edition5_312.jpg", "edition5_306.jpg", "edition5_299.jpg", "edition5_266.jpg",
        "edition5_272.jpg", "edition5_2.jpg", "edition5_258.jpg", "edition5_270.jpg",
        "edition5_49.JPG", "edition5_310.jpg", "edition5_304.jpg", "edition5_305.jpg",
        "edition5_311.jpg", "edition5_339.jpg", "edition5_48.JPG", "edition5_271.jpg",
        "edition5_265.jpg", "edition5_259.jpg", "edition5_1.jpg", "edition5_254.jpg",
        "edition5_268.jpg", "edition5_283.jpg", "edition5_297.jpg", "edition5_45.JPG",
        "edition5_334.jpg", "edition5_308.jpg", "edition5_321.jpg", "edition5_50.JPG",
        "edition5_282.jpg", "edition5_269.jpg", "edition5_255.jpg", "edition5_241.JPG",
        "edition5_243.jpg", "edition5_280.jpg", "edition5_46.JPG", "edition5_323.jpg",
        "edition5_337.jpg", "edition5_336.jpg", "edition5_322.jpg", "edition5_47.JPG",
        "edition5_53.JPG", "edition5_295.jpg", "edition5_242.jpg", "edition5_256.jpg",
        "edition5_252.jpg", "edition5_246.jpg", "edition5_43.JPG", "edition5_291.jpg",
        "edition5_285.jpg", "edition5_326.jpg", "edition5_284.jpg", "edition5_42.JPG",
        "edition5_247.jpg", "edition5_253.jpg", "edition5_245.jpg", "edition5_251.jpg",
        "edition5_40.JPG", "edition5_54.JPG", "edition5_286.jpg", "edition5_68.JPG",
        "edition5_319.jpg", "edition5_331.jpg", "edition5_324.jpg", "edition5_330.jpg",
        "edition5_318.jpg", "edition5_55.JPG", "edition5_41.JPG", "edition5_250.jpg",
        "edition5_244.jpg", "edition5_278.jpg", "edition5_8.jpg", "edition5_357.jpg",
        "edition5_343.jpg", "edition5_394.jpg", "edition5_380.jpg", "edition5_381.jpg",
        "edition5_395.jpg", "edition5_31.jpg", "edition5_368.jpg", "edition5_383.jpg",
        "edition5_397.jpg", "edition5_396.jpg", "edition5_382.jpg", "edition5_369.jpg",
        "edition5_24.jpg", "edition5_30.jpg", "edition5_20.jpg", "edition5_379.jpg",
        "edition5_351.jpg", "edition5_393.jpg", "edition5_350.jpg", "edition5_378.jpg",
        "edition5_21.jpg", "edition5_23.jpg", "edition5_408.jpg", "edition5_346.jpg",
        "edition5_391.jpg", "edition5_384.jpg", "edition5_390.jpg", "edition5_353.jpg",
        "edition5_409.jpg", "edition5_22.jpg"
    ],
    6: [
        "IMG_3918 2.jpg", "IMG_3925 2.jpg", "IMG_3496.jpg", "IMG_3497.jpg",
        "IMG_3946 2.jpg", "IMG_3495.jpg", "IMG_3494.jpg", "IMG_3927 2.jpg",
        "IMG_3962 2.jpg", "IMG_4125 3_compressed_compressed.JPG", "IMG_3527.jpg",
        "IMG_3487.jpg", "IMG_3493 2.jpg", "IMG_3525.jpg", "Sand-nudes-11.jpg",
        "Sand-nudes-8.jpg", "Sand-nudes-39.jpg", "Sand-nudes-38.jpg", "Sand-nudes-9.jpg",
        "Sand-nudes-10.jpg", "Sand-nudes-12.jpg", "IMG_3919 2.jpg", "Sand-nudes-13.jpg",
        "IMG_3961 3.jpg", "IMG_4127 2.JPG", "IMG_3540.jpg", "IMG_3949.jpg",
        "IMG_3939 2.jpg", "Sand-nudes-17.jpg", "IMG_3492 2.jpg", "IMG_3948.jpg",
        "IMG_3958 2.jpg", "IMG_3535 2.jpg", "Sand-nudes-28.jpg", "IMG_3922 2.jpg",
        "Sand-nudes-14.jpg", "IMG_3943 2.jpg", "Sand-nudes-15.jpg", "Sand-nudes-29.jpg",
        "IMG_3511 2.jpg", "Sand-nudes-30.jpg", "Sand-nudes-24.jpg", "Sand-nudes-18.jpg",
        "Sand-nudes-19.jpg", "Sand-nudes-25.jpg", "Sand-nudes-31.jpg", "IMG_3947.jpg",
        "IMG_3951.jpg", "IMG_3945.jpg", "Sand-nudes-27.jpg", "Sand-nudes-33.jpg",
        "Sand-nudes-32.jpg", "Sand-nudes-3.jpg", "Sand-nudes-26.jpg", "IMG_3944.jpg",
        "IMG_3950.jpg", "IMG_3970 2.jpg", "IMG_3483 2.jpg", "IMG_3940.jpg",
        "Sand-nudes-22.jpg", "Sand-nudes-7.jpg", "IMG_3931 2.jpg", "Sand-nudes-36.jpg",
        "Sand-nudes-37.jpg", "Sand-nudes-6.jpg", "Sand-nudes-23.jpg", "IMG_3941.jpg",
        "IMG_3500 2.jpg", "Sand-nudes-35.jpg", "Sand-nudes-21.jpg", "Sand-nudes-4.jpg",
        "Sand-nudes-5.jpg", "Sand-nudes-20.jpg", "Sand-nudes-34.jpg", "IMG_3956.jpg",
        "IMG_3942.jpg", "IMG_3484 2.jpg", "IMG_3923.jpg", "Sand-nudes-41.jpg",
        "IMG_3498.jpg", "Sand-nudes-42.jpg", "IMG_3482 2.jpg", "Sand-nudes-43.jpg",
        "IMG_3921.jpg", "IMG_3504.jpg"
    ],
    7: [
        "edition7_313.jpg", "edition7_111.jpg", "edition7_105.jpg", "edition7_139.jpg",
        "edition7_16.jpg", "edition7_267.jpg", "edition7_104.jpg", "edition7_106.jpg",
        "edition7_15.jpg", "edition7_28.jpg", "edition7_329.jpg", "edition7_103.jpg",
        "edition7_38.jpg", "edition7_274.jpg", "edition7_248.jpg", "edition7_39.jpg",
        "edition7_11.jpg", "edition7_102.jpg", "edition7_328.jpg", "edition7_100.jpg",
        "edition7_101.jpg", "edition7_317.jpg", "edition7_7.jpg", "edition7_61.jpg",
        "edition7_238.jpg", "edition7_74.jpg", "edition7_6.jpg", "edition7_4.jpg",
        "edition7_171.jpg", "edition7_89.jpg", "edition7_76.jpg", "edition7_62.jpg",
        "edition7_207.jpg", "edition7_206.jpg", "edition7_212.jpg", "edition7_77.jpg",
        "edition7_88.jpg", "edition7_158.jpg", "edition7_164.jpg", "edition7_5.jpg",
        "edition7_1.jpg", "edition7_148.jpg", "edition7_98.jpg", "edition7_73.jpg",
        "edition7_67.jpg", "edition7_216.jpg", "edition7_203.jpg", "edition7_72.jpg",
        "edition7_99.jpg", "edition7_175.jpg", "edition7_163.jpg", "edition7_70.jpg",
        "edition7_58.jpg", "edition7_200.jpg", "edition7_71.jpg", "edition7_189.jpg",
        "edition7_3.jpg", "edition7_97.jpg", "edition7_68.jpg", "edition7_69.jpg",
        "edition7_96.jpg", "edition7_82.jpg", "edition7_146.jpg", "edition7_344.jpg",
        "edition7_8_compressed_compressed.jpg", "edition7_144.jpg", "edition7_150.jpg",
        "edition7_94.jpg", "edition7_226.jpg", "edition7_81.jpg", "edition7_95.jpg",
        "edition7_353.jpg", "edition7_141.jpg", "edition7_91.jpg", "edition7_84.jpg",
        "edition7_154.jpg", "edition7_197.jpg", "edition7_9.jpg", "edition7_181.jpg",
        "edition7_92.jpg", "edition7_45.jpg", "edition7_79.jpg", "edition7_234.jpg",
        "edition7_78.jpg", "edition7_50.jpg", "edition7_93.jpg", "edition7_180.jpg",
        "edition7_130.jpg", "edition7_118.jpg", "edition7_23.jpg", "edition7_37.jpg",
        "edition7_247.jpg", "edition7_36.jpg", "edition7_133.jpg", "edition7_34.jpg",
        "edition7_20.jpg", "edition7_245.jpg", "edition7_35.jpg", "edition7_334.jpg",
        "edition7_31.jpg", "edition7_254.jpg", "edition7_269.jpg", "edition7_18.jpg",
        "edition7_109.jpg", "edition7_135.jpg", "edition7_33.jpg", "edition7_120.jpg",
        "edition7_108.jpg"
    ]
};


const editionNumbers = Object.keys(photoData).map(Number);

function initPhotosSection() {
    const grid = document.getElementById("archive-grid");
    const shuffleBtn = document.getElementById("btn-shuffle-photos");
    const shuffleBtnMobile = document.getElementById("btn-shuffle-photos-mobile");
    const lightbox = document.getElementById("lightbox");
    const lightboxContent = document.getElementById("lightbox-content");
    const lightboxClose = document.getElementById("lightbox-close");

    function buildFlatPhotoList() {
        const flatList = [];
        for (const edition of editionNumbers) {
            const imageList = photoData[edition];
            if (!imageList) continue;
            for (const filename of imageList) {
                flatList.push({ edition, filename });
            }
        }
        return flatList;
    }

    let flatPhotoList = buildFlatPhotoList();
    let shownPhotoSet = new Set();

    function getItemsPerLoad() {
        return window.innerWidth > 768 ? 20 : 15;
    }

    function generateCuratedPull() {
        shuffleBtn.classList.add("clicked");
        if (shuffleBtnMobile) shuffleBtnMobile.classList.add("clicked");
        setTimeout(() => {
            shuffleBtn.classList.remove("clicked");
            if (shuffleBtnMobile) shuffleBtnMobile.classList.remove("clicked");
        }, 200);

        const totalItems = getItemsPerLoad();
        const unseen = flatPhotoList.filter(item => !shownPhotoSet.has(`${item.edition}_${item.filename}`));
        let selected;
        if (unseen.length < totalItems) {
            shownPhotoSet.clear();
            selected = [...flatPhotoList];
        } else {
            selected = [...unseen];
        }

        // Shuffle
        for (let i = selected.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selected[i], selected[j]] = [selected[j], selected[i]];
        }
        selected = selected.slice(0, totalItems);

        grid.innerHTML = "";

        selected.forEach((item) => {
            const { edition, filename } = item;
            shownPhotoSet.add(`${edition}_${filename}`);
            const imgPath = `assets/Photos/edition_${edition}/${filename}`;

            const div = document.createElement("div");
            div.className = `archive-item`;

            const img = document.createElement("img");
            img.src = imgPath;
            img.alt = `Edition ${edition}`;
            img.loading = "lazy";
            img.decoding = "async";

            img.onload = function() {
                const aspect = this.naturalWidth / this.naturalHeight;
                div.style.aspectRatio = aspect;
            };

            const caption = document.createElement("div");
            caption.className = "mobile-caption";
            caption.textContent = `EDITION ${edition}`;

            div.appendChild(img);
            div.appendChild(caption);

            div.addEventListener("click", () => {
                const fullImg = new Image();
                fullImg.onload = function() {
                    const aspect = fullImg.naturalWidth / fullImg.naturalHeight;
                    lightboxContent.style.aspectRatio = aspect;
                    lightboxContent.innerHTML = `<img src="${imgPath}" alt="Edition ${edition}">`;
                    lightbox.classList.remove("lightbox-hidden");
                };
                fullImg.src = imgPath;
                fullImg.onerror = function() {
                    lightboxContent.style.aspectRatio = 'auto';
                    lightboxContent.innerHTML = `<div style="padding:40px; text-align:center;">⚠️ Image not found</div>`;
                    lightbox.classList.remove("lightbox-hidden");
                };
            });

            grid.appendChild(div);
        });

        grid.scrollTop = 0;
    }

    function handleShuffle() {
        generateCuratedPull();
        const gridEl = document.getElementById("archive-grid");
        if (gridEl) gridEl.scrollTop = 0;
    }

    // Lightbox close handlers
    lightboxClose.addEventListener("click", (e) => {
        e.stopPropagation();
        lightbox.classList.add("lightbox-hidden");
    });
    lightboxClose.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            lightbox.classList.add("lightbox-hidden");
        }
    });
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add("lightbox-hidden");
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !lightbox.classList.contains("lightbox-hidden")) {
            lightbox.classList.add("lightbox-hidden");
        }
    });

    shuffleBtn.addEventListener("click", handleShuffle);
    if (shuffleBtnMobile) {
        shuffleBtnMobile.addEventListener("click", handleShuffle);
    }
    generateCuratedPull();
}

/* =========================================
   CREDITS – CENTRED, NO SPECIAL COLOR, FAST RESET
   ========================================= */
function initCreditsSection() {
    const track = document.getElementById("credits-marquee-track");
    const container = document.getElementById("credits-marquee-container");
    
    const credits = [
        "Adam Centko",
        "Laimonas Zakas",
        "Carmen Roca Igual",
        "Kin Mun",
        "Ivan Cuic",
        "Povilas Cepulis",
        "Ruben Verkuylen",
        "Sandipan Nath",
        "Matteo Pellegrini",
        "Vanya Tretyakov",
        "Younes Laaguidi",
        "Andre Miranda",
        "Marlot Meyer",
        "Ari Snow",
        "Milutin Markovic",
        "WYSIWYG Cinema",
        "All who made a movie ❤️",
        "The best audience",
        "Inspired by Some Shit Film Festival",
        "Kudos to QWERT Film Fest"
    ];

    let compilePool = [];
    for (let i = 0; i < 4; i++) {
        credits.forEach(name => {
            compilePool.push({ name });
        });
    }

    compilePool.forEach(person => {
        const item = document.createElement("div");
        item.classList.add("credit-name");
        item.innerText = person.name;
        track.appendChild(item);
    });

    let currentY = 0;
    let baseSpeed = 0.9;
    let currentSpeed = baseSpeed;
    let isInterrupted = false;

    function scrollTicker() {
        if (!isInterrupted) {
            currentY -= currentSpeed;
            const halfHeight = track.scrollHeight / 2;
            if (Math.abs(currentY) >= halfHeight) {
                currentY = 0;
            }
            track.style.transform = `translateY(${currentY}px)`;
            if (currentSpeed > baseSpeed) currentSpeed -= 0.04;
            if (currentSpeed < baseSpeed) currentSpeed = baseSpeed;
        }
        requestAnimationFrame(scrollTicker);
    }

    function resetCredits() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const containerHeight = container.clientHeight;
                if (containerHeight > 0) {
                    currentY = containerHeight;
                    currentSpeed = 5;
                    track.style.transform = `translateY(${currentY}px)`;
                }
            });
        });
    }

    // Initial reset
    resetCredits();

    container.addEventListener("wheel", (e) => {
        e.preventDefault();
        currentSpeed = Math.min(Math.abs(e.deltaY) * 0.25, 9);
        currentY += (e.deltaY > 0 ? -currentSpeed : currentSpeed);
    }, { passive: false });

    track.querySelectorAll(".credit-name").forEach(element => {
        const stopInterruption = () => {
            isInterrupted = false;
            element.classList.remove("vibrate-active");
        };

        element.addEventListener("mousedown", (e) => {
            e.preventDefault();
            isInterrupted = true;
            element.classList.add("vibrate-active");
        });

        element.addEventListener("mouseup", stopInterruption);
        element.addEventListener("mouseleave", stopInterruption);

        element.addEventListener("touchstart", (e) => {
            isInterrupted = true;
            element.classList.add("vibrate-active");
        });
        element.addEventListener("touchend", stopInterruption);
    });

    scrollTicker();
    return resetCredits;
}

/* =========================================
   EASTER EGGS
   ========================================= */
function initEasterEggs() {
    const appWrapper = document.getElementById("app-wrapper");
    let deadClickCount = 0;
    let clickResetTimer;

    window.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" || e.target.closest(".archive-item") || e.target.closest(".credit-name") || e.target.closest("#bottom-nav")) {
            return;
        }
        deadClickCount++;
        clearTimeout(clickResetTimer);
        clickResetTimer = setTimeout(() => { deadClickCount = 0; }, 1500);
        if (deadClickCount >= 4) {
            deadClickCount = 0;
            appWrapper.classList.add("jolt-active");
            setTimeout(() => appWrapper.classList.remove("jolt-active"), 250);
        }
    });

    const scrambleElements = document.querySelectorAll(".scramble-word:not(.glitch-word)");
    const matrixChars = "XX//砂ヌード映画XX01100@#%&*+=-";

    scrambleElements.forEach(el => {
        const originalText = el.innerText;
        let scrambleInterval;

        el.addEventListener("mouseenter", () => {
            let iterations = 0;
            clearInterval(scrambleInterval);
            scrambleInterval = setInterval(() => {
                el.innerText = originalText.split("").map((char, index) => {
                    if (index < iterations) return originalText[index];
                    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
                }).join("");
                iterations += 1 / 3;
                if (iterations >= originalText.length) {
                    clearInterval(scrambleInterval);
                    el.innerText = originalText;
                }
            }, 30);
        });
    });

    const glitchElements = document.querySelectorAll(".glitch-word");
    glitchElements.forEach(el => {
        const wordList = JSON.parse(el.getAttribute('data-words'));
        let currentIndex = 0;
        let glitchInterval;

        el.addEventListener("mouseenter", () => {
            currentIndex = (currentIndex + 1) % wordList.length;
            const targetWord = wordList[currentIndex];
            let iterations = 0;
            const maxIterations = 12;
            clearInterval(glitchInterval);
            glitchInterval = setInterval(() => {
                let result = "";
                for (let i = 0; i < targetWord.length; i++) {
                    if (Math.random() < (iterations / maxIterations) * 1.2) {
                        result += targetWord[i] || targetWord[targetWord.length - 1];
                    } else {
                        result += matrixChars[Math.floor(Math.random() * matrixChars.length)];
                    }
                }
                el.innerText = result;
                iterations++;
                if (iterations >= maxIterations) {
                    clearInterval(glitchInterval);
                    el.innerText = targetWord;
                }
            }, 50);
        });
    });
}

/* =========================================
   GOOFY EASTER EGGS
   ========================================= */
function initGoofyEggs() {
    let clickCount = 0;
    const hotdog = document.getElementById('hotdog-egg');
    const logo = document.getElementById('logo-container');
    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                hotdog.classList.add('visible');
                setTimeout(() => {
                    hotdog.classList.remove('visible');
                }, 3000);
                clickCount = 0;
            }
        });
    }

    console.log('%c🌭 SAND NUDES FILM FESTIVAL 🌭', 'font-size:24px; color:#ff0000; font-weight:bold;');
    console.log('%c🌱 you found the hidden vegan hotdog! 🌱', 'font-size:16px; color:#00aa00; font-weight:bold;');
    console.log('%c🍕 🍔 🌭 🍟 🍿', 'font-size:30px;');

    document.addEventListener('dblclick', (e) => {
        if (e.target.tagName === 'H1') {
            const original = e.target.textContent;
            let replacement = null;
            switch (original) {
                case 'FILMS': replacement = 'M0vieS'; break;
                case 'PHOTOS': replacement = 'P1cS'; break;
                case 'CREDITS': replacement = 'BiG UpS'; break;
                case 'ABOUT': replacement = 'TLDR'; break;
            }
            if (replacement) {
                e.target.textContent = replacement;
                e.target.style.color = '#ff0000';
                setTimeout(() => {
                    e.target.textContent = original;
                    e.target.style.color = '';
                }, 2000);
            }
        }
    });
}