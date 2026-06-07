document.addEventListener('DOMContentLoaded', () => {
  
  // 1. PRELOADER COUNTER LOGIC
  const preloader = document.getElementById('preloader');
  const counterText = document.getElementById('loader-counter');
  let count = 0;
  
  const counterInterval = setInterval(() => {
    count += Math.floor(Math.random() * 5) + 1;
    if (count >= 100) {
      count = 100;
      clearInterval(counterInterval);
      
      // Delay preloader fade-out slightly for visual polish
      setTimeout(() => {
        preloader.classList.add('preloader-hidden');
        document.body.style.overflow = 'auto'; // Re-enable scroll
        
        // Trigger reveal animations for hero section immediately
        revealElements();
      }, 500);
    }
    counterText.textContent = count;
  }, 40);

  // Disable scroll during preloader
  document.body.style.overflow = 'hidden';

  // 2. STICKY NAV & SCROLL TOP BUTTON
  const header = document.querySelector('header');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });

  // Scroll to Top action
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 3. MOBILE MENU TOGGLE
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    // Change menu icon if FontAwesome is loaded
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });

  // 4. 3D TILT EFFECT (Excluding automated Hero and About cards)
  const tiltCards = document.querySelectorAll('.tilt-card:not(#hero-tilt-card):not(#about-tilt-card)');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position inside element
      const y = e.clientY - rect.top;  // y position inside element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles (max 15 degrees)
      const rotateY = ((x - width / 2) / (width / 2)) * 15;
      const rotateX = -((y - height / 2) / (height / 2)) * 15;
      
      // Update CSS variables for radial glow
      card.style.setProperty('--glow-x', `${(x / width) * 100}%`);
      card.style.setProperty('--glow-y', `${(y / height) * 100}%`);
      
      // Apply 3D transform
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset card to default smooth transition state
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.setProperty('--glow-x', '50%');
      card.style.setProperty('--glow-y', '50%');
    });
  });

  // 5. SCROLL SPY ACTIVE NAV LINK
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // offset for sticky nav
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 6. INTERSECTION OBSERVER REVEAL ANIMATIONS
  const reveals = document.querySelectorAll('.reveal');
  
  function revealElements() {
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // Trigger when element top is at 82% of screen height
      if (elementTop < windowHeight * 0.85) {
        element.classList.add('active');
      }
    });
  }

  // Fallback direct check on scroll
  window.addEventListener('scroll', revealElements);

  // 7. INTERACTIVE CHAT ROOM
  const chatForm = document.getElementById('chat-form');
  const chatMessages = document.getElementById('chat-messages');
  const chatSubmitBtn = document.getElementById('chat-submit-btn');

  // Helper to append a new message bubble
  function appendMessage(sender, text, isSelf) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isSelf ? 'chat-bubble-sent' : 'chat-bubble-received'}`;
    bubble.innerHTML = `
      <strong>${sender}:</strong> <br>
      ${text}
    `;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll
  }

  // Helper to show typing animation
  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  // Handle message submission
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('chat-name');
      const emailInput = document.getElementById('chat-email');
      const msgInput = document.getElementById('chat-message');
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = msgInput.value.trim();
      
      if (!name || !email || !message) return;
      
      // Disable inputs temporarily
      chatSubmitBtn.disabled = true;
      chatSubmitBtn.innerHTML = 'Sending...';
      
      // Append user sent message
      appendMessage('You', message, true);
      
      // Clear input form
      nameInput.value = '';
      emailInput.value = '';
      msgInput.value = '';
      
      // Show Lavakush typing indicator
      const indicator = showTypingIndicator();
      
      // Web3Forms API Integration
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: "1c056151-757f-498e-9fe9-caeaef480ff9", // <-- Put your Web3Forms Access Key here!
          name: name,
          email: email,
          message: message,
          subject: `New Portfolio Message from ${name}`
        })
      })
      .then(async (response) => {
        let json = await response.json();
        indicator.remove();
        
        if (response.status === 200) {
          // Success State
          appendMessage('Lavakush', `Hi ${name}! Thanks for reaching out. I've received your message in my Gmail and will get back to you at <strong>${email}</strong> as soon as possible.`, false);
        } else {
          // Error State (e.g. key is not set yet)
          appendMessage('Lavakush', `Oops! I couldn't forward this to my Gmail because the Web3Forms Access Key isn't configured in script.js yet. Please email me directly at lkumar89971@gmail.com!`, false);
        }
        
        chatSubmitBtn.disabled = false;
        chatSubmitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      })
      .catch((error) => {
        indicator.remove();
        appendMessage('Lavakush', `Sorry ${name}, I encountered a network error while trying to send the email. Please check your internet connection or email me directly at lkumar89971@gmail.com!`, false);
        chatSubmitBtn.disabled = false;
        chatSubmitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      });
    });
  }

  // 8. TECH STACK SPECIFIC HOVER HIGHLIGHTS
  // Add CSS variable styling matching brands for skills
  const skillCards = document.querySelectorAll('.skill-card');
  const skillColors = {
    'python': { color: '#3776ab', shadow: 'rgba(55, 118, 171, 0.25)' },
    'android studio': { color: '#3ddc84', shadow: 'rgba(61, 220, 132, 0.25)' },
    'google ai studio': { color: '#4285f4', shadow: 'rgba(66, 133, 244, 0.25)' },
    'google cloud': { color: '#ea4335', shadow: 'rgba(234, 67, 53, 0.25)' },
    'salesforce': { color: '#00a1e0', shadow: 'rgba(0, 161, 224, 0.25)' },
    'generative ai': { color: '#a855f7', shadow: 'rgba(168, 85, 247, 0.25)' },
    'antigravity': { color: '#10b981', shadow: 'rgba(16, 185, 129, 0.25)' },
    'google skills': { color: '#f4b400', shadow: 'rgba(244, 180, 0, 0.25)' }
  };

  skillCards.forEach(card => {
    const techName = card.querySelector('span').textContent.toLowerCase().trim();
    const config = skillColors[techName];
    if (config) {
      card.style.setProperty('--skill-color', config.color);
      card.style.setProperty('--skill-shadow', config.shadow);
    } else {
      card.style.setProperty('--skill-color', 'var(--accent-primary)');
      card.style.setProperty('--skill-shadow', 'var(--glass-glow)');
    }
  });

  // 9. AUTOMATIC 3D TILT SWEEP & GLOW (Every 5 seconds loop, alternating every 2.5 seconds)
  function triggerAutoTurn() {
    const cards = document.querySelectorAll('#hero-tilt-card, #about-tilt-card');
    
    cards.forEach(card => {
      // 1. Start 360-degree Y-axis spin (Hero spins left-to-right, About spins right-to-left)
      const rotationAngle = card.id === 'about-tilt-card' ? -360 : 360;
      card.style.transition = 'transform 1.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
      card.style.transform = `rotateY(${rotationAngle}deg) scale3d(1.02, 1.02, 1.02)`;

      // Reset card transform to 0deg instantly after spin completes
      setTimeout(() => {
        card.style.transition = 'none';
        card.style.transform = 'rotateY(0deg) scale3d(1, 1, 1)';
      }, 1600);

      // 2. Start Border Glow Sweep immediately after the turn ends (1.6s)
      setTimeout(() => {
        card.classList.add('glowing');
        runGlowAlongBorder(card);
      }, 1600);
    });
  }

  function runGlowAlongBorder(card) {
    let startTime = null;
    const duration = 2000; // 2 seconds to trace the border perimeter
    
    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const t = Math.min(progress / duration, 1);
      
      let x, y;
      if (t < 0.25) {
        // Top edge: (0, 0) -> (100, 0)
        const p = t / 0.25;
        x = p * 100;
        y = 0;
      } else if (t < 0.50) {
        // Right edge: (100, 0) -> (100, 100)
        const p = (t - 0.25) / 0.25;
        x = 100;
        y = p * 100;
      } else if (t < 0.75) {
        // Bottom edge: (100, 100) -> (0, 100)
        const p = (t - 0.50) / 0.25;
        x = 100 - (p * 100);
        y = 100;
      } else {
        // Left edge: (0, 100) -> (0, 0)
        const p = (t - 0.75) / 0.25;
        x = 0;
        y = 100 - (p * 100);
      }
      
      card.style.setProperty('--glow-x', `${x}%`);
      card.style.setProperty('--glow-y', `${y}%`);
      
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        resetAutoTurnStyles(card);
      }
    }
    
    requestAnimationFrame(animate);
  }

  function resetAutoTurnStyles(card) {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.setProperty('--glow-x', '50%');
    card.style.setProperty('--glow-y', '50%');
    card.style.transition = '';
    card.classList.remove('glowing');
  }

  // Trigger auto-turn loop every 5 seconds (5,000 ms)
  setInterval(triggerAutoTurn, 5000);

});
