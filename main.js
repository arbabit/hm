document.addEventListener("DOMContentLoaded", () => {
    // Sync the loading of both files
    const fetchHeader = fetch("./header.html").then(res => res.ok ? res.text() : Promise.reject('Header Missing'));
    const fetchFooter = fetch("./footer.html").then(res => res.ok ? res.text() : Promise.reject('Footer Missing'));

    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            // Inject and verify
            document.getElementById("mainHeader").innerHTML = headerData;
            document.getElementById("main-footer").innerHTML = footerData;

            initMobileMenu();
            initScrollEffect();

            // Wait for layout to settle before starting numbers
            setTimeout(initCounters, 800);
        })
        .catch(err => console.error("Injection Error:", err));
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
                // Parse the target as a clean number
                const targetValue = parseInt(counter.getAttribute('data-target'));
                if (isNaN(targetValue)) return; 

                const speed = 200;
                let currentVal = 0; // The numeric tracking variable

                const updateCount = () => {
                    const inc = targetValue / speed;

                    if (currentVal < targetValue) {
                        currentVal += inc;
                        // Never allow it to overshoot the target
                        const displayNum = Math.min(Math.ceil(currentVal), targetValue);
                        
                        // Apply formatting only for the display
                        counter.innerText = displayNum >= 1000 ? 
                            (displayNum / 1000).toFixed(0) + 'k+' : 
                            displayNum + '+';
                        
                        setTimeout(updateCount, 15);
                    } else {
                        // Hard Stop at the exact target value
                        counter.innerText = targetValue >= 1000 ? 
                            (targetValue / 1000).toFixed(0) + 'k+' : 
                            targetValue + '+';
                    }
                };

                updateCount();
                // Stop observing so layout shifts don't restart it
                observer.unobserve(counter); 
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





