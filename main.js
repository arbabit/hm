// LOAD HEADER & FOOTER
document.addEventListener("DOMContentLoaded", () => {
  // Dynamically load header.html into #mainHeader
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("mainHeader").outerHTML = data;
      setTimeout(setActiveNavLink, 0); // Ensure DOM update before running
      initMobileMenu && initMobileMenu();
    });

  // Dynamically load footer.html into #mainFooter if present
  const footerDiv = document.getElementById("mainFooter");
  if (footerDiv) {
    fetch("footer.html")
      .then(res => res.text())
      .then(data => {
        footerDiv.outerHTML = data;
      });
  }

  // Initialize interactive flip cards
  initFlipCards();
  // Initialize about card interactions
  initAboutCards();
  // Animate counters on scroll
  initCounterAnimation();
  // Contact status (open/closed)
  initContactBox();
});

// Highlight the active nav link based on current page
function setActiveNavLink() {
  // Get current file name (e.g., index.html) or root
  const path = window.location.pathname;
  let page = path.substring(path.lastIndexOf("/") + 1);
  if (page === "" || page === "/") page = "index.html";
  // Select all nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    const text = link.textContent.trim().toLowerCase();
    // Special handling for Contact Us (contact-s.html or contact.html)
    if ((page === "contact-s.html" || page === "contact.html") && (href === "contact-s.html" || href === "contact.html" || text === "contact us")) {
      link.classList.add("active");
    } else if ((href === "index.html" && (page === "index.html" || path === "/")) || href === page) {
      link.classList.add("active");
    }
  });
}

// Flip card interactions (hover handled via CSS; tap/click/keyboard here)
function initFlipCards() {
  const cards = document.querySelectorAll('.process-card');
  if (!cards.length) return;

  cards.forEach(card => {
    // Accessibility attributes
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-expanded', flipped ? 'true' : 'false');
    };

    // Click/tap
    card.addEventListener('click', (e) => {
      // Avoid triggering when clicking interactive elements inside (if any)
      // but current cards are text-only; keep simple
      toggle();
    });
    card.addEventListener('touchstart', () => {
      toggle();
    }, { passive: true });

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

// About cards micro-interactions: ripple on tap/click and keyboard
function initAboutCards() {
  const cards = document.querySelectorAll('.about-item');
  if (!cards.length) return;

  const triggerRipple = (card, x, y) => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    card.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 650);
  };

  cards.forEach(card => {
    // Ensure accessibility focusability
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('click', (e) => {
      const rect = card.getBoundingClientRect();
      triggerRipple(card, e.clientX - rect.left, e.clientY - rect.top);
      card.classList.add('gradient-active');
      card.classList.add('wm-active');
      setTimeout(() => card.classList.remove('gradient-active'), 700);
      setTimeout(() => card.classList.remove('wm-active'), 700);
    });

    card.addEventListener('touchstart', (e) => {
      const rect = card.getBoundingClientRect();
      const touch = e.touches[0];
      triggerRipple(card, touch.clientX - rect.left, touch.clientY - rect.top);
      card.classList.add('gradient-active');
      card.classList.add('wm-active');
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.classList.remove('gradient-active');
      card.classList.remove('wm-active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('gradient-active');
      card.classList.remove('wm-active');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const rect = card.getBoundingClientRect();
        triggerRipple(card, rect.width / 2, rect.height / 2);
        card.classList.add('gradient-active');
        card.classList.add('wm-active');
        setTimeout(() => card.classList.remove('gradient-active'), 700);
        setTimeout(() => card.classList.remove('wm-active'), 700);
      }
    });
  });
}

// ANIMATED COUNTERS
function initCounterAnimation() {
  const counters = document.querySelectorAll('.impact-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetValue = counter.textContent;
        
        // Parse the target value (e.g., "200+", "15k+")
        const hasPlus = targetValue.includes('+');
        const hasK = targetValue.toLowerCase().includes('k');
        let number = parseFloat(targetValue.replace(/[^0-9.]/g, ''));
        if (hasK) {
          number *= 1000;
        }

        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = 50; // update every 50ms
        const steps = duration / stepTime;
        const increment = number / steps;

        const updateCount = () => {
          current += increment;
          if (current >= number) {
            // Restore original format
            counter.textContent = targetValue;
          } else {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCount);
          }
        };
        
        updateCount();
        observer.unobserve(counter); // Animate only once
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// CONTACT BOX: show open/closed status based on office timings
function initContactBox() {
  const statusEl = document.getElementById('openStatus');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  const minute = now.getMinutes();
  const minutesSinceMidnight = hour * 60 + minute;
  const open = minutesSinceMidnight >= 9 * 60 && minutesSinceMidnight < 17 * 60; // 9:00–17:00
  const isWorkingDay = day >= 1 && day <= 6; // Mon–Sat

  if (isWorkingDay && open) {
    statusEl.textContent = 'Open now (Mon–Sat, 9:00 AM – 5:00 PM)';
    statusEl.classList.add('open');
  } else {
    statusEl.textContent = 'Our team is available to assist you during standard office hours.';
    statusEl.classList.remove('open');
  }
}

// MOBILE MENU FUNCTION
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const navList = document.querySelector('.nav-list');
  if (!hamburger || !navList) return;

  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = navList.classList.toggle('mobile-active');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navList.contains(e.target) && !hamburger.contains(e.target)) {
      if (navList.classList.contains('mobile-active')) {
        navList.classList.remove('mobile-active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

