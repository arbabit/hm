document.addEventListener("DOMContentLoaded", () => {
    // 1. SYNCED LOAD: Wait for Header & Footer to finish before starting logic
    const fetchHeader = fetch("./header.html").then(res => res.ok ? res.text() : Promise.reject('Header Missing'));
    const fetchFooter = fetch("./footer.html").then(res => res.ok ? res.text() : Promise.reject('Footer Missing'));

    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            // Inject Header
            const headerElem = document.getElementById("mainHeader") || document.getElementById("site-header");
            if (headerElem) {
                headerElem.innerHTML = headerData;
                initMobileMenu();
                initScrollEffect();
            }

            // Inject Footer
            const footerElem = document.getElementById("main-footer") || document.getElementById("site-footer");
            if (footerElem) {
                footerElem.innerHTML = footerData;
                console.log("SUCCESS: Footer loaded.");
            }

            // 2. TRIGGER COUNTERS AFTER LAYOUT IS STABLE
            // This 300ms delay stops the "flicker to zero"
            setTimeout(initCounters, 300);
        })
        .catch(err => console.error("Architectural Load Error:", err));
});

// SCROLL EFFECT (Sticky Header)
function initScrollEffect() {
    window.onscroll = () => {
        const header = document.getElementById('mainHeader');
        if (header) {
            if (window.pageYOffset > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    };
}

// COUNTER ANIMATION LOGIC
function initCounters() {
    const counters = document.querySelectorAll('.impact-number');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = +counter.getAttribute('data-target');
                const speed = 200;
                
                const updateCount = () => {
                    // Extract numeric value only
                    const current = +counter.innerText.replace(/[+,k]/g, '');
                    const inc = targetValue / speed;

                    if (current < targetValue) {
                        const val = Math.ceil(current + inc);
                        // Formatting
                        counter.innerText = val >= 1000 ? (val/1000).toFixed(0) + 'k+' : val + '+';
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = targetValue >= 1000 ? (targetValue/1000).toFixed(0) + 'k+' : targetValue + '+';
                    }
                };
                updateCount();
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.1 }); // Low threshold so it triggers as soon as visible

    counters.forEach(c => observer.observe(c));
}

// MOBILE MENU
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
