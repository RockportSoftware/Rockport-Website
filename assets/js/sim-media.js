// Hover-to-play video previews used on the Airport Simulation page.
// Kept as an external file (rather than inline) so it satisfies the
// site's CSP script-src 'self' directive.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverCapable = window.matchMedia('(hover: hover)').matches;

  document.querySelectorAll('.sim-media').forEach(function (wrap) {
    var video = wrap.querySelector('video');
    if (!video) return;

    function play() {
      wrap.classList.add('is-playing');
      wrap.setAttribute('aria-pressed', 'true');
      video.play().catch(function () { /* autoplay was blocked, poster stays visible */ });
    }
    function stop() {
      wrap.classList.remove('is-playing');
      wrap.setAttribute('aria-pressed', 'false');
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

    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-pressed', 'false');

    // Hover-to-play on devices that support real hover, unless the user has
    // asked for reduced motion - then playback only happens on deliberate
    // click/tap/keyboard activation.
    if (hoverCapable && !reduceMotion) {
      wrap.addEventListener('mouseenter', play);
      wrap.addEventListener('mouseleave', stop);
    }

    // Tap (touch devices) and keyboard always work, regardless of the above.
    wrap.addEventListener('click', toggle);
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();
