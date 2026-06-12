// ==========================================
// CARGABYTE - SCRIPT PRINCIPAL
// ==========================================

(() => {
  'use strict';

  // ==========================================
  // NAVBAR & MENUS
  // ==========================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    const toggleMenu = (action) => {
      hamburger.classList[action]('open');
      navLinks.classList[action]('open');
    };

    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? toggleMenu('remove') : toggleMenu('add');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu('remove'));
    });
  }

  // ==========================================
  // REDIRECIONAMENTO DE BOTÕES (MAPEADO)
  // ==========================================
  const rotasBotoes = {
    '.btn-nav': 'login.html',
    '.btn-primary': 'register.html',
    '.btn-secondary': 'saiba-mais.html'
  };

  Object.entries(rotasBotoes).forEach(([seletor, url]) => {
    const botao = document.querySelector(seletor);
    if (botao) {
      botao.addEventListener('click', () => window.location.href = url);
    }
  });

  // ==========================================
  // REVEAL ON SCROLL
  // ==========================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // ==========================================
  // FUNÇÃO CONTADOR (ANIMATE COUNT)
  // ==========================================
  const animateCount = (el, target, duration, suffix = '') => {
    if (!el) return;
    let start = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }

      const value = Math.floor(start);
      if (target >= 1000000) {
        el.textContent = `${(value / 1000000).toFixed(1)}M+`;
      } else if (target >= 1000) {
        el.textContent = `${value.toLocaleString('pt-BR')}+`;
      } else {
        el.textContent = value + suffix;
      }
    }, 16);
  };

  // ==========================================
  // INTERSECTION OBSERVER PARA CONTADORES (UNIFICADO)
  // ==========================================
  const setupCounterObserver = (seletorElemento, threshold, callback) => {
    const elemento = document.querySelector(seletorElemento) || document.getElementById(seletorElemento);
    if (!elemento) return;

    let executado = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !executado) {
        executado = true;
        callback();
        observer.unobserve(elemento);
      }
    }, { threshold });

    observer.observe(elemento);
  };

  // Inicializando contadores do Hero
  setupCounterObserver('.hero-stats', 0.5, () => {
    animateCount(document.getElementById('cnt-entregas'), 2400000, 1800);
    animateCount(document.getElementById('cnt-empresas'), 8700, 1800);
    animateCount(document.getElementById('cnt-satisfacao'), 98, 1400, '%');
  });

  // Inicializando contadores de Resultados e Números (Dinâmicos via data-target)
  ['#resultados', '#numeros'].forEach(seletor => {
    setupCounterObserver(seletor, 0.3, () => {
      const classesFilhas = seletor === '#resultados' ? '.result-val' : '.number-val';
      document.querySelectorAll(classesFilhas).forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCount(el, target, seletor === '#resultados' ? 1600 : 1800);
      });
    });
  });

  // ==========================================
  // LIVE CARD ROTATIVO
  // ==========================================
  const liveData = [
    { store: 'Loja Natura SP', msg: 'Coleta acionada — chegando em 12 min', time: 'agora' },
    { store: 'TechStore Brasil', msg: 'Pedido entregue ✓ — cliente notificado', time: '2 min' },
    { store: 'ModaRápida RJ', msg: 'Etiqueta gerada automaticamente', time: '4 min' },
    { store: 'Beleza Real BH', msg: 'Entregue em 3h22 — NPS enviado', time: '7 min' },
    { store: 'PetShop Online Curitiba', msg: 'Rota otimizada — ETA: 28 min', time: '9 min' }
  ];

  let liveIndex = 0;
  const liveCard = document.getElementById('live-card');

  const updateLive = () => {
    if (!liveCard) return;

    liveIndex = (liveIndex + 1) % liveData.length;
    const d = liveData[liveIndex];

    liveCard.style.opacity = '0';
    liveCard.style.transform = 'translateY(8px)';

    setTimeout(() => {
      const liveStore = document.getElementById('live-store');
      const liveMsg = document.getElementById('live-msg');
      const liveTime = document.getElementById('live-time');

      if (liveStore) liveStore.textContent = d.store;
      if (liveMsg) liveMsg.textContent = d.msg;
      if (liveTime) liveTime.textContent = d.time;

      liveCard.style.transition = 'opacity .4s, transform .4s';
      liveCard.style.opacity = '1';
      liveCard.style.transform = 'translateY(0)';
    }, 300);
  };

  if (liveCard) setInterval(updateLive, 4000);

  // ==========================================
  // SCROLL SUAVE
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!id || !target) return;

      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });

  // ==========================================
  // LOGIN FORM
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');

    if (togglePassword && passwordInput && eyeIcon && eyeOffIcon) {
      togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        eyeIcon.classList.toggle('hidden');
        eyeOffIcon.classList.toggle('hidden');
      });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login realizado com sucesso!');
      window.location.href = 'dashboard.html';
    });
  }

  // ==========================================
  // ESQUECI SENHA
  // ==========================================
  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const submitBtn = document.getElementById('submit-btn');
    const stepEmail = document.getElementById('step-email');
    const stepSuccess = document.getElementById('step-success');
    const sentEmail = document.getElementById('sent-email');
    const resendBtn = document.getElementById('resend-btn');
    const resendFeedback = document.getElementById('resend-feedback');

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const toggleError = (msg = '') => {
      if (emailInput) emailInput.classList.toggle('error', !!msg);
      if (emailError) emailError.textContent = msg;
    };

    const sendResetEmail = (email) => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1800));

    const toggleLoading = (isLoading) => {
      if (submitBtn) submitBtn.disabled = isLoading;
      if (btnText) btnText.classList.toggle('hidden', isLoading);
      if (btnSpinner) btnSpinner.classList.toggle('hidden', !isLoading);
    };

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      toggleError();

      const email = emailInput.value.trim();

      if (!email) {
        toggleError('Por favor, informe seu e-mail.');
        emailInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        toggleError('Informe um endereço de e-mail válido.');
        emailInput.focus();
        return;
      }

      toggleLoading(true);

      try {
        await sendResetEmail(email);
        if (sentEmail) sentEmail.textContent = email;
        if (stepEmail) stepEmail.classList.add('hidden');
        if (stepSuccess) stepSuccess.classList.remove('hidden');
      } catch (err) {
        toggleError('Algo deu errado. Tente novamente.');
        toggleLoading(false);
      }
    });

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) toggleError();
      });
    }

    if (resendBtn) {
      resendBtn.addEventListener('click', async () => {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Reenviando...';

        try {
          await sendResetEmail(sentEmail.textContent);
          if (resendFeedback) resendFeedback.classList.remove('hidden');

          setTimeout(() => {
            if (resendFeedback) resendFeedback.classList.add('hidden');
            resendBtn.disabled = false;
            resendBtn.textContent = 'Reenviar e-mail';
          }, 4000);
        } catch (err) {
          resendBtn.disabled = false;
          resendBtn.textContent = 'Reenviar e-mail';
        }
      });
    }
  }
})();
