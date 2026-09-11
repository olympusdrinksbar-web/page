/* =====================================================================
   OLYMPUS DRINKS BAR · Comportamiento del sitio
   Los contenidos (sabores, precios, horarios, enlaces) viven en js/data.js
   ===================================================================== */
(function () {
  "use strict";

  const D = window.OLYMPUS;
  if (!D) { console.error("Falta js/data.js o tiene un error de sintaxis."); return; }

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NUMS = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ------------------------------------------------------------------
     Enlaces globales: pedidos, WhatsApp, teléfono, mapa, redes
     ------------------------------------------------------------------ */
  const waUrl = (text) => `https://wa.me/${D.negocio.whatsapp}?text=${encodeURIComponent(text)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(D.negocio.mapsQuery)}`;

  $$("[data-order]").forEach((a) => {
    const key = a.dataset.order;
    const url = (D.pedidos && D.pedidos[key]) || "";
    if (url) { a.href = url; return; }
    const name = key === "didi" ? "DiDi" : cap(key);
    a.removeAttribute("href");
    a.removeAttribute("target");
    a.classList.add("is-soon");
    a.setAttribute("aria-disabled", "true");
    a.setAttribute("role", "link");
    a.textContent = a.classList.contains("btn") ? `Muy pronto en ${name}` : `${name} (pronto)`;
  });

  $$("[data-whatsapp]").forEach((a) => { a.href = waUrl("Hola, Olympus Drinks Bar. Tengo una pregunta:"); });
  $$("[data-tel]").forEach((a) => { a.href = "tel:+57" + D.negocio.telefono.replace(/\D/g, ""); });
  $$("[data-maps]").forEach((a) => { a.href = mapsUrl; });
  $$("[data-social]").forEach((a) => {
    const url = D.redes && D.redes[a.dataset.social];
    if (url) a.href = url; else a.closest("li")?.remove();
  });
  const map = $("[data-map]");
  if (map) map.src = `https://www.google.com/maps?q=${encodeURIComponent(D.negocio.mapsQuery)}&z=16&output=embed`;
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Textos que dependen de los datos */
  const binds = {
    minTamano: () => money(Math.min(...D.tamanos.map((t) => t.precio))),
    minPecera: () => money(Math.min(...D.peceras.map((p) => p.precio))),
    precioCoctel: () => money(Math.min(...D.cocteles.map((c) => c.precio))),
    direccion: () => D.negocio.direccion,
    telefono: () => D.negocio.telefono
  };
  $$("[data-bind]").forEach((el) => { const fn = binds[el.dataset.bind]; if (fn) el.textContent = fn(); });

  /* ------------------------------------------------------------------
     Horario: abierto / cerrado según la hora de Bogotá
     ------------------------------------------------------------------ */
  const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + (m || 0); };
  const fmtHour = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    const h12 = h % 12 || 12;
    return `${h12}${m ? ":" + String(m).padStart(2, "0") : ""}\u00A0${h < 12 ? "a.\u00A0m." : "p.\u00A0m."}`;
  };

  function bogotaNow() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Bogota", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
  }

  const WEEK = 7 * 1440;
  const windows = D.horarios.map((h) => {
    const start = h.dia * 1440 + toMin(h.abre);
    let end = h.dia * 1440 + toMin(h.cierra);
    if (end <= start) end += 1440;
    return { ...h, start, end };
  }).sort((a, b) => a.start - b.start);

  function updateStatus() {
    const { day, minutes } = bogotaNow();
    const now = day * 1440 + minutes;
    const open = windows.find((w) => (now >= w.start && now < w.end) || (now + WEEK >= w.start && now + WEEK < w.end));
    let text;
    if (open) {
      text = `Abierto ahora, hasta las ${fmtHour(open.cierra)}`;
    } else if (windows.length) {
      const next = windows.find((w) => w.start > now) || { ...windows[0], start: windows[0].start + WEEK };
      const nextDay = next.dia;
      const when = nextDay === day && next.start - now < 1440 ? "hoy" : nextDay === (day + 1) % 7 ? "mañana" : `el ${DAYS[nextDay]}`;
      text = `Cerrado. Abrimos ${when} a las ${fmtHour(next.abre)}`;
    } else {
      text = "Consulta nuestro horario por WhatsApp";
    }
    $$("[data-status]").forEach((el) => {
      el.dataset.open = open ? "true" : "false";
      const t = $("[data-status-text]", el);
      if (t) t.textContent = text;
    });

    const list = $("[data-hours]");
    if (list) {
      list.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
        const hs = D.horarios.filter((h) => h.dia === d);
        const value = hs.length ? hs.map((h) => `${fmtHour(h.abre)} a ${fmtHour(h.cierra)}`).join(", ") : "Cerrado";
        const cls = [d === day ? "is-today" : "", hs.length ? "" : "is-closed"].join(" ").trim();
        return `<dt class="${cls}">${cap(DAYS[d])}${d === day ? " (hoy)" : ""}</dt><dd class="${cls}">${value}</dd>`;
      }).join("");
    }
  }
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ------------------------------------------------------------------
     Header, menú móvil y submenú de productos
     ------------------------------------------------------------------ */
  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const nav = $("[data-nav]");
  const burger = $("[data-burger]");
  const setMenu = (open) => {
    if (open) nav.style.top = Math.round(header.getBoundingClientRect().bottom) + "px";
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("nav-lock", open);
    burger.setAttribute("aria-expanded", String(open));
    $(".sr-only", burger).textContent = open ? "Cerrar menú" : "Abrir menú";
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a[href^='#']")) { setMenu(false); closeSub(); } });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) { nav.style.top = ""; if (nav.classList.contains("is-open")) setMenu(false); }
  });

  const sub = $("[data-sub]");
  const subToggle = $(".nav__subtoggle", sub);
  const openSub = () => { sub.classList.add("is-open"); subToggle.setAttribute("aria-expanded", "true"); };
  function closeSub() { sub.classList.remove("is-open"); subToggle.setAttribute("aria-expanded", "false"); }
  subToggle.addEventListener("click", (e) => { e.stopPropagation(); sub.classList.contains("is-open") ? closeSub() : openSub(); });
  const desktop = window.matchMedia("(hover: hover) and (min-width: 961px)");
  sub.addEventListener("mouseenter", () => { if (desktop.matches) openSub(); });
  sub.addEventListener("mouseleave", () => { if (desktop.matches) closeSub(); });
  document.addEventListener("click", (e) => { if (desktop.matches && !sub.contains(e.target)) closeSub(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (sub.classList.contains("is-open")) { closeSub(); subToggle.focus(); }
    if (nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });

  /* Enlace activo según la sección visible */
  const navLinks = { inicio: $(".nav__link[href='#inicio']"), productos: $(".nav__link[href='#productos']"), contacto: $(".nav__link[href='#contacto']") };
  const groupOf = (id) => (id === "inicio" ? "inicio" : ["contacto", "sugerencias"].includes(id) ? "contacto" : "productos");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const g = groupOf(en.target.id);
        Object.entries(navLinks).forEach(([k, a]) => a && (k === g ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("#inicio, #granizados, #peceras, #cocteles, #micheladas, #bar, #contacto, #sugerencias").forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------------
     Carrusel principal
     ------------------------------------------------------------------ */
  const hero = $("[data-hero]");
  if (hero) {
    const slides = $$(".slide", hero);
    const tabs = $$("[role='tab']", hero);
    const pauseBtn = $("[data-pause]", hero);
    let current = 0;
    let userPaused = reduceMotion;
    let hover = false, focusInside = false;

    const syncPause = () => {
      hero.classList.toggle("is-paused", userPaused || hover || focusInside || document.hidden);
      hero.classList.toggle("is-stopped", userPaused);
      pauseBtn.setAttribute("aria-label", userPaused ? "Reproducir carrusel" : "Pausar carrusel");
      $("use", pauseBtn).setAttribute("href", userPaused ? "#i-play" : "#i-pause");
    };

    const restartProgress = (tab) => {
      const bar = $(".hero__progress i", tab);
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.animation = "";
    };

    const go = (n, { focusTab = false } = {}) => {
      n = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === n;
        s.classList.toggle("is-active", on);
        s.inert = !on;
        s.setAttribute("aria-hidden", String(!on));
      });
      tabs.forEach((t, k) => {
        t.setAttribute("aria-selected", String(k === n));
        t.tabIndex = k === n ? 0 : -1;
      });
      hero.style.setProperty("--hero-accent", slides[n].style.getPropertyValue("--accent"));
      restartProgress(tabs[n]);
      const nextImg = $("img", slides[(n + 1) % slides.length]);
      if (nextImg) nextImg.loading = "eager";
      if (focusTab) tabs[n].focus();
      current = n;
    };

    tabs.forEach((t, k) => {
      t.setAttribute("aria-controls", slides[k].id || (slides[k].id = `slide-${k + 1}`));
      t.addEventListener("click", () => go(k));
      $(".hero__progress i", t).addEventListener("animationend", () => { if (k === current && !userPaused) go(current + 1); });
    });
    $("[data-prev]", hero).addEventListener("click", () => go(current - 1));
    $("[data-next]", hero).addEventListener("click", () => go(current + 1));
    pauseBtn.addEventListener("click", () => { userPaused = !userPaused; if (!userPaused) restartProgress(tabs[current]); syncPause(); });

    $("[data-tabs]", hero).addEventListener("keydown", (e) => {
      const map = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: slides.length - 1 };
      if (e.key in map) { e.preventDefault(); go(map[e.key], { focusTab: true }); }
    });

    hero.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hover = true; syncPause(); } });
    hero.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hover = false; syncPause(); } });
    hero.addEventListener("focusin", () => { focusInside = true; syncPause(); });
    hero.addEventListener("focusout", (e) => { if (!hero.contains(e.relatedTarget)) { focusInside = false; syncPause(); } });
    document.addEventListener("visibilitychange", syncPause);

    /* Deslizar con el dedo */
    const area = $("[data-slides]", hero);
    let sx = 0, sy = 0, tracking = false;
    area.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") return; tracking = true; sx = e.clientX; sy = e.clientY; });
    area.addEventListener("pointerup", (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(current + (dx < 0 ? 1 : -1));
    });
    area.addEventListener("pointercancel", () => { tracking = false; });

    go(0);
    syncPause();
  }

  /* Botón flotante de WhatsApp: aparece al salir del banner principal */
  const waFloat = $(".wa-float");
  if (waFloat && hero && "IntersectionObserver" in window) {
    waFloat.classList.add("is-hidden");
    new IntersectionObserver(([en]) => waFloat.classList.toggle("is-hidden", en.isIntersecting), { threshold: 0.35 }).observe(hero);
  }

  /* ------------------------------------------------------------------
     Granizados: tamaños, sabores y vaso interactivo
     ------------------------------------------------------------------ */
  const cup = $("[data-cup]");
  const sizesEl = $("[data-sizes]");
  const flavorsEl = $("[data-flavors]");
  const sabores = D.sabores.filter((s) => s.disponible !== false);
  const licorText = (s) => (s.licor ? `con ${s.licor.toLowerCase()}` : "sin alcohol");
  const state = {
    size: D.tamanos.find((t) => t.id === "16oz") || D.tamanos[0],
    flavor: sabores[0] || null
  };

  const miniCup = (forma) => forma === "pecera"
    ? `<svg viewBox="0 0 40 56" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4.5 28c-2.5 13 4.5 24 15.5 24s18-11 15.5-24"/><ellipse cx="20" cy="28" rx="15.5" ry="3.4"/><path d="M13 27 9.5 11M27 27l5-14"/></g></svg>`
    : `<svg viewBox="0 0 40 56" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M7 20h26l-3.4 34H10.4Z"/><path d="M6 20c1.5-9 7.5-13 14-13s12.5 4 14 13"/><path d="m23 22 5-20"/></g></svg>`;

  if (sizesEl && flavorsEl && cup) {
    sizesEl.innerHTML = D.tamanos.map((t) => `
      <div class="size">
        <input type="radio" name="tamano" id="tam-${esc(t.id)}" value="${esc(t.id)}" ${t === state.size ? "checked" : ""}>
        <label for="tam-${esc(t.id)}" style="--k:${t.forma === "pecera" ? 1 : t.escala}">
          ${miniCup(t.forma)}
          <span class="size__name">${esc(t.nombre)}</span>
          <span class="size__price">${money(t.precio)}</span>
        </label>
      </div>`).join("");
    $$(".size label svg", sizesEl).forEach((svg) => {
      const k = parseFloat(svg.parentElement.style.getPropertyValue("--k")) || 1;
      svg.style.width = `${Math.round(30 + 22 * k)}px`;
    });

    flavorsEl.innerHTML = sabores.length ? sabores.map((s, i) => {
      const [c0, c1, c2] = s.colores && s.colores.length >= 3 ? s.colores : ["#FF3D7F", "#FFB23D", "#3DB8FF"];
      return `
      <div class="flavor" data-kind="${s.licor ? "licor" : "sin"}">
        <input type="radio" name="sabor" id="sab-${i}" value="${i}" ${s === state.flavor ? "checked" : ""}>
        <label for="sab-${i}" style="--c0:${esc(c0)};--c1:${esc(c1)};--c2:${esc(c2)}">
          <span class="flavor__drop" aria-hidden="true"></span>
          <span><span class="flavor__name">${esc(s.nombre)}</span><span class="flavor__licor">${esc(cap(licorText(s)))}</span></span>
        </label>
        ${s.nuevo ? '<span class="flavor__new">Nuevo</span>' : ""}
      </div>`;
    }).join("") + `<p class="flavors__empty" hidden data-empty>No hay sabores de este tipo en este momento. Pregúntanos por WhatsApp qué hay hoy.</p>`
      : `<p class="flavors__empty">Estamos actualizando los sabores. Pregúntanos por WhatsApp qué hay hoy.</p>`;

    const stops = $$("stop", cup);
    const halo = $(".cup__halo");
    const summaryName = $("[data-summary-name]");
    const summaryPrice = $("[data-summary-price]");
    const waBuilder = $("[data-whatsapp-builder]");

    const pour = () => {
      if (reduceMotion) return;
      cup.classList.remove("is-pouring");
      void cup.getBoundingClientRect();
      cup.classList.add("is-pouring");
    };

    const render = (animate = true) => {
      const { size, flavor } = state;
      cup.dataset.forma = size.forma;
      cup.style.setProperty("--s", size.forma === "vaso" ? size.escala : 1);
      const colors = flavor ? flavor.colores : ["#FF3D7F", "#FFB23D", "#3DB8FF"];
      stops.forEach((st, i) => { st.style.stopColor = colors[i] || colors[colors.length - 1]; });
      cup.style.setProperty("--glow", colors[1] || colors[0]);
      if (halo) halo.style.setProperty("--glow", colors[1] || colors[0]);

      const what = flavor ? `${flavor.nombre.toLowerCase()} ${licorText(flavor)}` : "tu sabor favorito";
      const name = size.forma === "pecera" ? `${size.nombre} de ${what}` : `Granizado de ${size.nombre} de ${what}`;
      summaryName.textContent = name;
      summaryPrice.textContent = money(size.precio);
      if (waBuilder) {
        const ask = size.forma === "pecera" ? `pecera de ${what}` : `granizado de ${what} en ${size.nombre}`;
        waBuilder.href = waUrl(`Hola, Olympus Drinks Bar. ¿Hoy tienen ${ask}?`);
      }
      if (animate) pour();
    };

    sizesEl.addEventListener("change", (e) => {
      state.size = D.tamanos.find((t) => t.id === e.target.value) || state.size;
      render();
    });
    flavorsEl.addEventListener("change", (e) => {
      state.flavor = sabores[Number(e.target.value)] || state.flavor;
      render();
    });

    const filters = $$("[data-filter]");
    filters.forEach((btn) => btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => { const on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
      let visible = 0;
      $$(".flavor", flavorsEl).forEach((el) => {
        const show = f === "todos" || el.dataset.kind === f;
        el.hidden = !show;
        if (show) visible++;
      });
      const empty = $("[data-empty]", flavorsEl);
      if (empty) empty.hidden = visible > 0;
      const checked = $(".flavor input:checked", flavorsEl);
      if (checked && checked.closest(".flavor").hidden) {
        const first = $(".flavor:not([hidden]) input", flavorsEl);
        if (first) { first.checked = true; state.flavor = sabores[Number(first.value)]; render(); }
      }
    }));

    render(false);
  }

  /* ------------------------------------------------------------------
     Peceras
     ------------------------------------------------------------------ */
  const checkIcon = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
  const pecerasEl = $("[data-peceras]");
  const baseEl = $("[data-pecera-base]");
  if (pecerasEl && D.peceras.length) {
    const base = D.peceras.length > 1
      ? D.peceras[0].incluye.filter((item) => D.peceras.every((p) => p.incluye.includes(item)))
      : [];
    if (baseEl) baseEl.innerHTML = base.map((b) => `<li>${checkIcon}${esc(b)}</li>`).join("");
    pecerasEl.innerHTML = D.peceras.map((p) => {
      const extras = p.incluye.filter((i) => !base.includes(i));
      const title = extras.length ? extras.join(" y ") : p.nombre;
      return `
      <article class="pecera frame" style="--c:${esc(p.color || "#2EE6E6")}">
        <svg viewBox="0 0 160 150" aria-hidden="true"><use href="#i-pecera"/></svg>
        <p class="pecera__plus">${base.length ? "Acompañada de" : "Pecera"}</p>
        <h3 class="pecera__name">${esc(title)}</h3>
        <p class="pecera__price">${money(p.precio)}<span class="pecera__who">para 5 personas</span></p>
      </article>`;
    }).join("");
  }

  /* ------------------------------------------------------------------
     Cocteles
     ------------------------------------------------------------------ */
  const coctelesEl = $("[data-cocteles]");
  if (coctelesEl) {
    coctelesEl.innerHTML = D.cocteles.map((c) => `
      <article class="coctel" style="--c:${esc(c.color)}">
        <svg viewBox="0 0 80 100" aria-hidden="true"><use href="#vaso-${esc(c.vaso || "rocas")}"/></svg>
        <h3 class="coctel__name">${esc(c.dios)} ${esc(c.nombre)}</h3>
        <p class="coctel__ing">${esc(c.ingredientes)}</p>
        <p class="coctel__price">${money(c.precio)}</p>
      </article>`).join("");
    const lede = $("[data-cocteles-lede]");
    const n = D.cocteles.length;
    const samePrice = n && D.cocteles.every((c) => c.precio === D.cocteles[0].precio);
    if (lede && n) {
      const word = NUMS[n] || String(n);
      lede.textContent = `${cap(word)} dioses, ${word} cocteles.` + (samePrice ? ` Todos a ${money(D.cocteles[0].precio)}.` : "");
    }
  }

  /* ------------------------------------------------------------------
     Micheladas y listas de precios
     ------------------------------------------------------------------ */
  const priceItems = (arr) => arr.filter((x) => x.disponible !== false).map((x) =>
    `<li><span>${esc(x.nombre)}</span><span class="pricelist__dots" aria-hidden="true"></span><span class="pricelist__price">${money(x.precio)}</span></li>`
  ).join("");

  const godsEl = $("[data-michelada-sabores]");
  if (godsEl) {
    godsEl.innerHTML = D.micheladas.sabores.map((m) => `
      <li class="god" style="--c:${esc(m.color)}">
        <svg viewBox="0 0 48 48" aria-hidden="true"><use href="#ic-${esc(m.icono)}"/></svg>
        <span class="god__name">${esc(m.dios)}</span>
        <span class="god__fruit">${esc(m.fruta)}</span>
      </li>`).join("");
  }
  const michCervezas = $("[data-michelada-cervezas]");
  if (michCervezas) michCervezas.innerHTML = priceItems(D.micheladas.cervezas);

  $$("[data-list]").forEach((ul) => {
    const arr = D[ul.dataset.list];
    if (Array.isArray(arr)) ul.innerHTML = priceItems(arr);
  });

  /* ------------------------------------------------------------------
     Formulario de sugerencias (Netlify Forms)
     ------------------------------------------------------------------ */
  const form = $("[data-form]");
  if (form) {
    const done = $("[data-form-done]");
    const status = $("[data-form-status]");
    const submit = $("[data-submit]");
    const msg = form.elements.mensaje;
    const count = $("[data-count]", form);
    const hint = $("[data-rating-hint]", form);
    const hintDefault = hint ? hint.textContent : "";

    msg.addEventListener("input", () => {
      count.textContent = msg.value.length;
      if (msg.value.trim().length >= 3) setError("mensaje", "");
    });
    form.elements.autoriza_datos.addEventListener("change", (e) => { if (e.target.checked) setError("autoriza_datos", ""); });
    $$(".rating input", form).forEach((r) => r.addEventListener("change", () => {
      if (hint) hint.textContent = `${$(`label[for='${r.id}']`, form).title} (${r.value} de 5)`;
    }));

    function setError(name, text) {
      const slot = $(`[data-error-for='${name}']`, form);
      const field = form.elements[name];
      if (slot) slot.textContent = text;
      if (field) {
        field.setAttribute("aria-invalid", text ? "true" : "false");
        field.closest(".field")?.classList.toggle("has-error", Boolean(text));
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("is-error");

      let firstInvalid = null;
      if (msg.value.trim().length < 3) { setError("mensaje", "Escribe tu mensaje antes de enviarlo."); firstInvalid = firstInvalid || msg; }
      if (!form.elements.autoriza_datos.checked) { setError("autoriza_datos", "Marca la autorización para poder enviar tu mensaje."); firstInvalid = firstInvalid || form.elements.autoriza_datos; }
      if (firstInvalid) { firstInvalid.focus(); return; }

      submit.setAttribute("aria-busy", "true");
      submit.disabled = true;
      submit.textContent = "Enviando sugerencia";

      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        count.textContent = "0";
        if (hint) hint.textContent = hintDefault;
        form.hidden = true;
        done.hidden = false;
        done.focus();
      } catch (err) {
        status.textContent = "No se pudo enviar. Revisa tu conexión e inténtalo otra vez, o escríbenos por WhatsApp.";
        status.classList.add("is-error");
      } finally {
        submit.removeAttribute("aria-busy");
        submit.disabled = false;
        submit.textContent = "Enviar sugerencia";
      }
    });

    $("[data-form-again]").addEventListener("click", () => {
      done.hidden = true;
      form.hidden = false;
      form.elements.nombre.focus();
    });
  }
})();
