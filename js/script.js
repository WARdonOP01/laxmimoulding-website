
/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

/* ---- Navbar Scroll Behavior ---- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ---- Active Nav Link ---- */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (
      a.getAttribute('href') === currentPage ||
      (currentPage === '' && a.getAttribute('href') === 'index.html')
    ) {
      a.classList.add('active');
    }
  });
})();

/* ---- Hamburger Menu ---- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Stats Counter Animation ---- */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---- Gallery Filter ---- */
const filterBtns = document.querySelectorAll('.gallery-filter-btn');
const masonryItems = document.querySelectorAll('.masonry-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    masonryItems.forEach(item => {
      const cat = item.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        item.style.opacity = '0';
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transition = 'opacity 0.4s';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.4s';
        setTimeout(() => {
          item.style.display = 'none';
        }, 400);
      }
    });
  });
});

/* ---- Lightbox ---- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.masonry-item, .gp-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img && lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}
if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ---- Smooth Scroll (anchor links) ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---- Upload Zone ---- */
const uploadZone = document.querySelector('.upload-zone');
const fileInput = document.querySelector('.upload-zone input[type="file"]');
if (uploadZone && fileInput) {
  uploadZone.addEventListener('click', () => fileInput.click());

  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--gold)';
    uploadZone.style.background = 'rgba(201,168,76,0.08)';
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = '';
    uploadZone.style.background = '';
  });
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) uploadZone.querySelector('p').textContent = `✓ File selected: ${file.name}`;
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) {
      uploadZone.querySelector('p').textContent = `✓ File selected: ${fileInput.files[0].name}`;
    }
  });
}

/* ---- Form Submit Feedback ---- */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      const original = btn.innerHTML;
      btn.innerHTML = '<span>✓ Submitted Successfully!</span>';
      btn.style.background = '#2a7a3f';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        form.reset();
        const uploadP = form.querySelector('.upload-zone p');
        if (uploadP) uploadP.textContent = 'Click to upload or drag & drop your design file';
      }, 3000);
    }
  });
});

/* ---- AOS Init ---- */
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });
}

/* ---- Parallax Hero ---- */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}