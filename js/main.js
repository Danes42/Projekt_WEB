(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  if (toggle && nav) {
    // Přidat zavírací tlačítko do fullscreen nav
    var closeBtn = document.createElement('button');
    closeBtn.className = 'nav-close';
    closeBtn.setAttribute('aria-label', 'Zavřít menu');
    nav.insertBefore(closeBtn, nav.firstChild);

    function closeNav() {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    closeBtn.addEventListener('click', closeNav);
  }

  // Přepínání mezi dvěma variantami 2. obrázku na úvodní stránce
  var banner2Toggle = document.getElementById('banner2Toggle');
  var banner2Img = document.getElementById('heroBanner2');

  if (banner2Toggle && banner2Img) {
    var originalSrc = banner2Img.getAttribute('src');
    var altSrc = 'images/aktulni/uvodni pokus 2.jpg';
    var showingAlt = false;

    banner2Toggle.addEventListener('click', function () {
      showingAlt = !showingAlt;
      banner2Img.src = showingAlt ? altSrc : originalSrc;
      banner2Toggle.textContent = showingAlt
        ? '← Zobrazit původní 2. obrázek'
        : 'Zobrazit alternativu 2. obrázku →';
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }
})();
