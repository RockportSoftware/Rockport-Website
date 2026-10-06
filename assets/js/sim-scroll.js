// Scroll-triggered video playback for the long-scroll Airport Simulation
// variant. Kept as an external file (rather than inline) so it satisfies
// the site's CSP script-src 'self' directive.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mediaBlocks = document.querySelectorAll('.sim-media');

  // Panels with data-youtube are handed over to sim-youtube.js on click.
  // This script still drives their scroll preview, but must stop once the
  // YouTube player has replaced the preview.
  function play(wrap, video) {
    if (wrap.classList.contains('is-youtube')) return;
    wrap.classList.add('is-playing');
    if (!wrap.hasAttribute('data-youtube')) wrap.setAttribute('aria-pressed', 'true');
    video.play().catch(function () { /* autoplay was blocked, poster stays visible */ });
  }
  function stop(wrap, video) {
    if (wrap.classList.contains('is-youtube')) return;
    wrap.classList.remove('is-playing');
    if (!wrap.hasAttribute('data-youtube')) wrap.setAttribute('aria-pressed', 'false');
    video.pause();
    // load() unloads the element, which restores the poster image - resetting
    // currentTime alone leaves the last rendered frame on screen instead.
    video.load();
  }

  mediaBlocks.forEach(function (wrap) {
    var video = wrap.querySelector('video');
    if (!video) return;

    // data-youtube panels get their button role and click handling from
    // sim-youtube.js instead.
    if (wrap.hasAttribute('data-youtube')) return;

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
  //
  // A panel counts as active only while it overlaps a narrow band near the
  // top of the window. TRIGGER_TOP and TRIGGER_BOTTOM are the band edges as a
  // percentage of window height, measured from the top. Raise TRIGGER_BOTTOM
  // to start playback sooner, lower it to start later. TRIGGER_TOP keeps the
  // band clear of the fixed nav bar.
  var TRIGGER_TOP = 10;
  var TRIGGER_BOTTOM = 30;

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
    }, {
      // Shrinks the observed area to the band between TRIGGER_TOP and
      // TRIGGER_BOTTOM. A panel is intersecting while any part of it is
      // inside that band.
      rootMargin: '-' + TRIGGER_TOP + '% 0px -' + (100 - TRIGGER_BOTTOM) + '% 0px',
      threshold: 0
    });

    mediaBlocks.forEach(function (wrap) { observer.observe(wrap); });
  }
})();
