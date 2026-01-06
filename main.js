document.addEventListener("DOMContentLoaded", () => {
    const fetchHeader = fetch("./header.html").then(res => res.ok ? res.text() : Promise.reject('Header Missing'));
    const fetchFooter = fetch("./footer.html").then(res => res.ok ? res.text() : Promise.reject('Footer Missing'));

    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            // Inject Header
            const headerElem = document.getElementById("mainHeader");
            if (headerElem) {
                headerElem.innerHTML = headerData;
                initMobileMenu(); 
                initScrollEffect(); 
            }

            // Inject Footer
            const footerElem = document.getElementById("main-footer");
            if (footerElem) {
                footerElem.innerHTML = footerData;
            }
        })
        .catch(err => console.error("Load Error:", err));
});

function initScrollEffect() {
    window.onscroll = () => {
        const header = document.getElementById('mainHeader');
        if (header) {
            if (window.pageYOffset > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    };
}

function initMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener("click", () => {
            navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
        });
    }
}
