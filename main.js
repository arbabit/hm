
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

// MOBILE MENU FUNCTION
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const navList = document.querySelector('.nav-list');
  if (!hamburger || !navList) return;

  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = navList.classList.toggle('mobile-active');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navList.contains(e.target) && !hamburger.contains(e.target)) {
      if (navList.classList.contains('mobile-active')) {
        navList.classList.remove('mobile-active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

