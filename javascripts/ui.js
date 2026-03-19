// Set footer year
const footerYear = document.getElementById('footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// Scroll-reveal: fade-in elements as they enter the viewport
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: make all visible immediately
    revealEls.forEach(function(el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function(el) { observer.observe(el); });
})();

// Nav active-section highlight via IntersectionObserver
(function initNavHighlight() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  const sectionIds = Array.from(navLinks).map(function(a) {
    return a.getAttribute('href').slice(1);
  });

  const sections = sectionIds.map(function(id) {
    return document.getElementById(id);
  }).filter(Boolean);

  if (!sections.length) return;

  function setActive(id) {
    navLinks.forEach(function(a) {
      if (a.getAttribute('href') === '#' + id) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  if (!('IntersectionObserver' in window)) {
    if (sections[0]) setActive(sections[0].id);
    return;
  }

  // Track which sections are visible and pick the topmost one
  const visible = new Set();

  const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        visible.add(entry.target.id);
      } else {
        visible.delete(entry.target.id);
      }
    });

    // Find the first section (in DOM order) that is visible
    const activeId = sectionIds.find(function(id) { return visible.has(id); });
    if (activeId) setActive(activeId);
  }, { threshold: 0.2 });

  sections.forEach(function(section) { sectionObserver.observe(section); });
})();
