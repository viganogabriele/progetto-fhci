/*
  Sito delle consegne brAInc: crea le card da window.CONSEGNE (assets/site/consegne.js)
  e apre le presentazioni in un iframe. L'indirizzo segue la presentazione aperta
  (index.html#C1), così si può condividere un link diretto e il tasto Indietro chiude il visualizzatore.
*/
(() => {
  const consegne = window.CONSEGNE || [];
  const conDeck = consegne.filter((c) => c.presentazione);
  const $ = (id) => document.getElementById(id);

  const icon = (name) => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
  const linkAttrs = (href) => `href="${esc(href)}" target="_blank" rel="noopener"`;

  // ---------- card delle consegne ----------
  function card(c, i) {
    const links = [];
    if (c.pdf) links.push(`<li><a ${linkAttrs(c.pdf)}>${icon("file")}PDF</a></li>`);
    for (const m of c.materiali || []) {
      const ico = /\.[a-z0-9]+$/i.test(m.href) ? "file" : "folder"; // file o cartella
      links.push(`<li><a ${linkAttrs(m.href)}>${icon(ico)}${esc(m.etichetta)}</a></li>`);
    }
    return `
      <li class="${c.presentazione ? "has-deck" : ""}" style="--i:${i}">
        <div class="card-top">
          <span class="card-num" aria-hidden="true">${esc(c.id)}</span>
          <span class="pill ${c.presentazione ? "" : "plan"}">${c.presentazione ? icon("play") + "Presentazione" : "Documenti"}</span>
        </div>
        <h3>${esc(c.titolo)}</h3>
        ${c.periodo ? `<span class="label when">${esc(c.periodo)}</span>` : ""}
        <p class="desc">${esc(c.descrizione || "")}</p>
        ${
          c.presentazione
            ? `<a class="btn card-main" href="#${esc(c.id)}" data-open="${esc(c.id)}">Consegna ${esc(c.id)}${icon("arrow-right")}</a>`
            : ""
        }
        ${links.length ? `<ul class="links" aria-label="Materiali della consegna ${esc(c.id)}">${links.join("")}</ul>` : ""}
      </li>`;
  }

  function nextId() {
    const nums = consegne.map((c) => parseInt(String(c.id).replace(/\D/g, ""), 10)).filter((n) => !isNaN(n));
    return "C" + (nums.length ? Math.max(...nums) + 1 : 1);
  }

  $("cards").innerHTML = consegne.map(card).join("");
  if (window.MOSTRA_PROSSIMA) {
    // striscia tratteggiata sotto la griglia: non resta da sola su una riga mezza vuota
    $("next").innerHTML = `
      <span class="card-num" aria-hidden="true">${nextId()}</span>
      <p>La prossima consegna comparirà qui.</p>`;
    $("next").hidden = false;
  }

  $("hero-actions").innerHTML = `<a class="btn ghost" href="#consegne">Tutte le consegne${icon("arrow-right")}</a>`;

  // ---------- visualizzatore ----------
  const viewer = $("viewer");
  let frame = $("viewer-iframe");
  const loading = $("viewer-loading");
  const pdf = $("viewer-pdf");
  const newTab = $("viewer-new");
  let current = null;
  let openedHere = false; // il visualizzatore è stato aperto da questa pagina: Indietro torna alle card
  let returnFocus = null;

  $("viewer-tabs").innerHTML = conDeck
    .map((c) => `<a href="#${esc(c.id)}" data-id="${esc(c.id)}">Consegna ${esc(c.id)}</a>`)
    .join("");
  if (conDeck.length < 2) $("viewer-tabs").hidden = true;

  function show(c) {
    if (current !== c) {
      current = c;
      $("viewer-title").innerHTML = `Consegna ${esc(c.id)}<small>${esc(c.titolo)}</small>`;
      document.title = `Consegna ${c.id} · ${c.titolo} · brAInc`;
      loading.classList.remove("done");
      loadFrame(c.presentazione);
      newTab.href = c.presentazione;
      pdf.hidden = !c.pdf;
      if (c.pdf) pdf.href = c.pdf;
      for (const a of $("viewer-tabs").children) {
        if (a.dataset.id === c.id) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      }
    }
    if (viewer.hidden) {
      returnFocus = document.activeElement;
      viewer.hidden = false;
      document.documentElement.classList.add("locked");
      $("viewer-close").focus();
    }
  }

  function hide() {
    if (viewer.hidden) return;
    viewer.hidden = true;
    document.documentElement.classList.remove("locked");
    document.title = "brAInc · Cosa accettiamo davvero?";
    // svuoto l'iframe: la presentazione pesa qualche MB e ha animazioni che girano
    loadFrame(null);
    current = null;
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
  }

  function close() {
    if (openedHere) {
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search + "#consegne");
      route();
    }
  }

  function route() {
    const id = decodeURIComponent(location.hash.slice(1)).toUpperCase();
    const c = conDeck.find((x) => x.id.toUpperCase() === id);
    if (c) show(c);
    else {
      openedHere = false;
      hide();
    }
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-open], #viewer-tabs a");
    if (a && viewer.hidden) openedHere = true;
  });
  // cambiare scheda nel visualizzatore non deve riempire la cronologia
  $("viewer-tabs").addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    e.preventDefault();
    history.replaceState(null, "", a.getAttribute("href"));
    route();
  });

  addEventListener("hashchange", route);
  $("viewer-close").addEventListener("click", close);
  $("viewer-full").addEventListener("click", () => {
    (frame.requestFullscreen || frame.webkitRequestFullscreen)?.call(frame);
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !viewer.hidden && !document.fullscreenElement) close();
  });

  // ogni presentazione in un iframe nuovo: cambiare src a uno già caricato aggiungerebbe una voce
  // alla cronologia, e Indietro (o Esc) tornerebbe alla presentazione precedente invece di chiudere
  function loadFrame(url) {
    const f = frame.cloneNode(false);
    f.removeAttribute("src");
    if (url) {
      f.src = url;
      f.addEventListener("load", () => onFrameLoad(f));
    }
    frame.replaceWith(f);
    frame = f;
  }

  function onFrameLoad(f) {
    loading.classList.add("done");
    // stessa origine: do il focus alla presentazione, così le frecce funzionano subito,
    // ed Esc dentro le slide chiude il visualizzatore (se non è aperta la panoramica)
    try {
      const w = f.contentWindow;
      w.focus();
      w.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || w.document.fullscreenElement) return;
        if (w.document.documentElement.classList.contains("overview")) return;
        close();
        focus();
      }, true); // in cattura: prima del gestore delle slide, che con Esc chiude la panoramica
    } catch {
      /* aperto da file://: il browser blocca l'accesso all'iframe, va bene lo stesso */
    }
  }

  route();
})();
