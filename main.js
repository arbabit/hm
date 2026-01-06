document.addEventListener("DOMContentLoaded", () => {
    const fetchHeader = fetch("./header.html").then(res => res.text());
    const fetchFooter = fetch("./footer.html").then(res => res.text());

    Promise.all([fetchHeader, fetchFooter]).then(([headerData, footerData]) => {
        document.getElementById("mainHeader").innerHTML = headerData;
        document.getElementById("main-footer").innerHTML = footerData;
        
        initMobileMenu();
        initScrollEffect();
        // Wait for everything to stop moving before counting
        setTimeout(initCounters, 800); 
    });
});;

function initCounters() {
    const counters = document.querySelectorAll('.impact-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = parseInt(counter.getAttribute('data-target'));
                if (isNaN(targetValue)) return; 

                const speed = 200;
                let currentVal = 0; // Pure numeric tracking

                const updateCount = () => {
                    const inc = targetValue / speed;

                    if (currentVal < targetValue) {
                        currentVal += inc;
                        // Hard stop to prevent overshooting
                        const displayNum = Math.min(Math.ceil(currentVal), targetValue);
                        
                        // Apply formatting for the display
                        counter.innerText = displayNum >= 1000 ? 
                            (displayNum / 1000).toFixed(0) + 'k+' : 
                            displayNum + '+';
                        
                        setTimeout(updateCount, 15);
                    } else {
                        // Final snap to target
                        counter.innerText = targetValue >= 1000 ? 
                            (targetValue / 1000).toFixed(0) + 'k+' : 
                            targetValue + '+';
                    }
                };

                updateCount();
                observer.unobserve(counter); // Stop observing so it doesn't reset
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








