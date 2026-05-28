// LOVE COUNTER

const startDate = new Date("2026-04-29T00:00:00");
const entryPassword = "29042026";
const entryGate = document.getElementById("entryGate");
const siteContent = document.getElementById("siteContent");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const gateError = document.getElementById("gateError");
const typingText = document.getElementById("typingText");
const starsContainer = document.querySelector(".stars");
const customCursor = document.querySelector(".custom-cursor");
const loveButton = document.getElementById("loveBtn");
const loveModal = document.getElementById("loveModal");

const typingMessage = "One month in, and I'm still falling for you every day 💕";
let typingIndex = 0;

function unlockSite(){

    entryGate.hidden = true;
    siteContent.hidden = false;

}

// Try to play background audio when the site is unlocked (user gesture)
;(function enhanceUnlockAutoplay(){
    const originalUnlock = unlockSite;

    window.unlockSite = function(){
        originalUnlock();

        const audio = document.getElementById('backgroundAudio');
        const toggle = document.getElementById('musicToggle');

        if(audio){
            // user-initiated unlock — browsers allow play()
            audio.play().catch(()=>{}).then(()=>{
                if(toggle){
                    toggle.innerHTML = '⏸️';
                    toggle.classList.add('is-playing');
                    toggle.setAttribute('aria-pressed','true');
                    toggle.title = 'Pause music';
                }
            });
        }

    };

})();

localStorage.removeItem("shayontiUnlocked");

function startTypingAnimation(){

    if(!typingText){
        return;
    }

    typingIndex = 0;
    typingText.textContent = "";

    const typingInterval = setInterval(()=>{

        typingText.textContent += typingMessage.charAt(typingIndex);
        typingIndex += 1;

        if(typingIndex >= typingMessage.length){

            clearInterval(typingInterval);

        }

    }, 45);

}

function createStars(){

    if(!starsContainer){
        return;
    }

    const starCount = 18;

    for(let index = 0; index < starCount; index += 1){

        const star = document.createElement("span");
        const size = 12 + Math.random() * 18;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 4 + Math.random() * 5;
        const delay = Math.random() * 4;

        star.className = "star";
        star.style.setProperty("--size", `${size}px`);
        star.style.setProperty("--fontSize", `${size}px`);
        star.style.setProperty("--left", `${left}%`);
        star.style.setProperty("--top", `${top}%`);
        star.style.setProperty("--duration", `${duration}s`);
        star.style.setProperty("--delay", `${delay}s`);

        starsContainer.appendChild(star);

    }

}

