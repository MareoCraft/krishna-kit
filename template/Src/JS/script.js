/* =========================================================
   KRISHNA KIT DOCUMENTATION
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const docsSection = document.getElementById("docs");
    const docsBtn = document.getElementById("docsBtn");
    const getStartedBtn = document.getElementById("getStartedBtn");

    const copyButtons =
        document.querySelectorAll(".copy-btn");

    const fadeElements =
        document.querySelectorAll(".fade-up");

    const commandCards =
        document.querySelectorAll(".command-card");

    const referenceCards =
        document.querySelectorAll(".reference-card");


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    function scrollToDocs() {

        if (!docsSection) return;

        docsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    if (docsBtn) {
        docsBtn.addEventListener("click", () => {
            window.location.href = "https://krishna-kit.netlify.app";
        });
    }

    if (getStartedBtn) {

        getStartedBtn.addEventListener("click", () => {
            window.location.href = "https://krishna-kit.netlify.app";
        });
    }

    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        obs.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );

        fadeElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        fadeElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       STAGGER CARD ANIMATION
    ===================================================== */

    function staggerCards(cards) {

        cards.forEach((card, index) => {

            card.style.transitionDelay =
                `${index * 70}ms`;

        });

    }

    staggerCards(commandCards);
    staggerCards(referenceCards);


    /* =====================================================
       TERMINAL TYPING EFFECT
    ===================================================== */

    const terminalHighlight =
        document.querySelector(
            ".terminal-highlight"
        );

    if (terminalHighlight) {

        const text =
            terminalHighlight.textContent.trim();

        terminalHighlight.textContent = "";

        let index = 0;

        function typeTerminalText() {

            if (index >= text.length) {
                return;
            }

            terminalHighlight.textContent +=
                text[index];

            index++;

            setTimeout(
                typeTerminalText,
                55
            );
        }

        setTimeout(
            typeTerminalText,
            1000
        );
    }
});