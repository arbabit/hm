document.addEventListener("DOMContentLoaded", () => {
    const fetchHeader = fetch("./header.html").then(res => res.ok ? res.text() : Promise.reject('Header Missing'));
    const fetchFooter = fetch("./footer.html").then(res => res.ok ? res.text() : Promise.reject('Footer Missing'));

    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            // Inject content
            document.getElementById("mainHeader").innerHTML = headerData;
            document.getElementById("main-footer").innerHTML = footerData;

            // Initialize components
            initMobileMenu();
            initScrollEffect();

            // Stabilize layout then start counters
            setTimeout(initCounters, 800); 
        })
        .catch(err => console.error("Load Error:", err));
});

function initScrollEffect() {
    window.onscroll = () => {
        const header = document.getElementById('mainHeader');
        if (header && window.pageYOffset > 50) header.classList.add('scrolled');
        else if (header) header.classList.remove('scrolled');
    };
}

function initCounters() {
    const counters = document.querySelectorAll('.impact-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const speed = 200;
                
                const updateCount = () => {
                    const current = +counter.innerText.replace(/[+,k]/g, '');
                    const inc = target / speed;
                    if (current < target) {
                        const val = Math.ceil(current + inc);
                        counter.innerText = val >= 1000 ? (val/1000).toFixed(0) + 'k+' : val + '+';
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target >= 1000 ? (target/1000).toFixed(0) + 'k+' : target + '+';
                    }
                };
                updateCount();
            }
        });
    }, { threshold: 0.1 });
    counters.forEach(c => observer.observe(c));
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
