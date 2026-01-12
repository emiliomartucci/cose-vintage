/**
 * Cose Vintage - Main JavaScript
 * v1.0.0 - 2026-01-12 - Initial setup
 */

(function() {
  'use strict';

  // =============================================================
  // MOBILE NAVIGATION
  // =============================================================
  const initMobileNav = () => {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    const body = document.body;

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');

      nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', !isOpen);
      body.classList.toggle('nav-open', !isOpen);

      // Update icon
      const icon = menuToggle.querySelector('svg');
      if (icon) {
        icon.innerHTML = isOpen
          ? '<path d="M3 12h18M3 6h18M3 18h18"/>'
          : '<path d="M18 6L6 18M6 6l12 12"/>';
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });
  };

  // =============================================================
  // SCROLL ANIMATIONS
  // =============================================================
  const initScrollAnimations = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  };

  // =============================================================
  // HEADER SCROLL BEHAVIOR
  // =============================================================
  const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add shadow on scroll
      if (currentScroll > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      // Hide/show on scroll direction (optional)
      if (currentScroll > scrollThreshold) {
        if (currentScroll > lastScroll) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
      }

      lastScroll = currentScroll;
    }, { passive: true });
  };

  // =============================================================
  // NEWSLETTER FORM
  // =============================================================
  const initNewsletterForm = () => {
    const forms = document.querySelectorAll('.newsletter-form');

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        if (!email) return;

        // Disable form during submission
        emailInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio...';

        try {
          // TODO: Replace with actual API endpoint
          // For now, simulate success
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Success
          form.innerHTML = `
            <p class="newsletter-success" style="color: var(--color-sage); font-family: var(--font-accent); font-style: italic; font-size: var(--text-lg);">
              Grazie! Ti terremo aggiornato sui nuovi arrivi.
            </p>
          `;
        } catch (error) {
          // Error
          emailInput.disabled = false;
          submitBtn.disabled = false;
          submitBtn.textContent = 'Iscriviti';

          const errorMsg = document.createElement('p');
          errorMsg.className = 'newsletter-error';
          errorMsg.style.cssText = 'color: var(--color-error); font-size: var(--text-sm); margin-top: var(--space-2);';
          errorMsg.textContent = 'Si e\' verificato un errore. Riprova.';

          if (!form.querySelector('.newsletter-error')) {
            form.appendChild(errorMsg);
          }
        }
      });
    });
  };

  // =============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =============================================================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  // =============================================================
  // LAZY LOADING IMAGES
  // =============================================================
  const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
      });
    } else {
      // Fallback with IntersectionObserver
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  // =============================================================
  // PRODUCT CARD INTERACTIONS
  // =============================================================
  const initProductCards = () => {
    // Wishlist toggle
    document.querySelectorAll('.product-card__wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        btn.classList.toggle('is-active');

        const icon = btn.querySelector('svg');
        if (btn.classList.contains('is-active')) {
          icon.setAttribute('fill', 'currentColor');
        } else {
          icon.setAttribute('fill', 'none');
        }
      });
    });
  };

  // =============================================================
  // FILTER TOGGLE (for shop page)
  // =============================================================
  const initFilters = () => {
    const filterToggle = document.querySelector('.filter-toggle');
    const filterPanel = document.querySelector('.filter-panel');

    if (!filterToggle || !filterPanel) return;

    filterToggle.addEventListener('click', () => {
      filterPanel.classList.toggle('is-open');
      filterToggle.setAttribute(
        'aria-expanded',
        filterPanel.classList.contains('is-open')
      );
    });
  };

  // =============================================================
  // SNIPCART HELPERS
  // =============================================================
  const initSnipcart = () => {
    // Update cart count in header
    document.addEventListener('snipcart.ready', () => {
      const updateCartCount = () => {
        const count = Snipcart.store.getState().cart.items.count;
        const cartCountEl = document.querySelector('.header__cart-count');
        if (cartCountEl) {
          cartCountEl.textContent = count;
          cartCountEl.style.display = count > 0 ? 'flex' : 'none';
        }
      };

      // Initial update
      updateCartCount();

      // Subscribe to cart changes
      Snipcart.store.subscribe(updateCartCount);
    });
  };

  // =============================================================
  // INIT ALL
  // =============================================================
  const init = () => {
    initMobileNav();
    initScrollAnimations();
    initHeaderScroll();
    initNewsletterForm();
    initSmoothScroll();
    initLazyLoading();
    initProductCards();
    initFilters();
    initSnipcart();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
