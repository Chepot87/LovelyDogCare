/* eslint-env browser */
(function () {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(initCarousel);

  function initCarousel(root) {
    const track = root.querySelector('.track');
    if (!track) return;

    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const dots = Array.from(root.querySelectorAll('.dot'));
    const autoplay = root.dataset.autoplay === 'true';
    const interval = parseInt(root.dataset.interval || '5000', 10);

    let index = 0;
    let timer = null;
    let isPointerDown = false;
    let startX = 0;
    let currentX = 0;

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, n) => s.classList.toggle('current', n === index));
      dots.forEach((d, n) => {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }
    function nextSlide() { go(index + 1); }
    function prevSlide() { go(index - 1); }

    // Controles
    if (next) next.addEventListener('click', nextSlide);
    if (prev) prev.addEventListener('click', prevSlide);
    dots.forEach((d, n) => d.addEventListener('click', () => go(n)));

    // Autoplay
    function startAuto() { if (autoplay) { stopAuto(); timer = setInterval(nextSlide, interval); } }
    function stopAuto() { if (timer) clearInterval(timer); }
    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);
    document.addEventListener('visibilitychange', () => (document.hidden ? stopAuto() : startAuto()));
    startAuto();

    // Swipe (móvil)
    track.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      startX = e.clientX;
      currentX = startX;
      track.style.transition = 'none';
      stopAuto();
    });
    window.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      currentX = e.clientX;
      const dx = currentX - startX;
      track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
    });
    window.addEventListener('pointerup', () => {
      if (!isPointerDown) return;
      const dx = currentX - startX;
      track.style.transition = '';
      isPointerDown = false;
      if (Math.abs(dx) > 60) { dx < 0 ? nextSlide() : prevSlide(); }
      else { go(index); }
      startAuto();
    });

    // Accesibilidad con teclado
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Iniciar en 0
    go(0);
  }
})();





