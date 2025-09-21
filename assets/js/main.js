document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const anchorLinks = Array.from(navLinks).filter((link) => link.getAttribute('href').startsWith('#'));
    const trackedSections = anchorLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter((section) => section !== null);

    const hero = document.querySelector('.hero');
    const parallaxImage = document.querySelector('.parallax-image');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;

        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }

        if (parallaxImage) {
            const sectionTop = parallaxImage.closest('section').offsetTop;
            const speed = -0.2;
            const yPos = (scrollPosition - sectionTop) * speed;
            parallaxImage.style.transform = `translateY(${yPos}px)`;
        }
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
        });
    }

    navLinks.forEach((link) =>
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('mobile-active');
        })
    );

    const fadeInElements = document.querySelectorAll('.fade-in-element');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    fadeInElements.forEach((el) => {
        observer.observe(el);
    });

    if (trackedSections.length) {
        const updateActiveLink = () => {
            let current = trackedSections[0].getAttribute('id');
            const headerHeight = header.offsetHeight;

            trackedSections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - headerHeight - 10) {
                    current = section.getAttribute('id');
                }
            });

            anchorLinks.forEach((link) => {
                const targetId = link.getAttribute('href').substring(1);
                if (targetId === current) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const countObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;

                if (counter.innerText !== counter.getAttribute('data-target')) {
                    const target = Number(counter.getAttribute('data-target'));

                    const updateCount = () => {
                        const count = Number(counter.innerText);
                        const increment = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + increment);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };

                    updateCount();
                }

                observerInstance.unobserve(counter);
            }
        });
    }, { threshold: 0.8 });

    counters.forEach((counter) => {
        countObserver.observe(counter);
    });
});