function setupLoveStoryAnimations(){

    const loveStorySection = document.querySelector(".timeline");

    if(!loveStorySection){
        return;
    }

    const animatedElements = [
        loveStorySection.querySelector("h2"),
        ...loveStorySection.querySelectorAll(".card"),
    ].filter(Boolean);

    animatedElements.forEach((element, index)=>{

        element.classList.add("story-reveal");
        element.style.setProperty("--reveal-delay", `${index * 120}ms`);

    });

    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)){

        animatedElements.forEach((element)=>{
            element.classList.add("is-visible");
        });

        return;

    }

    const revealObserver = new IntersectionObserver((entries, observer)=>{

        entries.forEach((entry)=>{

            if(entry.isIntersecting){

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
    });

    animatedElements.forEach((element)=>{
        revealObserver.observe(element);
    });

}

function setupCustomCursor(){

    if(!customCursor || window.matchMedia("(pointer: coarse)").matches){
        return;
    }

    const moveCursor = (event) => {

        customCursor.style.left = `${event.clientX}px`;
        customCursor.style.top = `${event.clientY}px`;

    };

    document.addEventListener("mousemove", moveCursor);

    document.addEventListener("mousedown", ()=>{

        customCursor.classList.add("is-active");

    });

    document.addEventListener("mouseup", ()=>{

        customCursor.classList.remove("is-active");

    });

    document.addEventListener("mouseleave", ()=>{

        customCursor.classList.add("is-hidden");

    });

    document.addEventListener("mouseenter", ()=>{

        customCursor.classList.remove("is-hidden");

    });

    document.addEventListener("mouseover", (event)=>{

        const interactiveTarget = event.target.closest("button, input, video");
        customCursor.classList.toggle("is-hovering", Boolean(interactiveTarget));

    });

}

function openLoveModal(){

    if(!loveModal){
        return;
    }

    loveModal.hidden = false;
    requestAnimationFrame(()=>{
        loveModal.classList.add("is-open");
    });

    document.body.classList.add("modal-open");

}

function closeLoveModal(){

    if(!loveModal || loveModal.hidden){
        return;
    }

    loveModal.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    window.setTimeout(()=>{
        if(loveModal){
            loveModal.hidden = true;
        }
    }, 220);

}

if(loveButton){

    loveButton.addEventListener("click", openLoveModal);

}

document.addEventListener("click", (event)=>{

    const closeTrigger = event.target.closest("[data-close-love-modal]");

    if(closeTrigger){
        closeLoveModal();
    }

});

document.addEventListener("keydown", (event)=>{

    if(event.key === "Escape"){
        closeLoveModal();
    }

});

passwordForm.addEventListener("submit",(event)=>{

    event.preventDefault();

    const enteredPassword = passwordInput.value.trim();

    if(enteredPassword === entryPassword){

        gateError.textContent = "";
        unlockSite();

    }else{

        gateError.textContent = "Wrong password. Try again 💕";
        passwordInput.value = "";
        passwordInput.focus();

    }

});

createStars();
setupCustomCursor();
startTypingAnimation();
setupLoveStoryAnimations();

function updateCounter(){

    const now = new Date();

    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("counter").innerHTML =
    `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds 💖`;
}

setInterval(updateCounter,1000);

updateCounter();

// Music toggle (play / pause)
(function setupMusicToggle(){
    const audio = document.getElementById('backgroundAudio');
    const toggle = document.getElementById('musicToggle');
    const toggleHero = document.getElementById('musicToggleHero');
    const heroLabel = document.querySelector('.music-inline__label');

    if(!audio || (!toggle && !toggleHero)){
        return;
    }

    // Update both controls to reflect audio state
    function updateButtons(){
        const isPlaying = !audio.paused;

        [toggle, toggleHero].forEach((btn)=>{
            if(!btn) return;
            if(isPlaying){
                btn.innerHTML = '⏸️';
                btn.classList.add('is-playing');
                btn.setAttribute('aria-pressed','true');
                btn.title = 'Pause music';
            } else {
                btn.innerHTML = '▶️';
                btn.classList.remove('is-playing');
                btn.setAttribute('aria-pressed','false');
                btn.title = 'Play music';
            }
        });

        if(heroLabel){
            heroLabel.textContent = isPlaying ? 'paus' : 'play';
        }
    }

    // Try to play (may be blocked); then update UI
    Promise.resolve().then(()=>{
        return audio.play().catch(()=>{});
    }).finally(()=>{
        updateButtons();
    });

    function toggleAudio(){
        try{
            if(audio.paused){
                audio.play();
            } else {
                audio.pause();
            }
        }catch(e){}

        setTimeout(updateButtons, 60);
    }

    if(toggle){ toggle.addEventListener('click', toggleAudio); }
    if(toggleHero){ toggleHero.addEventListener('click', toggleAudio); }

    // Keep buttons in sync if audio state changes elsewhere
    audio.addEventListener('play', updateButtons);
    audio.addEventListener('pause', updateButtons);

})();

// Adjust gallery layout when there's only a single photo
(function adjustGalleryForSingle(){
    const gallery = document.querySelector('.couple-gallery');

    if(!gallery) return;

    const childCount = Array.from(gallery.children).filter(n => n.nodeType === 1).length;

    if(childCount === 1){
        gallery.classList.add('single-photo');
    } else {
        gallery.classList.remove('single-photo');
    }

})();

