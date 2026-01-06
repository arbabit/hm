document.addEventListener("DOMContentLoaded", () => {
    const fetchHeader = fetch("./header.html").then(res => res.text());
    const fetchFooter = fetch("./footer.html").then(res => res.text());

    Promise.all([fetchHeader, fetchFooter]).then(([headerData, footerData]) => {
        document.getElementById("mainHeader").innerHTML = headerData;
        document.getElementById("main-footer").innerHTML = footerData;
        
        initMobileMenu();
        initScrollEffect();
        // Wait for layout to settle
        setTimeout(initCounters, 800); 
    });
});

function initCounters() {
    const counters = document.querySelectorAll('.impact-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0; // Pure numeric tracking

                const update = () => {
                    const inc = target / 200;
                    if (current < target) {
                        current += inc;
                        const val = Math.min(Math.ceil(current), target);
                        counter.innerText = val >= 1000 ? (val/1000).toFixed(0) + 'k+' : val + '+';
                        setTimeout(update, 15);
                    } else {
                        counter.innerText = target >= 1000 ? (target/1000).toFixed(0) + 'k+' : target + '+';
                    }
                };
                update();
                observer.unobserve(counter); // Stop loop
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






