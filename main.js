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
                const targetValue = parseInt(counter.getAttribute('data-target'));
                if (isNaN(targetValue)) return; 

                const speed = 200;
                let currentPos = 0; // Use a clean variable for math

                const updateCount = () => {
                    const inc = targetValue / speed;

                    if (currentPos < targetValue) {
                        currentPos += inc;
                        // Never let it go past the target
                        const displayVal = Math.min(Math.ceil(currentPos), targetValue);
                        
                        // Formatting
                        counter.innerText = displayVal >= 1000 ? 
                            (displayVal / 1000).toFixed(0) + 'k+' : 
                            displayVal + '+';
                        
                        setTimeout(updateCount, 15);
                    } else {
                        // Hard Stop at the exact target
                        counter.innerText = targetValue >= 1000 ? 
                            (targetValue / 1000).toFixed(0) + 'k+' : 
                            targetValue + '+';
                    }
                };

                updateCount();
                observer.unobserve(counter); // STOP the observer so it doesn't reset
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



