document.addEventListener("DOMContentLoaded", () => {
    // 1. SYNCED LOAD: Wait for Header & Footer before starting animations
    const fetchHeader = fetch("./header.html").then(res => res.ok ? res.text() : Promise.reject('Header Missing'));
    const fetchFooter = fetch("./footer.html").then(res => res.ok ? res.text() : Promise.reject('Footer Missing'));

    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            document.getElementById("mainHeader").innerHTML = headerData;
            document.getElementById("main-footer").innerHTML = footerData;

            initMobileMenu();
            initScrollEffect();

            // 2. TRIGGER COUNTERS AFTER STABILIZATION
            // 800ms delay ensures the browser has finished painting injected HTML
            setTimeout(initCounters, 800);
        })
        .catch(err => console.error("Load Error:", err));
});;

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
                const targetValue = +counter.getAttribute('data-target');
                const speed = 200;
                let hasStarted = false;

                const updateCount = () => {
                    // Extract current number, ignoring symbols
                    const currentStr = counter.innerText.replace(/[+,k]/g, '');
                    const current = parseFloat(currentStr) || 0;
                    const inc = targetValue / speed;

                    if (current < targetValue) {
                        const nextVal = Math.ceil(current + inc);
                        // Prevent overshooting the target
                        const finalVal = nextVal > targetValue ? targetValue : nextVal;
                        
                        // Apply formatting during animation
                        counter.innerText = finalVal >= 1000 ? 
                            (finalVal / 1000).toFixed(0) + 'k+' : 
                            finalVal + '+';
                        
                        setTimeout(updateCount, 15);
                    } else {
                        // FINAL STOP: Ensure exact target is set and stop loop
                        counter.innerText = targetValue >= 1000 ? 
                            (targetValue / 1000).toFixed(0) + 'k+' : 
                            targetValue + '+';
                    }
                };

                if (!hasStarted) {
                    updateCount();
                    hasStarted = true;
                    // Stop observing this element so it doesn't restart
                    observer.unobserve(counter);
                }
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

