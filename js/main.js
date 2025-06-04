document.addEventListener('DOMContentLoaded', function() {
    // Hero section interactions
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    // Request Live Demo button
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            // Add smooth scroll or modal functionality
            console.log('Request Live Demo clicked');
            // You can add modal popup or form here
        });
    }
    
    // Pricing & Plans button
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            console.log('Pricing & Plans clicked');
            // Navigate to pricing section or page
        });
    }
    
    // Animate hero elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Device mockup hover effects
    const deviceMockups = document.querySelectorAll('.device-mockup');
    deviceMockups.forEach(device => {
        device.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        device.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Stats counter animation
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
            const suffix = stat.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 100;
            const duration = 2000; // 2 seconds
            const stepTime = duration / 100;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString() + suffix;
            }, stepTime);
        });
    }
    
    // Observe stats section for animation trigger
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // Buy Now button functionality
    const buyNowBtn = document.querySelector('.btn-buy-now');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            console.log('Buy Now clicked');
            // Add your purchase flow logic here
        });
    }
    
    // Why Fedena section animations
    const whyFedenaSection = document.querySelector('.why-fedena-section');
    if (whyFedenaSection) {
        const whyFedenaObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate floating elements
                    const floatingElements = entry.target.querySelectorAll('.floating-elements > *');
                    floatingElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translate(0, 0) scale(1)';
                        }, index * 200);
                    });
                    
                    whyFedenaObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        whyFedenaObserver.observe(whyFedenaSection);
        
        // Initially hide floating elements
        const floatingElements = whyFedenaSection.querySelectorAll('.floating-elements > *');
        floatingElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translate(20px, 20px) scale(0.8)';
            element.style.transition = 'all 0.6s ease';
        });
    }
    
    // Modules section animations
    const modulesSection = document.querySelector('.modules-section');
    if (modulesSection) {
        const modulesObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate module cards
                    const moduleCards = entry.target.querySelectorAll('.module-card');
                    moduleCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    
                    modulesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        modulesObserver.observe(modulesSection);
        
        // Initially hide module cards
        const moduleCards = modulesSection.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });
    }
    
    // See All Features button
    const seeAllBtn = document.querySelector('.btn-see-all');
    if (seeAllBtn) {
        seeAllBtn.addEventListener('click', function() {
            console.log('See All Features clicked');
            // Add your navigation logic here
        });
    }
    
    // Module links
    const moduleLinks = document.querySelectorAll('.module-link');
    moduleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Module link clicked:', this.closest('.module-card').querySelector('.module-title').textContent);
            // Add your module detail navigation logic here
        });
    });
    
    // Features section animations
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
        const featuresObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate feature items
                    const featureItems = entry.target.querySelectorAll('.feature-item');
                    featureItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                    
                    featuresObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        featuresObserver.observe(featuresSection);
        
        // Initially hide feature items
        const featureItems = featuresSection.querySelectorAll('.feature-item');
        featureItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
        });
    }
    
    // Mobile app section animations
    const mobileAppSection = document.querySelector('.mobile-app-section');
    if (mobileAppSection) {
        const mobileAppObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate phone mockups
                    const phoneMockups = entry.target.querySelectorAll('.phone-mockup');
                    phoneMockups.forEach((phone, index) => {
                        setTimeout(() => {
                            phone.style.opacity = '1';
                            phone.style.transform = `translateY(${index === 1 ? '40px' : '0'}) scale(1)`;
                        }, index * 300);
                    });
                    
                    // Animate text content
                    const textContent = entry.target.querySelector('.mobile-app-text');
                    if (textContent) {
                        setTimeout(() => {
                            textContent.style.opacity = '1';
                            textContent.style.transform = 'translateX(0)';
                        }, 600);
                    }
                    
                    mobileAppObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        mobileAppObserver.observe(mobileAppSection);
        
        // Initially hide elements
        const phoneMockups = mobileAppSection.querySelectorAll('.phone-mockup');
        const textContent = mobileAppSection.querySelector('.mobile-app-text');
        
        phoneMockups.forEach(phone => {
            phone.style.opacity = '0';
            phone.style.transform = 'translateY(50px) scale(0.9)';
            phone.style.transition = 'all 0.8s ease';
        });
        
        if (textContent) {
            textContent.style.opacity = '0';
            textContent.style.transform = 'translateX(-30px)';
            textContent.style.transition = 'all 0.8s ease';
        }
    }
    
    // Explore APP Features button
    const exploreAppBtn = document.querySelector('.btn-explore-app');
    if (exploreAppBtn) {
        exploreAppBtn.addEventListener('click', function() {
            console.log('Explore APP Features clicked');
            // Add your app features navigation logic here
        });
    }
});
