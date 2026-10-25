/*
  Elenco delle consegne mostrate nel sito (index.html).

  Per aggiungere una consegna basta copiare un blocco qui sotto e cambiare i campi:
  il sito crea da solo la card, il pulsante «Consegna Cn» e la scheda nel visualizzatore.
  I percorsi sono relativi alla cartella principale del repository.

    id             "C2", "C3"…: compare nel pulsante e nell'indirizzo (index.html#C2)
    titolo         il tema della consegna
    periodo        facoltativo, per esempio "Novembre 2026"
    descrizione    una o due frasi
    presentazione  facoltativo: il file HTML della presentazione, si apre dentro il sito
    pdf            facoltativo: la versione PDF della presentazione
    materiali      facoltativo: altri file o cartelle, ognuno con etichetta e href
                   (si aprono in una nuova scheda)
*/
const REPO = "https://github.com/viganogabriele/progetto-fhci/tree/main/";
const REPO_FILE = "https://github.com/viganogabriele/progetto-fhci/blob/main/";

window.CONSEGNE = [
  {
    id: "C0",
    titolo: "Gruppo e tema",
    descrizione: "La formazione del gruppo, le due proposte di tema e la conferma di quello scelto: il consenso online.",
    materiali: [
      { etichetta: "Gruppo e proposte di tema", href: REPO_FILE + "C0/hw-0.md" },
      { etichetta: "Conferma del tema", href: REPO_FILE + "C0/hw-0.1.md" },
    ],
  },
  {
    id: "C1",
    titolo: "Needfinding",
    periodo: "Ottobre 2026",
    descrizione: "Un survey con 157 risposte, le interviste a nove utenti e a un esperto, e i bisogni che ne sono emersi.",
    presentazione: "C1/presentazione/presentazione_animata.html",
    pdf: "C1/presentazione/presentazione.pdf",
    materiali: [
      { etichetta: "Survey", href: REPO + "C1/extras/survey" },
      { etichetta: "Interviste", href: REPO + "C1/extras/interviste" },
      { etichetta: "Script delle interviste", href: REPO + "C1/extras/script_interviste" },
      { etichetta: "Consenso informato", href: "C1/extras/consenso/consenso-informato.pdf" },
    ],
  },
  {
    id: "C2",
    titolo: "Raffinamento e focus",
    periodo: "Ottobre 2026",
    descrizione: "Un focus group per approfondire la prima ricerca, i bisogni su cui lavorare, personas e scenari, e la soluzione scelta: MyChoice.",
    presentazione: "C2/presentazione/presentazione_animata.html",
    pdf: "C2/presentazione/presentazione.pdf",
    materiali: [
      { etichetta: "Focus group", href: "C2/extras/focus_group/FocusGroup.pdf" },
      { etichetta: "Script del focus group", href: "C2/extras/script_focus_group/script-focus-group.pdf" },
      { etichetta: "Consenso informato", href: "C2/extras/consenso/consenso-informato.pdf" },
    ],
  },
];

/* Mostra in fondo una card tratteggiata per la consegna successiva, finché non viene aggiunta. */
window.MOSTRA_PROSSIMA = true;
