
// LOAD HEADER & FOOTER
document.addEventListener("DOMContentLoaded", () => {
  // If using fetch to load header, ensure highlighting after injection
  fetch("partials/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("site-header").innerHTML = data;
      initMobileMenu();
      setActiveNavLink();
    });

  fetch("./footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("site-footer").innerHTML = data;
    });
  // For pages that include the header directly (not via fetch), run the active-link logic here too
  setActiveNavLink();
});

// Highlight the active nav link based on current page
function setActiveNavLink() {
  // Get current file name (e.g., index.html)
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1) || "index.html";
  // Select all nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    // Remove any previous active class
    link.classList.remove("active");
    const href = link.getAttribute("href");
    const text = link.textContent.trim().toLowerCase();
    // Special handling for Contact Us (contact-s.html or contact.html)
    if ((page === "contact-s.html" || page === "contact.html") && (href === "contact-s.html" || href === "contact.html" || text === "contact us")) {
      link.classList.add("active");
    } else if (href === page) {
      link.classList.add("active");
    }
  });
}

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

