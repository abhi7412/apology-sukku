/**
 * Special Apology Microsite - Core Interactive Logic & State Machine
 */

(function () {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
    introLoadingText: "Loading something special for you",
    landingTypewriterText: "Tap below, okay? ✨",
    letterSignature: "Always yours 💕",
    finalSignature: "Always 💕",
    introDurationMs: 3400,
    typingSpeedMs: 45
  };

  // --- Elements ---
  const introOverlay = document.getElementById('introOverlay');
  const introTypingContent = document.getElementById('introTypingContent');
  const landingTypewriterText = document.getElementById('landingTypewriterText');
  const btnOpenThis = document.getElementById('btnOpenThis');

  const screens = {
    landing: document.getElementById('screenLanding'),
    letter: document.getElementById('screenLetter'),
    playlist: document.getElementById('screenPlaylist'),
    cards: document.getElementById('screenCards'),
    final: document.getElementById('screenFinal')
  };

  // Screen 2: Envelope & Letter Elements
  const envelopeInteractive = document.getElementById('envelopeInteractive');
  const envelopeView = document.getElementById('envelopeView');
  const openedLetterView = document.getElementById('openedLetterView');
  const letterSignatureTyped = document.getElementById('letterSignatureTyped');
  const letterContinueBox = document.getElementById('letterContinueBox');
  const btnLetterContinue = document.getElementById('btnLetterContinue');

  // Screen 3: Playlist Elements
  const btnPlaylistContinue = document.getElementById('btnPlaylistContinue');
  const cassetteCards = document.querySelectorAll('.cassette-card');
  const audioTracks = [
    document.getElementById('audioTrack0'),
    document.getElementById('audioTrack1'),
    document.getElementById('audioTrack2')
  ];
  let currentPlayingTrackIdx = null;

  // Screen 4: Cards Elements
  const cardBoxes = document.querySelectorAll('.card-perspective-box');
  const btnCardsContinue = document.getElementById('btnCardsContinue');

  // Screen 5: Final Letter Elements
  const finalUnsealedView = document.getElementById('finalUnsealedView');
  const finalSealedView = document.getElementById('finalSealedView');
  const sealingModal = document.getElementById('sealingModal');
  const btnSealIt = document.getElementById('btnSealIt');
  const btnFinalRestart = document.getElementById('btnFinalRestart');
  const btnReplayWholeSite = document.getElementById('btnReplayWholeSite');
  const sealedSignatureTyped = document.getElementById('sealedSignatureTyped');
  const currentDateDisplay = document.getElementById('currentDateDisplay');

  // --- Helper: Typewriter Engine ---
  function typeText(targetElement, fullText, speed = CONFIG.typingSpeedMs, callback) {
    if (!targetElement) return;
    targetElement.textContent = '';
    let index = 0;
    const interval = setInterval(() => {
      index++;
      targetElement.textContent = fullText.slice(0, index);
      if (index >= fullText.length) {
        clearInterval(interval);
        if (typeof callback === 'function') callback();
      }
    }, speed);
  }

  // --- Helper: Sparkle Particle Generator ---
  function createSparkles(parentElement, count = 8) {
    if (!parentElement) return;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      sparkle.textContent = ['✨', '💖', '⭐', '💫'][Math.floor(Math.random() * 4)];
      
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const distance = 40 + Math.random() * 70;
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance}px`;
      
      sparkle.style.setProperty('--dx', dx);
      sparkle.style.setProperty('--dy', dy);
      sparkle.style.left = '50%';
      sparkle.style.top = '50%';
      
      parentElement.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    }
  }

  // --- Navigation Function ---
  function switchScreen(screenKey) {
    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Object.keys(screens).forEach(key => {
      if (key === screenKey) {
        screens[key].style.display = 'flex';
        setTimeout(() => {
          screens[key].classList.add('active');
        }, 30);
      } else {
        screens[key].classList.remove('active');
        setTimeout(() => {
          if (!screens[key].classList.contains('active')) {
            screens[key].style.display = 'none';
          }
        }, 400);
      }
    });
  }

  // --- 1. INTRO FLOW ---
  function startIntro() {
    introOverlay.classList.remove('fade-out');
    typeText(introTypingContent, CONFIG.introLoadingText, 50);

    setTimeout(() => {
      introOverlay.classList.add('fade-out');
      startLanding();
    }, CONFIG.introDurationMs);
  }

  function startLanding() {
    switchScreen('landing');
    setTimeout(() => {
      typeText(landingTypewriterText, CONFIG.landingTypewriterText, 45);
    }, 400);
  }

  // --- 2. LANDING -> LETTER ---
  btnOpenThis.addEventListener('click', () => {
    switchScreen('letter');
    resetEnvelope();
  });

  // --- 3. ENVELOPE INTERACTION ---
  function resetEnvelope() {
    envelopeView.style.display = 'block';
    openedLetterView.style.display = 'none';
    letterContinueBox.style.display = 'none';
    envelopeInteractive.classList.remove('opening', 'opened');
  }

  envelopeInteractive.addEventListener('click', () => {
    if (envelopeInteractive.classList.contains('opening') || envelopeInteractive.classList.contains('opened')) return;

    createSparkles(envelopeInteractive, 12);
    envelopeInteractive.classList.add('opening');

    setTimeout(() => {
      envelopeInteractive.classList.add('opened');
      
      setTimeout(() => {
        envelopeView.style.display = 'none';
        openedLetterView.style.display = 'block';
        openedLetterView.style.opacity = '0';
        openedLetterView.style.transform = 'translateY(15px)';
        openedLetterView.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
          openedLetterView.style.opacity = '1';
          openedLetterView.style.transform = 'translateY(0)';
          
          // Type signature
          typeText(letterSignatureTyped, CONFIG.letterSignature, 50, () => {
            letterContinueBox.style.display = 'block';
          });
        }, 50);
      }, 500);
    }, 600);
  });

  btnLetterContinue.addEventListener('click', () => {
    switchScreen('playlist');
  });

  // --- 4. CASSETTE MIXTAPE AUDIO PLAYER ---
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function pauseAllTracks() {
    audioTracks.forEach((audio, idx) => {
      if (audio) {
        audio.pause();
        const card = cassetteCards[idx];
        if (card) {
          card.classList.remove('is-active', 'is-playing');
          const btn = card.querySelector('.btn-play-pause');
          if (btn) btn.textContent = '▶';
        }
      }
    });
    currentPlayingTrackIdx = null;
  }

  function toggleTrack(trackIdx) {
    const audio = audioTracks[trackIdx];
    const card = cassetteCards[trackIdx];
    const btn = card.querySelector('.btn-play-pause');

    if (currentPlayingTrackIdx === trackIdx && !audio.paused) {
      // Pause current
      audio.pause();
      card.classList.remove('is-playing');
      btn.textContent = '▶';
    } else {
      // Pause other tracks
      pauseAllTracks();

      // Play selected
      currentPlayingTrackIdx = trackIdx;
      card.classList.add('is-active', 'is-playing');
      btn.textContent = '❚❚';

      audio.play().catch(err => {
        console.warn('Playback error / gesture required:', err);
        card.classList.remove('is-playing');
        btn.textContent = '▶';
      });
    }
  }

  cassetteCards.forEach((card, idx) => {
    const audio = audioTracks[idx];
    const btn = card.querySelector('.btn-play-pause');
    const progressBar = card.querySelector('.cassette-progress-bar');
    const progressFill = card.querySelector('.cassette-progress-fill');
    const timeCurrent = card.querySelector('.time-current');
    const timeDuration = card.querySelector('.time-duration');

    // Click anywhere on card (except progress bar)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.cassette-progress-bar')) return;
      toggleTrack(idx);
    });

    // Audio metadata loaded
    audio.addEventListener('loadedmetadata', () => {
      timeDuration.textContent = formatTime(audio.duration);
    });

    // Audio time update
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeCurrent.textContent = formatTime(audio.currentTime);
        timeDuration.textContent = formatTime(audio.duration);
      }
    });

    // Audio ended
    audio.addEventListener('ended', () => {
      card.classList.remove('is-playing');
      btn.textContent = '▶';
      progressFill.style.width = '0%';
      timeCurrent.textContent = '0:00';
    });

    // Scrubbing on progress bar
    progressBar.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      if (audio.duration) {
        audio.currentTime = ratio * audio.duration;
      }
    });
  });

  btnPlaylistContinue.addEventListener('click', () => {
    switchScreen('cards');
  });

  // --- 5. 3D MEMORY FLIP CARDS ---
  cardBoxes.forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('flipped');
    });
  });

  btnCardsContinue.addEventListener('click', () => {
    switchScreen('final');
  });

  // --- 6. FINAL LOVE LETTER & WAX SEALING FINALE ---
  btnSealIt.addEventListener('click', () => {
    sealingModal.classList.add('active');

    setTimeout(() => {
      sealingModal.classList.remove('active');
      finalUnsealedView.style.display = 'none';
      finalSealedView.style.display = 'block';

      // Set formatted localized date
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      currentDateDisplay.textContent = now.toLocaleDateString('en-US', options);

      // Typewriter sealed signature
      typeText(sealedSignatureTyped, CONFIG.finalSignature, 55);
    }, 1400);
  });

  btnFinalRestart.addEventListener('click', () => {
    restartEntireExperience();
  });

  btnReplayWholeSite.addEventListener('click', () => {
    restartEntireExperience();
  });

  function restartEntireExperience() {
    pauseAllTracks();
    resetEnvelope();
    cardBoxes.forEach(b => b.classList.remove('flipped'));
    finalUnsealedView.style.display = 'block';
    finalSealedView.style.display = 'none';
    
    // Restart from intro
    startIntro();
  }

  // --- Initial Launch ---
  startIntro();

})();
