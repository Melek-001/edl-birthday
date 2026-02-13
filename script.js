const state = {
    section: 'landing', // landing, quiz, paradise, cta, cake-section
    quizStep: 0,
};

const elements = {
    landing: document.getElementById('landing'),
    quiz: document.getElementById('quiz'),
    paradise: document.getElementById('paradise'),
    letterPopup: document.getElementById('letter-popup'),
    cta: document.getElementById('cta'),
    landingText: document.getElementById('landing-text'),
    proveBtn: document.getElementById('prove-it-btn'),
    quizQuestion: document.getElementById('quiz-question'),
    quizOptions: document.getElementById('quiz-options'),
    quizFeedback: document.getElementById('quiz-feedback'),
    letterBody: document.querySelector('.letter-body'),
    closeLetterBtn: document.getElementById('close-letter-btn'),
    finishBtn: document.getElementById('finish-btn')
};

// Data
const quizData = [
    {
        q: "What was the name of the movie we watched together?",
        options: ["Avatar", "Zootopia", "Now you see me", "Kung fu panda"],
        correct: 2 // Index of 'Now you see me'
    },
    {
        q: "Who is my favorite artist?",
        options: ["J Cole", "Adele", "Drake", "All"],
        correct: 3 // Index of 'All'
    },
    {
        q: "Who do you love the most?",
        options: ["Donald Trump", "💗Melek", "Abiy Ahmed", "Osama bin laden", "All"],
        correct: 1 // Index of 'Melek'
    }
];

const letterContent = [
    `First of all sorry for not bringing you anything i had plans but it got messed up as you know so sorry for that but i had to improvise and i guess this is it🤷‍♂️ (*ehmmm voice clearing) bout to lock in rn`,

    `<strong>Subject: Sentimental Birthday wish letter</strong><br>
    Dear Edlawit Sintayehu,`,

    `As of today the DOA (Department of Abemelek) acknowledges your 22 years of serving the universe and i would like to congratulate you on that🥳. Also you've served our department since 2022 if i'm not mistaken so this makes your 4th year with us which is crazy because the way you were stressing the department we never thought we would keep you with us for this long but i guess the man up above got other plans and it wasn't THAT bad if i'm being honest.`,

    `Now let's reflect on your personality from start to now and how it should be in the future (if you want to extend your contract that is).
    When you joined our cool, classy, funny (and more) department, It was by a mutual agent at that time which is crazy when looking back to those days but since that moment the department have seen all your sides of personality starting from the sweet(የቀመሰ ያውቀዋል😂), loving, considerate side to the <span class="highlight hover-trigger" data-msg="Still love this side 😏">bitch</span> you are today.`,

    `Let's start with something that we don't support as a department from your personality which is the ብር ለምኔ behavior which is the unnecessary spending habit of yours which somehow affects the department too because the department head expects you to spoil him like a sugar mommy which you haven't done till this day but hopefully waiting you would do that one day. When we round back to our matter at hand which is your spending habit that raised serious issues with the department because we wish you all the best and we really care about your future even though we don't show it, so as a word of advice be intentional with your money make sure to spend with a valid reason and think about "would i be in trouble after 2 weeks because i spent this". Don't take this the wrong way because i only give advices to the people i actually care about if not i could just support your delulu.`,

    `Now the good part, I'm always amazed by how much a person could be kind like genuinely kind from the bottom of the heart which you showed me multiple times that it is possible, which i refuse to accept because i convinced myself years ago that if someone is nice to you then there must be a hidden agenda behind it and as much as i hate to accept it you proved me wrong multiple times so kudos to you for that (also start being nice to me like damn i'm tired of the bullying).`,

    `The reason I don't want to write a sentimental letter is not because i can't It's because idk when to stop so i could write a whole book right now but i'll do that for the funeral😌. Anyways i'm glad that the nicest, loving, yapper, funniest(not like me tho) person is my friend so i wish you all the best things that a person could achieve in a lifetime may God be with you everywhere you go, loved every single second of the time we spent together, more memories up ahead, love ya and Happy birthday Ms.Edlawit Sintayehu🎂❤️`
];

