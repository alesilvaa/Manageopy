import './style.css'

const BRAND_DISPLAY_NAMES = {
  Lafa: 'Lafa',
  'lafa-cocinas': 'Lafa Cocinas',
  Marmopar: 'Marmopar',
  Leonor: 'Leonor',
  lapidaspy: 'Lápidas PY',
  newgalley: 'New Galley',
  Nenukos: 'Nenukos',
  NenukosBarber: 'Nenukos Barber',
}

const brandModules = import.meta.glob('./Marcas/*.{png,jpg,jpeg,PNG,JPG,JPEG}', {
  eager: true,
  import: 'default',
})

function getBrandName(filename) {
  const base = filename.replace(/\.[^.]+$/, '')
  if (BRAND_DISPLAY_NAMES[base]) return BRAND_DISPLAY_NAMES[base]
  return base.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const TRUSTED_BRANDS = Object.entries(brandModules)
  .map(([path, src]) => {
    const filename = path.split('/').pop() ?? ''
    return { src, name: getBrandName(filename), filename }
  })
  .sort((a, b) => a.name.localeCompare(b.name, 'es'))

function initBrandsMarquee() {
  const track = document.getElementById('brands-marquee')
  if (!track || TRUSTED_BRANDS.length === 0) return

  const createGroup = (hidden = false) => {
    const group = document.createElement('div')
    group.className = 'marquee-group'
    if (hidden) group.setAttribute('aria-hidden', 'true')

    TRUSTED_BRANDS.forEach((brand) => {
      const item = document.createElement('div')
      item.className = 'brand-logo-item'
      item.setAttribute('role', 'listitem')

      const img = document.createElement('img')
      img.src = brand.src
      img.alt = brand.name
      img.loading = 'lazy'
      img.decoding = 'async'

      item.appendChild(img)
      group.appendChild(item)
    })

    return group
  }

  track.appendChild(createGroup())
  track.appendChild(createGroup(true))
}

document.addEventListener('DOMContentLoaded', () => {
  initBrandsMarquee()
  // Update footer year dynamically
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Floating Pill Navbar — smooth class toggle with hysteresis
  const navbar = document.getElementById('navbar');
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const scrollProgress = document.getElementById('scroll-progress');
  let navScrolled = false;

  const updateNavbar = () => {
    const y = window.scrollY;
    // Hysteresis avoids flicker near the threshold
    if (!navScrolled && y > 28) {
      navScrolled = true;
      navbar?.classList.add('scrolled');
      navbarWrapper?.classList.add('scrolled');
    } else if (navScrolled && y < 8) {
      navScrolled = false;
      navbar?.classList.remove('scrolled');
      navbarWrapper?.classList.remove('scrolled');
    }

    if (scrollProgress) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgress.style.width = scrolled + '%';
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Scroll Reveal Animations using Intersection Observer with spring dynamics
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px', // Animates slightly before entering viewport
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle staggered transition delays
        const delay = entry.target.style.getPropertyValue('--delay');
        if(delay) {
          entry.target.style.transitionDelay = delay;
        }
        
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.fade-in-up');
  elementsToAnimate.forEach(el => observer.observe(el));

  // Init Vanilla Tilt (desktop only — avoids broken mockup badges on tablet/mobile)
  if (window.VanillaTilt && window.innerWidth > 992) {
    const tiltElements = document.querySelectorAll('.js-tilt');
    VanillaTilt.init(tiltElements, {
      max: 5,
      speed: 600,
      glare: true,
      "max-glare": 0.12,
      scale: 1.015,
      perspective: 1000
    });
  }
});
