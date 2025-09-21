document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const parallaxImage = document.querySelector('.parallax-image');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const anchorLinks = Array.from(navLinks).filter((link) => {
        const href = link.getAttribute('href');
        return Boolean(href) && href.startsWith('#');
    });

    const trackedSections = anchorLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter((section) => section !== null);

    const setHeaderAppearance = () => {
        if (!header) return;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    const applyParallax = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        if (hero) {
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }

        if (parallaxImage) {
            const section = parallaxImage.closest('section');
            if (section) {
                const sectionTop = section.offsetTop;
                const speed = -0.2;
                const yPos = (scrollPosition - sectionTop) * speed;
                parallaxImage.style.transform = `translateY(${yPos}px)`;
            }
        }
    };

    const closeMobileMenu = () => {
        if (!hamburger || !navMenu) return;
        hamburger.classList.remove('active');
        navMenu.classList.remove('mobile-active');
        document.body.classList.remove('nav-open');
    };

    const toggleMobileMenu = () => {
        if (!hamburger || !navMenu) return;
        const isActive = hamburger.classList.toggle('active');
        navMenu.classList.toggle('mobile-active', isActive);
        document.body.classList.toggle('nav-open', isActive);
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    anchorLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offset = headerHeight + 16;

            window.scrollTo({
                top: targetPosition - offset,
                behavior: 'smooth',
            });
        });
    });

    const fadeInElements = document.querySelectorAll('.fade-in-element');
    if (fadeInElements.length) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, observerOptions);

        fadeInElements.forEach((element) => observer.observe(element));
    }

    if (trackedSections.length) {
        const updateActiveLink = () => {
            const headerHeight = header ? header.offsetHeight : 0;
            let currentId = trackedSections[0].getAttribute('id');

            trackedSections.forEach((section) => {
                if (!section) return;
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - headerHeight - 20) {
                    currentId = section.getAttribute('id');
                }
            });

            anchorLinks.forEach((link) => {
                const targetId = link.getAttribute('href')?.substring(1);
                if (!targetId) return;
                if (targetId === currentId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length) {
        const speed = 200;
        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const targetValue = Number(counter.getAttribute('data-target'));
                if (!Number.isFinite(targetValue)) {
                    observer.unobserve(counter);
                    return;
                }

                const updateCount = () => {
                    const current = Number(counter.innerText);
                    const increment = targetValue / speed;

                    if (current < targetValue) {
                        counter.innerText = Math.ceil(current + increment);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = targetValue.toString();
                    }
                };

                if (counter.innerText !== counter.getAttribute('data-target')) {
                    updateCount();
                }

                observer.unobserve(counter);
            });
        }, { threshold: 0.6 });

        counters.forEach((counter) => countObserver.observe(counter));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });

    setHeaderAppearance();
    applyParallax();

    window.addEventListener('scroll', () => {
        setHeaderAppearance();
        applyParallax();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
});
