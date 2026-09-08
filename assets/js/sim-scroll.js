// Scroll-triggered video playback for the long-scroll Airport Simulation
// variant. Kept as an external file (rather than inline) so it satisfies
// the site's CSP script-src 'self' directive.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mediaBlocks = document.querySelectorAll('.sim-media');

  function play(wrap, video) {
    wrap.classList.add('is-playing');
    wrap.setAttribute('aria-pressed', 'true');
    video.play().catch(function () { /* autoplay was blocked, poster stays visible */ });
  }
  function stop(wrap, video) {
    wrap.classList.remove('is-playing');
    wrap.setAttribute('aria-pressed', 'false');
    video.pause();
    // load() unloads the element, which restores the poster image - resetting
    // currentTime alone leaves the last rendered frame on screen instead.
    video.load();
  }

  mediaBlocks.forEach(function (wrap) {
    var video = wrap.querySelector('video');
    if (!video) return;

    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-pressed', 'false');

    // Manual click/keyboard control is always available, on top of whatever
    // the scroll observer below is doing - useful for reduced-motion users,
    // and for anyone who wants to replay a block without scrolling away
    // and back.
    function toggle() {
      if (wrap.classList.contains('is-playing')) { stop(wrap, video); } else { play(wrap, video); }
    }
    wrap.addEventListener('click', toggle);
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Scroll-triggered autoplay. Skipped entirely for reduced-motion users -
  // they still get the manual click/keyboard control above.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var wrap = entry.target;
        var video = wrap.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting) {
          play(wrap, video);
        } else {
          stop(wrap, video);
        }
      });
    }, { threshold: 0.5 });

    mediaBlocks.forEach(function (wrap) { observer.observe(wrap); });
  }
})();
