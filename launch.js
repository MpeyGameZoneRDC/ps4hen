/* MPEY PS4 GoldHEN Loader - Goma, RDC */
/* Based on mansoor0x AppCache loader - modified for MPEY interface */
(function () {
    var cache = window.applicationCache;
    var status = document.getElementById("status");
    var launched = false;
    var progress = document.getElementById("progFill");

    function show(text) {
        if (status) status.textContent = text;
    }

    function setP(p) {
        if (progress) progress.style.width = p + '%';
    }

    function start() {
        if (launched) return;
        launched = true;
        show("Cache prêt !");
        setP(90);

        setTimeout(function () {
            // Si index.html a défini onCacheReady → activer le bouton
            if (typeof window.onCacheReady === 'function') {
                window.onCacheReady();
            } else {
                // Fallback : redirection automatique
                location.replace(
                    "exploit.html?log=1&afterglow=run&mode=goldhen"
                );
            }
        }, 500);
    }

    if (!cache) {
        show("Cache non supporté — essayez de recharger.");
        return;
    }

    cache.addEventListener("checking", function () {
        show("Vérification du cache…");
        setP(10);
    });

    cache.addEventListener("downloading", function () {
        show("Téléchargement des fichiers sur cette PS4…");
        setP(20);
    });

    cache.addEventListener("progress", function (e) {
        if (e.total > 0) {
            var pct = Math.round((e.loaded / e.total) * 70) + 20;
            setP(pct);
        }
        show("Sauvegarde : " + e.loaded + " / " + (e.total || '?') + " fichiers");
    });

    cache.addEventListener("cached", start);
    cache.addEventListener("noupdate", start);

    cache.addEventListener("updateready", function () {
        try { cache.swapCache(); } catch (e) {}
        start();
    });

    cache.addEventListener("error", function () {
        show("Erreur cache — vérifiez les fichiers et rechargez.");
    });

    try {
        if (cache.status === cache.IDLE) {
            start();
        } else if (cache.status === cache.UPDATEREADY) {
            cache.swapCache();
            start();
        } else if (cache.status === cache.UNCACHED) {
            show("Démarrage du téléchargement cache…");
            setP(5);
            cache.update();
        } else {
            show("Attente du cache…");
        }
    } catch (e) {
        show("Initialisation du cache échouée.");
    }
})();
