// "Watch full video" behaviour for preview panels that carry a data-youtube
// attribute on the Airport Simulation pages. Clicking (or pressing Enter or
// Space on) the panel swaps the muted preview for the site's standard
// lite-youtube embed, which then plays the full YouTube video in place.
//
// Kept as an external file (rather than inline) so it satisfies the site's
// CSP script-src 'self' directive. Used by both airportsimulation.html and
// airportsimulation-scroll.html, alongside sim-media.js or sim-scroll.js.
(function () {
  document.querySelectorAll('.sim-media[data-youtube]').forEach(function (wrap) {
    var videoId = wrap.getAttribute('data-youtube');
    var label = wrap.getAttribute('data-youtube-label') || 'Play full video';
    var preview = wrap.querySelector('video');

    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'button');

    function open() {
      if (wrap.classList.contains('is-youtube')) return;

      var player = document.createElement('lite-youtube');
      player.setAttribute('videoid', videoId);
      player.setAttribute('playlabel', label);
      player.setAttribute('params', 'origin=' + encodeURIComponent(window.location.origin));

      // If the lite-youtube script has not loaded, fall back to opening the
      // video on YouTube in a new tab.
      if (!window.customElements || !window.customElements.get('lite-youtube')) {
        window.open('https://www.youtube.com/watch?v=' + encodeURIComponent(videoId),
                    '_blank', 'noopener,noreferrer');
        return;
      }

      wrap.classList.add('is-youtube');
      wrap.classList.remove('is-playing');
      if (preview) preview.pause();

      wrap.appendChild(player);

      // lite-youtube switches to the YouTube iframe API on Safari and mobile
      // browsers. That API script is not allowed by this site's CSP
      // (script-src), so force the plain iframe path instead. On those
      // browsers the visitor may need to tap YouTube's own play button once.
      player.needsYTApi = false;
      player.activate();

      // The panel is no longer a button once the player is in place.
      wrap.removeAttribute('role');
      wrap.removeAttribute('tabindex');
      wrap.removeAttribute('aria-label');
    }

    wrap.addEventListener('click', open);
    wrap.addEventListener('keydown', function (e) {
      if (e.target !== wrap) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
})();
