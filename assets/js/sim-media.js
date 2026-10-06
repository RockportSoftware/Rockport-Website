// Hover-to-play video previews used on the Airport Simulation page.
// Kept as an external file (rather than inline) so it satisfies the
// site's CSP script-src 'self' directive.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverCapable = window.matchMedia('(hover: hover)').matches;

  document.querySelectorAll('.sim-media').forEach(function (wrap) {
    var video = wrap.querySelector('video');
    if (!video) return;

    // Panels with data-youtube are handed over to sim-youtube.js on click.
    // This script still drives their hover preview, but must stop once the
    // YouTube player has replaced the preview.
    var isYouTube = wrap.hasAttribute('data-youtube');

    function play() {
      if (wrap.classList.contains('is-youtube')) return;
      wrap.classList.add('is-playing');
      if (!isYouTube) wrap.setAttribute('aria-pressed', 'true');
      video.play().catch(function () { /* autoplay was blocked, poster stays visible */ });
    }
    function stop() {
      if (wrap.classList.contains('is-youtube')) return;
      wrap.classList.remove('is-playing');
      if (!isYouTube) wrap.setAttribute('aria-pressed', 'false');
      video.pause();
      // Resetting currentTime alone does not bring the poster back once a
      // video has rendered a frame - the browser keeps showing that frame.
      // Calling load() unloads the element (cheap here, since preload="none"
      // means nothing was buffered ahead of time anyway) which restores the
      // poster image ready for next time.
      video.load();
    }
    function toggle() {
      if (wrap.classList.contains('is-playing')) { stop(); } else { play(); }
    }

    if (!isYouTube) {
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('aria-pressed', 'false');
    }

    // Hover-to-play on devices that support real hover, unless the user has
    // asked for reduced motion - then playback only happens on deliberate
    // click/tap/keyboard activation.
    if (hoverCapable && !reduceMotion) {
      wrap.addEventListener('mouseenter', play);
      wrap.addEventListener('mouseleave', stop);
    }

    // Tap (touch devices) and keyboard always work, regardless of the above.
    // Not for data-youtube panels, where click opens the full video instead.
    if (!isYouTube) {
      wrap.addEventListener('click', toggle);
      wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    }
  });
})();
