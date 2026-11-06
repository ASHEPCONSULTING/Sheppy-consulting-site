const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const problemItems = [...document.querySelectorAll('.problem-list details')];
problemItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    problemItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const systemMap = document.querySelector('[data-system-map]');

if (systemMap) {
  const nodes = [...systemMap.querySelectorAll('[data-node]')];
  const connectors = [...systemMap.querySelectorAll('[data-connector]')];
  const detailTitle = document.querySelector('[data-system-title]');
  const detailCopy = document.querySelector('[data-system-copy]');
  const centrePrefix = systemMap.querySelector('[data-centre-prefix]');
  const centreTitle = systemMap.querySelector('[data-centre-title]');
  let lockedNode = null;

  const systemContent = {
    people: {
      title: 'Clear ownership',
      copy: 'Clear roles, useful information and systems that people can understand, trust and adopt.',
      prefix: '',
      centre: 'Ownership'
    },
    process: {
      title: 'Less friction',
      copy: 'Practical workflows, handovers and decisions that reflect how delivery really happens.',
      prefix: '',
      centre: 'Flow'
    },
    data: {
      title: 'Reliable insight',
      copy: 'Consistent definitions and reporting that give teams one shared view of performance.',
      prefix: '',
      centre: 'Insight'
    },
    technology: {
      title: 'Useful tools',
      copy: 'CRM and operational technology configured around the work, rather than forcing work around the software.',
      prefix: '',
      centre: 'Tools'
    }
  };

  const defaultContent = {
    title: 'Better delivery',
    copy: 'The strongest changes connect people, process, data and technology rather than treating one in isolation.',
    prefix: '',
    centre: 'Delivery'
  };

  const renderSystem = (key) => {
    const content = key ? systemContent[key] : defaultContent;
    systemMap.classList.toggle('has-active', Boolean(key));
    systemMap.dataset.active = key || '';
    detailTitle.textContent = content.title;
    detailCopy.textContent = content.copy;
    centrePrefix.textContent = content.prefix;
    centreTitle.textContent = content.centre;

    nodes.forEach((node) => {
      const isActive = node.dataset.node === key;
      node.classList.toggle('is-active', isActive);
      node.classList.toggle('is-muted', Boolean(key) && !isActive);
      node.setAttribute('aria-pressed', String(lockedNode === node.dataset.node));
    });

    connectors.forEach((connector) => {
      connector.classList.toggle('is-active', connector.dataset.connector === key);
    });
  };

  nodes.forEach((node) => {
    const key = node.dataset.node;
    node.addEventListener('mouseenter', () => renderSystem(key));
    node.addEventListener('focus', () => renderSystem(key));
    node.addEventListener('mouseleave', () => renderSystem(lockedNode));
    node.addEventListener('blur', () => renderSystem(lockedNode));
    node.addEventListener('click', () => {
      lockedNode = lockedNode === key ? null : key;
      renderSystem(lockedNode);
    });
  });

  systemMap.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      lockedNode = null;
      renderSystem(null);
    }
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((element) => element.classList.add('visible'));
} else {
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );
  revealItems.forEach((element) => observer.observe(element));
}

const testimonials = document.querySelector('[data-testimonials]');

if (testimonials) {
  testimonials.classList.add('carousel-ready');
  const track = testimonials.querySelector('[data-track]');
  const slides = [...testimonials.querySelectorAll('[data-slide]')];
  const previous = testimonials.querySelector('[data-previous]');
  const next = testimonials.querySelector('[data-next]');
  const current = testimonials.querySelector('[data-current]');
  const total = testimonials.querySelector('[data-total]');
  let activeIndex = 0;
  let visibleSlides = 1;

  const formatNumber = (number) => String(number).padStart(2, '0');

  const showSlide = (index) => {
    visibleSlides = window.matchMedia('(min-width: 851px)').matches ? 2 : 1;
    const maximumIndex = Math.max(0, slides.length - visibleSlides);
    activeIndex = maximumIndex === 0 ? 0 : (index + maximumIndex + 1) % (maximumIndex + 1);
    const firstSlideOffset = slides[0]?.offsetLeft || 0;
    const offset = (slides[activeIndex]?.offsetLeft || 0) - firstSlideOffset;
    track.style.transform = `translateX(-${offset}px)`;
    current.textContent = visibleSlides > 1
      ? `${formatNumber(activeIndex + 1)}–${formatNumber(Math.min(slides.length, activeIndex + visibleSlides))}`
      : formatNumber(activeIndex + 1);
    testimonials.classList.toggle('cards-static', maximumIndex === 0);
    slides.forEach((slide, slideIndex) => {
      const isVisible = slideIndex >= activeIndex && slideIndex < activeIndex + visibleSlides;
      slide.setAttribute('aria-hidden', String(!isVisible));
      slide.inert = !isVisible;
    });
  };

  total.textContent = formatNumber(slides.length);
  previous?.addEventListener('click', () => showSlide(activeIndex - 1));
  next?.addEventListener('click', () => showSlide(activeIndex + 1));
  window.addEventListener('resize', () => showSlide(activeIndex));
  showSlide(0);
}