// Utils
function typeWriter(element, text, speed = 50, callback) {
    let index = 0;
    element.innerHTML = "";

    function type() {
        if (index < text.length) {
            // Handle HTML tags (don't type them char by char)
            if (text.charAt(index) === '<') {
                let endIndex = text.indexOf('>', index);
                if (endIndex !== -1) {
                    element.innerHTML += text.substring(index, endIndex + 1);
                    index = endIndex + 1;
                    setTimeout(type, speed);
                    return;
                }
            }

            if (text.charAt(index) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(index);
            }
            index++;
            setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    type();
}

function switchSection(hideId, showId) {
    document.getElementById(hideId).classList.remove('active-section');
    document.getElementById(hideId).classList.add('hidden-section');

    document.getElementById(showId).classList.remove('hidden-section');
    document.getElementById(showId).classList.add('active-section');
    state.section = showId; // Update state
}

// Flow Logic
function init() {
    // 1. Landing
    const hookText = "Wait… are you really Edlawit Sintayew?";
    typeWriter(elements.landingText, hookText, 60, () => {
        elements.proveBtn.classList.remove('hidden');
        elements.proveBtn.classList.add('visible');

        // Show Music Button too
        const playBtn = document.getElementById('play-music-btn');
        if (playBtn) {
            playBtn.classList.remove('hidden');
            playBtn.classList.add('visible');

            playBtn.addEventListener('click', () => {
                const audio = document.getElementById('bg-music');
                audio.play().then(() => {
                    playBtn.innerHTML = "🎵 Playing...";
                    playBtn.style.opacity = "0.5";
                    playBtn.style.pointerEvents = "none";
                }).catch(e => console.log("Audio play failed:", e));
            });
        }
    });

    elements.proveBtn.addEventListener('click', () => {
        // Just fade out landing, and init quiz
        elements.landing.classList.add('hidden-section');
        switchSection('landing', 'quiz');
        loadQuizQuestion(0);
    });
}

// Quiz Logic
function loadQuizQuestion(index) {
    state.quizStep = index;
    const data = quizData[index];
    elements.quizQuestion.innerText = data.q;
    elements.quizOptions.innerHTML = '';

    data.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'quiz-btn';
        btn.onclick = () => checkAnswer(i, data.correct);
        elements.quizOptions.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        // Correct
        if (state.quizStep < quizData.length - 1) {
            loadQuizQuestion(state.quizStep + 1);
        } else {
            // All Correct -> Go to Paradise
            switchSection('quiz', 'paradise');
            initParadise();
        }
    } else {
        // Wrong
        const container = document.querySelector('.quiz-container');
        container.classList.add('shake');
        elements.quizFeedback.innerText = "Wrong! Start over 😈";
        elements.quizFeedback.style.color = "red";
        elements.quizFeedback.classList.remove('hidden');
        elements.quizFeedback.classList.add('visible');

        setTimeout(() => {
            container.classList.remove('shake');
            elements.quizFeedback.classList.add('hidden');
            loadQuizQuestion(0); // Reset
        }, 1000);
    }
}

// Paradise, Plane Journey & Unboxing Logic
function initParadise() {
    // Start "Follow Me" Flight
    setTimeout(flyPlaneToIsland, 1000);
}

function flyPlaneToIsland() {
    const plane = document.getElementById('plane-carrier');
    const paradise = document.getElementById('paradise');
    const islandContainer = document.querySelector('.island-container');

    // Animation Config
    let progress = 0;
    const duration = 400; // frames (approx 6-7 seconds)

    const startTop = 5; // %
    const endTop = 80; // % (Land on island)

    const startLeft = 10; // %
    const endLeft = 50; // % (Center)

    function animate() {
        if (progress >= 1) {
            // Landed
            showPackagePopup();
            return;
        }

        progress += 0.003; // Speed

        // Calculate Position
        const currentTop = startTop + (progress * (endTop - startTop));
        const currentLeft = startLeft + (progress * (endLeft - startLeft));

        // Apply to Plane
        if (plane) {
            plane.style.top = `${currentTop}%`;
            plane.style.left = `${currentLeft}%`;
            // Tilt
            plane.style.transform = `translateX(-50%) rotate(${progress * 10}deg)`;

            // CAMERA FOLLOW
            // Scroll the window so the plane stays vertically centered (or slightly above center)
            const planeRect = plane.getBoundingClientRect();
            const absolutePlaneTop = plane.offsetTop;

            // Desired Scroll Position: Plane is at 30% of viewport height
            // ScrollY = PlaneAbsoluteTop - (WindowHeight * 0.3)
            const targetScroll = absolutePlaneTop - (window.innerHeight * 0.3);

            window.scrollTo(0, targetScroll);
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Removing old checkPlaneJourney since we are using autonomous flight
function checkPlaneJourney() {
    // Deprecated
}

function showPackagePopup() {
    const popup = document.getElementById('package-trigger');
    popup.classList.remove('hidden');

    const btn = popup.querySelector('.open-pkg-btn');
    btn.onclick = () => {
        // Show Unboxing Modal
        elements.letterPopup.classList.remove('hidden');
        initUnboxing();
    };
}

function initUnboxing() {
    const giftBox = document.getElementById('gift-box');
    const letterContainer = document.getElementById('letter-container');

    giftBox.onclick = () => {
        // 1. Open Box Animation
        giftBox.classList.add('open');

        // 2. Show Letter after delay w/ NO TYPEWRITER (Instant)
        setTimeout(() => {
            letterContainer.classList.remove('hidden');
            displayLetter();
        }, 1200);
    };
}

function displayLetter() {
    // Just inject HTML. No typing. 
    elements.letterBody.innerHTML = letterContent.map(para => `<p>${para}</p>`).join('');

    // Micro-interactions enable
    finishLetter();
}

function finishLetter() {
    // Enable micro-interactions (bitch tooltip)
    const paragraphs = elements.letterBody.querySelectorAll('p');
    if (paragraphs.length > 3) {
        const para4 = paragraphs[3];
        para4.innerHTML = para4.innerHTML.replace('bitch', '<span class="highlight hover-trigger" data-msg="Still love this side 😏">bitch</span>');

        // Add listeners
        const hoverTriggers = document.querySelectorAll('.hover-trigger');
        hoverTriggers.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                showTooltip(e.target, e.target.dataset.msg);
            });
            el.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        });
    }

    // Show continue button after short delay
    setTimeout(() => {
        elements.closeLetterBtn.classList.remove('hidden');
    }, 1000);
}

