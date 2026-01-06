document.addEventListener("DOMContentLoaded", () => {
    // 1. CONSOLIDATED LOAD: Fetch both files simultaneously
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
                console.log("SUCCESS: Footer loaded.");
            }

            // 2. TRIGGER COUNTERS: 500ms delay prevents the "reset to zero" glitch
            setTimeout(initCounters, 500);
        })
        .catch(err => console.error("Critical Load Error:", err));
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

function initCounters() {
    const counters = document.querySelectorAll('.impact-number');
    const observer = new IntersectionObserver((entries, obs) => {
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
                obs.unobserve(counter);
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
            const isFlex = navLinks.style.display === "flex";
            navLinks.style.display = isFlex ? "none" : "flex";
        });
    }
}
