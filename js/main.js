document.addEventListener("DOMContentLoaded", () => {
  
  // --- Performance & Layout Caching ---
  let windowHeight = window.innerHeight;
  let scrollY = window.pageYOffset;
  
  const cache = {
    scrub: { top: 0, height: 0 },
    video: { top: 0, height: 0 }
  };

  const updateCache = () => {
    windowHeight = window.innerHeight;
    const scrubTrack = document.querySelector('.scrub-track');
    const videoShowcaseSection = document.getElementById('hero-apple');
    
    if (scrubTrack) {
      cache.scrub.top = scrubTrack.offsetTop;
      cache.scrub.height = scrubTrack.offsetHeight;
    }
    if (videoShowcaseSection) {
      cache.video.top = videoShowcaseSection.offsetTop;
      cache.video.height = videoShowcaseSection.offsetHeight;
    }
  };

  // Initial cache and update on resize with debounce
  updateCache();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCache, 250);
  }, { passive: true });

  // Update scroll value globally to avoid multiple scroll handlers reading it
  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
  }, { passive: true });


  // --- Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealOptions = { threshold: 0.1, rootMargin: "0px" };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Soft Parallax Effect (Optimized) ---
  const parallaxElements = document.querySelectorAll('[data-speed]');
  let parallaxActive = true;

  const animateParallax = () => {
    if (parallaxActive && window.innerWidth > 900) {
      parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-speed');
        const yPos = -(scrollY * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }
    requestAnimationFrame(animateParallax);
  };
  animateParallax();

  // Header Logic
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- FAQ Accordion ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parentItem = question.parentElement;
      const isActive = parentItem.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!isActive) parentItem.classList.add('active');
    });
  });

  // --- Antigravity Method Scrub Animation (Disabled for standardization) ---
  // Removed JS-driven transforms to allow standard scroll-reveal behavior.

  // --- Apple Style Video Reveal (Optimized) ---
  const videoShowcaseSection = document.getElementById('hero-apple');
  const videoWrapper = videoShowcaseSection ? videoShowcaseSection.querySelector('.apple-reveal') : null;
  
  if (videoShowcaseSection && videoWrapper) {
    let currentVidProgress = 0;
    let targetVidProgress = 0;
    let isVideoVisible = false;
    const vidLerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const videoObserver = new IntersectionObserver((entries) => {
      isVideoVisible = entries[0].isIntersecting;
    }, { threshold: 0, rootMargin: "200px" });
    videoObserver.observe(videoShowcaseSection);

    const animateVideoShowcase = () => {
      if (!isVideoVisible) {
        requestAnimationFrame(animateVideoShowcase);
        return;
      }

      // Calculate target progress from cached values (NO getBoundingClientRect)
      const videoTop = cache.video.top;
      const startTrigger = windowHeight * 0.95; 
      const distance = windowHeight * 0.5; 
      const scrolledIn = startTrigger - (videoTop - scrollY);
      
      if (scrolledIn < 0) targetVidProgress = 0;
      else if (scrolledIn > distance) targetVidProgress = 1;
      else targetVidProgress = scrolledIn / distance;

      currentVidProgress = vidLerp(currentVidProgress, targetVidProgress, 0.15); 
      
      const clipX = 25 - (25 * currentVidProgress); 
      const clipY = 15 - (15 * currentVidProgress); 
      const currentRadius = Math.max(16, 40 - (24 * currentVidProgress)); 
      
      const clipPath = `inset(${clipY}% ${clipX}% round ${currentRadius}px)`;
      videoWrapper.style.clipPath = clipPath;
      videoWrapper.style.webkitClipPath = clipPath;
      // Opacity is now handled by CSS scroll-reveal for a unified, smoother entry
      
    requestAnimationFrame(animateVideoShowcase);
  };
  animateVideoShowcase();
}
  // --- Authority Numbers Count-Up ---
  const authoritySection = document.getElementById('autorita');
  const authorityNumbers = document.querySelectorAll('.authority-number');
  let countsStarted = false;

  if (authoritySection && authorityNumbers.length > 0) {
    const countUpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countsStarted) {
          countsStarted = true;
          authorityNumbers.forEach(el => {
            const target = +el.getAttribute('data-target');
            const suffix = el.getAttribute('data-suffix') || '+';
            const duration = 2500;
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            let startTime = null;
            function updateCount(timestamp) {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const easedProgress = easeOutCubic(progress);
              el.innerHTML = Math.floor(easedProgress * target) + suffix;
              if (progress < 1) requestAnimationFrame(updateCount);
              else el.innerHTML = target + suffix;
            }
            requestAnimationFrame(updateCount);
          });
        }
      });
    }, { threshold: 0.5 });
    countUpObserver.observe(authoritySection);
  }

  // ══════════════════════════════════════════════════════════════
  //  CASE STUDIES CAROUSEL — v6 "Ruota Continua"
  //
  //  Track layout (CLONE_BUF = 3, N = 9):
  //  [pad] [cl6][cl7][cl8] [c0][c1]…[c8] [cl0][cl1][cl2] [pad]
  //   idx:   0    1    2    3   4      11   12   13   14
  //
  //  Init: scrollLeft = CLONE_BUF × stride
  //  → card 0 (Alex Theory) al centro
  //  → cl8 (clone di Doctor Case) visibile a sinistra  ✓
  //  → card 1 (CDC) visibile a destra                  ✓
  //
  //  Teleport DESTRA: pos ≥ (B+N) × stride → pos −= N×stride
  //  Teleport SINISTRA: pos < (B-1) × stride → pos += N×stride
  //  → spostamento di esattamente N×stride = invisibile all'occhio ✓
  // ══════════════════════════════════════════════════════════════
  ;(function () {

    const track    = document.getElementById('case-carousel');
    const dotsWrap = document.getElementById('carousel-dots');
    const prevBtn  = document.getElementById('prev-btn');
    const nextBtn  = document.getElementById('next-btn');

    if (!track || !dotsWrap) return;

    const GAP       = 20;  // px — combacia con il gap CSS
    const CLONE_BUF = 3;   // cloni per lato

    // ── 1. Pulisci e raccoglie originali ────────────────────────
    track.querySelectorAll('.is-clone').forEach(c => c.remove());
    const originals = Array.from(track.querySelectorAll('.case-card'));
    const N         = originals.length; // 9

    // ── 2. Clonazione simmetrica ─────────────────────────────────
    // PREPEND: ultime CLONE_BUF card
    originals.slice(-CLONE_BUF).reverse().forEach(card => {
      const cl = card.cloneNode(true);
      cl.classList.add('is-clone');
      cl.setAttribute('aria-hidden', 'true');
      track.prepend(cl);
    });
    // APPEND: prime CLONE_BUF card
    originals.slice(0, CLONE_BUF).forEach(card => {
      const cl = card.cloneNode(true);
      cl.classList.add('is-clone');
      cl.setAttribute('aria-hidden', 'true');
      track.append(cl);
    });

    // ── 3. Dots (N reali) ────────────────────────────────────────
    dotsWrap.innerHTML = '';
    for (let i = 0; i < N; i++) {
      const btn = document.createElement('button');
      btn.className = 'cs-dot';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Case study ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
    const dotsArr  = Array.from(dotsWrap.querySelectorAll('.cs-dot'));
    const syncDots = idx => dotsArr.forEach((d, i) => d.classList.toggle('active', i === idx));

    // ── 4. Layout: calcolo dinamico ──────────────────────────────
    let L = { stride: 1, padding: 0 };

    const computeLayout = () => {
      const card = track.querySelector('.case-card');
      if (!card) return L;
      const cW      = card.offsetWidth;
      const vw      = window.innerWidth;
      const padding = Math.round((vw - cW) / 2);
      return { cW, padding, stride: cW + GAP };
    };

    const applyLayout = ({ padding }) => {
      track.style.paddingLeft         = padding + 'px';
      track.style.paddingRight        = padding + 'px';
      track.style.scrollPaddingLeft   = padding + 'px';
      track.style.scrollPaddingRight  = padding + 'px';
    };

    // ── 5. Navigazione ───────────────────────────────────────────
    const goTo = (realIdx, smooth = true) => {
      const target = (CLONE_BUF + realIdx) * L.stride;
      track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'instant' });
    };

    const normalize = pos => {
      const abs = Math.round(pos / L.stride);
      return (((abs - CLONE_BUF) % N) + N) % N;
    };

    // ── 6. Stato ─────────────────────────────────────────────────
    let currentReal = 0;
    let teleporting = false;

    // ── 7. Teleportazione invisibile ─────────────────────────────
    const teleport = delta => {
      teleporting = true;
      track.style.scrollSnapType = 'none';
      track.scrollLeft += delta;
      requestAnimationFrame(() => {
        track.style.scrollSnapType = 'x mandatory';
        teleporting = false;
      });
    };

    // ── 8. Scroll handler ─────────────────────────────────────────
    const onScroll = () => {
      if (teleporting) return;

      const pos   = track.scrollLeft;
      const total = N * L.stride;

      if (pos >= (CLONE_BUF + N) * L.stride) {
        teleport(-total);
        return;
      }
      if (pos < (CLONE_BUF - 1) * L.stride) {
        teleport(+total);
        return;
      }

      currentReal = normalize(pos);
      syncDots(currentReal);
    };

    track.addEventListener('scroll', onScroll, { passive: true });

    // ── 9. Frecce ────────────────────────────────────────────────
    if (nextBtn) nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: L.stride, behavior: 'smooth' });
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -L.stride, behavior: 'smooth' });
    });

    // ── 10. Init ─────────────────────────────────────────────────
    const init = () => {
      L = computeLayout();
      applyLayout(L);
      // Alex Theory (indice CLONE_BUF) al centro
      track.scrollLeft = CLONE_BUF * L.stride;
      syncDots(0);
    };

    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(init, 60);
    }));

    // ── 11. Resize ───────────────────────────────────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        L = computeLayout();
        applyLayout(L);
        track.scrollLeft = (CLONE_BUF + currentReal) * L.stride;
      }, 200);
    }, { passive: true });

  })(); // fine IIFE carousel

});
