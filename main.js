// MASTER LOADER: HEADER, FOOTER, & ANIMATIONS
document.addEventListener("DOMContentLoaded", () => {
    // 1. LOAD HEADER
    fetch("header.html")
        .then(res => res.text())
        .then(data => {
            const headerElem = document.getElementById("mainHeader") || document.getElementById("site-header");
            if (headerElem) {
                headerElem.innerHTML = data;
                initMobileMenu();
                initScrollEffect(); // Re-initialize scroll listener after load
            }
        });

    // 2. LOAD FOOTER (Reinforced Architect Version)
fetch("footer.html")
    .then(res => {
        if (!res.ok) throw new Error("footer.html not found in root directory");
        return res.text();
    })
    .then(data => {
        // Targets 'main-footer' (your index.html ID) or 'site-footer'
        const footerElem = document.getElementById("main-footer") || document.getElementById("site-footer");
        if (footerElem) {
            footerElem.innerHTML = data;
            console.log("Footer loaded successfully");
        } else {
            console.error("Architect Alert: No footer element found in index.html");
        }
    })
    .catch(err => console.error(err));
    
    // 3. START ANIMATED COUNTERS
    initCounters();
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
    const speed = 200;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
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
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// MOBILE MENU (Preserved your logic)
function initMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener("click", () => {
            navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
        });
    }
}

