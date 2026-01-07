// LOAD HEADER & FOOTER
document.addEventListener("DOMContentLoaded", () => {
  fetch("partials/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("site-header").innerHTML = data;
      initMobileMenu();
    });

  fetch("partials/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("site-footer").innerHTML = data;
    });
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

