// LOAD HEADER & FOOTER
document.addEventListener("DOMContentLoaded", () => {
  fetch("partials/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("site-header").innerHTML = data;
      initMobileMenu();
      // Ensure the correct nav link is highlighted after header injection
      if (typeof setActiveNavLink === 'function') setActiveNavLink();
    });

  fetch("./footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("site-footer").innerHTML = data;
    });
  // For pages that include the header directly (not via fetch), run the active-link logic here too
  if (typeof setActiveNavLink === 'function') setActiveNavLink();
});

// MOBILE MENU FUNCTION
function initMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");

  if (!mobileMenu || !navLinks) return;

  mobileMenu.addEventListener("click", () => {
    navLinks.style.display =
      navLinks.style.display === "flex" ? "none" : "flex";
  });
}

// Toggle the "active" class on nav links based on current page filename
function setActiveNavLink() {
  const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0].toLowerCase();
    a.classList.toggle('active', href === current || (href === '' && current === 'index.html'));
  });
}
// --- GALLERY FUNCTIONALITY ---
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');

    // Filtering Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Logic
    document.querySelectorAll('.gallery-card').forEach(card => {
        card.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.querySelector('img').src;
            modalCaption.innerHTML = this.querySelector('.gallery-caption p').innerHTML;
        }
    });

    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
}
// Update your existing main.js to call initGallery() after components load
// Inside your Promise.all().then() block:
// initGallery();