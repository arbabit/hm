document.addEventListener("DOMContentLoaded", () => {
    // 1. LOAD HEADER
    fetch("header.html")
        .then(res => res.ok ? res.text() : Promise.reject('Header File Missing'))
        .then(data => {
            const headerElem = document.getElementById("mainHeader") || document.getElementById("site-header");
            if (headerElem) {
                headerElem.innerHTML = data;
                initMobileMenu();
            }
        }).catch(err => console.error(err));

    // 2. LOAD FOOTER (The Critical Path Fix)
    fetch("footer.html")
        .then(res => {
            if (!res.ok) {
                console.error("ERROR: footer.html was not found in your folder!");
                return;
            }
            return res.text();
        })
        .then(data => {
            const footerElem = document.getElementById("main-footer") || document.getElementById("site-footer");
            if (footerElem) {
                footerElem.innerHTML = data;
                console.log("SUCCESS: Footer loaded into the DOM.");
            }
        });

    initCounters();
});
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


