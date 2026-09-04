/* Manchester City · História — interações e animações */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- barra de progresso + nav + voltar ao topo ---------- */
  const progressBar = $("#progressBar");
  const nav = $("#nav");
  const toTop = $("#toTop");

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    nav.classList.toggle("scrolled", window.scrollY > 30);
    toTop.classList.toggle("show", window.scrollY > 700);
    updateTimeline();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

  /* ---------- menu mobile ---------- */
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- link ativo conforme a seção ---------- */
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        $$(".nav-links a").forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  ["inicio", "origem", "triplice", "haaland", "debruyne", "galeria"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* ---------- revelação ao rolar ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  // rede de segurança: revela elementos que ficaram para trás em rolagens muito rápidas
  const pendingReveals = () => $$(".reveal:not(.visible)");
  const sweepReveals = () => {
    const vh = window.innerHeight;
    pendingReveals().forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh - 20 && r.bottom > 0) el.classList.add("visible");
    });
  };
  const sweepTimer = setInterval(() => {
    if (!pendingReveals().length) clearInterval(sweepTimer);
    else sweepReveals();
  }, 700);
  window.addEventListener("beforeunload", () => clearInterval(sweepTimer));

  /* ---------- contadores animados ---------- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el, target, suffix = "", duration = 1500) => {
    if (reducedMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * easeOut(p)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateCount(el, parseInt(el.dataset.target, 10), el.dataset.suffix || "");
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-target]").forEach((el) => counterObserver.observe(el));

  /* ---------- gráficos de barras ---------- */
  const barsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = entry.target;
        const vals = $$(".bar-fill", group).map((b) => parseFloat(b.dataset.val));
        const max = Math.max(...vals);
        $$(".bar-fill", group).forEach((b) => {
          b.style.width = (parseFloat(b.dataset.val) / max) * 100 + "%";
        });
        $$(".bar-val", group).forEach((v) => animateCount(v, parseFloat(v.dataset.val), "", 1300));
        barsObserver.unobserve(group);
      });
    },
    { threshold: 0.4 }
  );
  $$("[data-bars]").forEach((g) => barsObserver.observe(g));

  /* ---------- preenchimento da linha do tempo ---------- */
  const timeline = $("#timeline");
  const tlFill = $("#tlFill");
  const updateTimeline = () => {
    if (!timeline || !tlFill) return;
    const rect = timeline.getBoundingClientRect();
    const anchor = window.innerHeight * 0.55;
    const progress = Math.min(Math.max((anchor - rect.top) / rect.height, 0), 1);
    tlFill.style.height = progress * 100 + "%";
  };

  /* ---------- efeito tilt 3D ---------- */
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (finePointer && !reducedMotion) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- lightbox da galeria ---------- */
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCap = $("#lbCap");
  const lbClose = $("#lbClose");

  const openLightbox = (src, caption) => {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCap.textContent = caption;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };
  $$(".g-item").forEach((item) => {
    item.addEventListener("click", () => {
      const img = $("img", item);
      openLightbox(img.src, $(".g-cap", item).textContent);
    });
  });
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ---------- ano no rodapé ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  onScroll();
})();
