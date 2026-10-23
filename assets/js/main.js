// RV Global Infra Interactive Functionality

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar styling
    const navbar = document.querySelector('.luxury-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Interactive Project Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 3. Project Cost & Timeline Estimator Calculator
    const projectTypeSelect = document.getElementById('calcProjectType');
    const projectAreaInput = document.getElementById('calcArea');
    const areaValueDisplay = document.getElementById('areaValueDisplay');
    const finishQuality = document.getElementById('calcFinishQuality');
    const estimatedCostDisplay = document.getElementById('calcEstimatedCost');
    const estimatedTimelineDisplay = document.getElementById('calcEstimatedTimeline');

    function calculateEstimate() {
        if (!projectTypeSelect || !projectAreaInput || !finishQuality) return;

        const baseRates = {
            'residential': 2400,
            'commercial': 2900,
            'epc': 3500,
            'interior': 1800,
            'energy': 1200
        };

        const qualityMultipliers = {
            'premium': 1.0,
            'ultra_luxury': 1.35,
            'presidential': 1.7
        };

        const timelinePerThousandSqFt = {
            'residential': 3.5,
            'commercial': 4,
            'epc': 5,
            'interior': 1.5,
            'energy': 2
        };

        const type = projectTypeSelect.value;
        const area = parseFloat(projectAreaInput.value);
        const quality = finishQuality.value;

        if (areaValueDisplay) {
            areaValueDisplay.textContent = Number(area).toLocaleString('en-IN') + ' sq. ft.';
        }

        const ratePerSqFt = (baseRates[type] || 2500) * (qualityMultipliers[quality] || 1.0);
        const totalCost = area * ratePerSqFt;

        // In Lakhs or Crores formatting (INR standard)
        let formattedCost = '';
        if (totalCost >= 10000000) {
            formattedCost = '₹ ' + (totalCost / 10000000).toFixed(2) + ' Crores';
        } else {
            formattedCost = '₹ ' + (totalCost / 100000).toFixed(2) + ' Lakhs';
        }

        // Timeline estimate in months
        const baseMonths = timelinePerThousandSqFt[type] || 3;
        const totalMonths = Math.max(3, Math.round((area / 1000) * baseMonths * 0.7));

        if (estimatedCostDisplay) {
            estimatedCostDisplay.textContent = formattedCost;
        }
        if (estimatedTimelineDisplay) {
            estimatedTimelineDisplay.textContent = `${totalMonths} - ${totalMonths + 3} Months`;
        }
    }

    if (projectTypeSelect && projectAreaInput && finishQuality) {
        projectTypeSelect.addEventListener('change', calculateEstimate);
        projectAreaInput.addEventListener('input', calculateEstimate);
        finishQuality.addEventListener('change', calculateEstimate);
        calculateEstimate();
    }

    // 4. Consultation Form submission handler
    const quoteForm = document.getElementById('luxuryInquiryForm');
    const quoteSuccessAlert = document.getElementById('quoteSuccessAlert');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = quoteForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                if (quoteSuccessAlert) {
                    quoteSuccessAlert.classList.remove('d-none');
                }
                quoteForm.reset();
            }, 1200);
        });
    }

    // 5. Counters animation when scrolled into view
    const statsSection = document.querySelector('.stats-counter-section');
    let counted = false;

    if (statsSection) {
        window.addEventListener('scroll', () => {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85 && !counted) {
                counted = true;
                const counters = document.querySelectorAll('.counter-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const stepTime = 30;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString('en-IN');
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.ceil(current).toLocaleString('en-IN');
                        }
                    }, stepTime);
                });
            }
        });
    }

    // 6. Skygate Hero Image & Text Auto-Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const heroCard = document.getElementById('skygateHeroCard');

    if (heroSlides.length > 0) {
        let currentSlideIndex = 0;
        let slideInterval = null;
        const slideDuration = 5500; // 5.5 seconds per slide for luxurious reading pace

        function showSlide(index) {
            heroSlides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            heroDots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            currentSlideIndex = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlideIndex + 1) % heroSlides.length;
            showSlide(nextIndex);
        }

        function startAutoSlide() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        }

        function stopAutoSlide() {
            if (slideInterval) clearInterval(slideInterval);
        }

        // Initialize auto slide
        startAutoSlide();

        // Dot click interactions
        heroDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.target.getAttribute('data-slide'), 10);
                if (!isNaN(targetIdx)) {
                    showSlide(targetIdx);
                    startAutoSlide(); // Reset timer after manual interaction
                }
            });
        });

        // Pause on mouse enter, resume on mouse leave
        if (heroCard) {
            heroCard.addEventListener('mouseenter', stopAutoSlide);
            heroCard.addEventListener('mouseleave', startAutoSlide);
        }
    }
});