function showTooltip(target, text) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.background = 'white';
        tooltip.style.color = 'black';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '1001';
        document.body.appendChild(tooltip);
    }
    const rect = target.getBoundingClientRect();
    tooltip.innerText = text;
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.display = 'block';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

elements.closeLetterBtn.addEventListener('click', () => {
    elements.letterPopup.classList.add('hidden');
    switchSection('paradise', 'cta');
});

// CTA Logic
elements.finishBtn.addEventListener('click', () => {
    // Go to Cake Section
    switchSection('cta', 'cake-section');
    initCake();
});

function initCake() {
    const blowBtn = document.getElementById('blow-candle-btn');
    const flame = document.querySelector('.flame');
    const revealDiv = document.getElementById('final-reveal');
    const finalMsg = document.getElementById('final-message');
    const wishText = document.getElementById('wish-text');

    blowBtn.addEventListener('click', () => {
        // Blow out candle
        if (flame) {
            flame.style.opacity = '0';
            flame.style.animation = 'none';
        }
        wishText.innerText = "YAAAY! 🥳";

        // Hide button
        blowBtn.style.display = 'none';

        // Massive Confetti
        confettiRain();

        // Show Reveal
        setTimeout(() => {
            revealDiv.classList.remove('hidden');
            typeWriter(finalMsg, "Happy 22nd Birthday Edl 💗", 100);
        }, 1000);
    });
}

function confettiRain() {
    var count = 300;
    var defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55, });
    fire(0.2, { spread: 60, });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45, });
}

// ==========================
// Privacy / Anti-Copy protection
// ==========================
document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function (e) {
    // Prevent F12, Ctrl+U, Ctrl+S
    if (e.key === 'F12' ||
        (e.ctrlKey && (e.key === 'u' || e.key === 's')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

// Start
init();
