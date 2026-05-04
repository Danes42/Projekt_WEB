(function () {
  var lang = localStorage.getItem('lang') || 'cs';

  function apply(l) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.dataset.cs) el.dataset.cs = el.textContent.trim();
      el.textContent = l === 'en' ? el.dataset.en : el.dataset.cs;
    });
    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = l === 'en' ? 'CZ' : 'EN';
    document.documentElement.lang = l;
    localStorage.setItem('lang', l);
    lang = l;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.dataset.cs = el.textContent.trim();
    });
    apply(lang);

    var btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        apply(lang === 'cs' ? 'en' : 'cs');
      });
    }
  });
})();
