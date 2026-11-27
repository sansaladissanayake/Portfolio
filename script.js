const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.desktop-nav');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !isOpen);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
}));

const filterButtons = document.querySelectorAll('.filter-button');
const projects = document.querySelectorAll('.project[data-category]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const selectedFilter = button.dataset.filter;
  filterButtons.forEach(filter => {
    const isSelected = filter === button;
    filter.classList.toggle('active', isSelected);
    filter.setAttribute('aria-pressed', String(isSelected));
  });
  projects.forEach(project => {
    const shouldShow = selectedFilter === 'all' || project.dataset.category === selectedFilter;
    project.classList.toggle('filtered-out', !shouldShow);
  });
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cursorGlow = document.querySelector('.cursor-glow');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer && !reducedMotion && cursorGlow) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorGlow.classList.add('visible');
  }, { passive: true });
  const easeCursor = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    document.documentElement.style.setProperty('--pointer-x', `${currentX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${currentY}px`);
    requestAnimationFrame(easeCursor);
  };
  requestAnimationFrame(easeCursor);
  document.querySelectorAll('a, button').forEach(item => {
    item.addEventListener('pointerenter', () => cursorGlow.classList.add('hovering'));
    item.addEventListener('pointerleave', () => cursorGlow.classList.remove('hovering'));
  });
  document.addEventListener('pointerleave', () => cursorGlow.classList.remove('visible'));
}

if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealItems = document.querySelectorAll('.intro-content, .section-heading, .project, .all-work, .services-head, .service-list article, .tool-row, .contact-card, .profile-grid, .profile-detail, .profile-contact');
  revealItems.forEach(item => item.classList.add('reveal'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
}
