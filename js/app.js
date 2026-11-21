/* Ma Cotisation — écrans et navigation. */
"use strict";

const $ = (s, r) => (r || document).querySelector(s);
S = charger();

/* ================= Icônes ================= */
const ICONES = {
  accueil: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  membres: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.2.7 3.5 2.8 3.5 5.7"/>',
  paiements: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  rapports: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  reglages: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  retour: '<path d="M15 18l-6-6 6-6"/>',
  suivant: '<path d="M9 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  recherche: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  partage: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  tel: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  portefeuille: '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 13.5h2"/>',
  crayon: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>',
  imprimer: '<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7"/>',
  message: '<path d="M4 5h16v11H8l-4 4z"/>',
  historique: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cadenas: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  aide: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
  sauver: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  restaurer: '<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
  croix: '<path d="M6 6l12 12M18 6 6 18"/>',
  effacer: '<path d="M21 5H9l-6 7 6 7h12z"/><path d="M17 9l-6 6M11 9l6 6"/>'
};
function ic(nom, t) {
  t = t || 22;
  return `<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nom] || ""}</svg>`;
}

/* ================= État de l'interface ================= */
const ui = {
  moisAccueil: Mois.courant(),
  moisSuivi: Mois.courant(),
  filtre: "tous", recherche: "",
  filtreSuivi: "tous",
  rapport: { type: "mensuel", mois: Mois.courant(), du: S.asso.debutSuivi < Mois.courant() ? S.asso.debutSuivi : Mois.courant(), au: Mois.courant(), detail: false }
};

/* ================= Navigation (avec le bouton retour d'Android) ================= */
let pile = [{ vue: "accueil" }];
let apresPop = null;
function ouvrir(vue, params) { pile = [...pile, Object.assign({ vue }, params || {})]; history.pushState({ pile }, ""); rendre(true); }
function remplacer(vue, params) { pile = [...pile.slice(0, -1), Object.assign({ vue }, params || {})]; history.replaceState({ pile }, ""); rendre(true); }
function majEtat(params) { Object.assign(pile[pile.length - 1], params); history.replaceState({ pile }, ""); }
function retour() { if (pile.length > 1) history.back(); }
function revenirDe(n, puis) { if (n <= 0) { puis(); return; } apresPop = puis; history.go(-n); }
function onglet(nom) {
  revenirDe(pile.length - 1, () => { pile = [{ vue: nom }]; history.replaceState({ pile }, ""); rendre(true); });
}
window.addEventListener("popstate", (e) => {
  pile = (e.state && e.state.pile) || [{ vue: "accueil" }];
  if (document.querySelector("dialog[open]")) document.querySelectorAll("dialog[open]").forEach(d => d.close());
  if (apresPop) { const f = apresPop; apresPop = null; f(); } else rendre(true);
});

const ONGLETS = [
  ["accueil", "Accueil"], ["membres", "Membres"], ["paiements", "Paiements"], ["rapports", "Rapports"]
];

function rendre(enHaut) {
  const e = pile[pile.length - 1];
  const v = VUES[e.vue] || VUES.accueil;
  const racine = pile.length === 1;
  document.body.dataset.vue = e.vue;
  const titre = typeof v.titre === "function" ? v.titre(e) : v.titre;
  $("#app-bar").innerHTML = racine
    ? `<div class="bar-titre"><div class="bar-h">${echapper(e.vue === "accueil" ? nomAsso() : titre)}</div>
        <div class="bar-sous">${e.vue === "accueil" ? "Cotisation : " + argent(S.asso.montant) + " par mois" : echapper(nomAsso())}</div></div>
       <button class="bar-btn" data-action="ouvrir" data-vue="reglages" aria-label="Paramètres">${ic("reglages")}</button>`
    : `<button class="bar-btn" data-action="retour" aria-label="Retour">${ic("retour")}</button>
       <div class="bar-titre"><div class="bar-h">${echapper(titre)}</div></div>`;
  $("#contenu").innerHTML = v.html(e);
  const navVisible = racine || !v.sansNav;
  $("#nav-bas").hidden = !navVisible;
  document.body.classList.toggle("avec-nav", navVisible);
  const actif = pile[0].vue;
  document.querySelectorAll("#nav-bas button").forEach(b => b.setAttribute("aria-current", b.dataset.onglet === actif ? "page" : "false"));
  if (v.apres) v.apres(e);
  if (enHaut) window.scrollTo(0, 0);
}

/* ================= Composants ================= */
function navMois(cle, action) {
  return `<div class="nav-mois">
    <button class="rond" data-action="${action}" data-pas="-1" aria-label="Mois précédent">${ic("retour")}</button>
    <strong>${Mois.libelle(cle)}</strong>
    <button class="rond" data-action="${action}" data-pas="1" aria-label="Mois suivant">${ic("suivant")}</button></div>`;
}
function avatar(m, grand) { return `<span class="avatar ${grand ? "grand" : ""}" aria-hidden="true">${echapper(initiales(m))}</span>`; }
function etatMembre(m) {
  if (!m.actif) return { cle: "archive", badge: '<span class="badge neutre">Archivé</span>' };
  const dus = moisDus(m);
  const retard = dus.filter(k => k < Mois.courant()).length;
  if (retard) return { cle: "retard", badge: `<span class="badge ko">${retard} mois de retard</span>` };
  if (dus.length) return { cle: "apayer", badge: '<span class="badge att">À payer ce mois</span>' };
  return { cle: "ajour", badge: '<span class="badge ok">À jour</span>' };
}
function badgeMois(s) {
  return {
    paye: '<span class="badge ok">Payé</span>', retard: '<span class="badge ko">En retard</span>',
    apayer: '<span class="badge att">Non payé</span>', avenir: '<span class="badge neutre">À venir</span>',
    hors: '<span class="badge neutre">Pas encore membre</span>'
  }[s];
}
function ligneMembre(m, droite, action) {
  return `<button class="ligne-liste" data-action="${action || "fiche"}" data-id="${m.id}">
    ${avatar(m)}<span class="ll-texte"><span class="ll-nom">${echapper(nomComplet(m))}</span>
    <span class="ll-sous">${m.tel ? echapper(m.tel) : "Membre depuis " + Mois.bas(m.inscription)}</span></span>
    <span class="ll-droite">${droite}</span></button>`;
}
function vide(texte) { return `<div class="vide">${texte}</div>`; }

/* ================= Écrans ================= */
const VUES = {};

/* ---------- A. Accueil ---------- */
VUES.accueil = {
  titre: "Accueil",
  html() {
    const M = ui.moisAccueil, st = statsMois(M);
    const retard = membresEnRetard();
    const derniers = [...S.versements].sort((a, b) => b.creeLe.localeCompare(a.creeLe)).slice(0, 6);
    const ancienne = !S.meta.derniereSauvegarde || (Date.now() - new Date(S.meta.derniereSauvegarde)) > 30 * 864e5;
    return `
    ${S.versements.length >= 5 && ancienne ? `<div class="bandeau">${ic("sauver", 20)}<span>Pensez à faire une copie de sauvegarde (une fois par mois).</span>
      <button class="btn petit" data-action="sauvegarder">Faire la copie</button></div>` : ""}
    ${navMois(M, "moisAccueil")}
    <div class="carte hero">
      <div class="hero-lib">Ont payé ${M === Mois.courant() ? "ce mois-ci" : "en " + Mois.bas(M)}</div>
      <div class="hero-val">${st.payes.length}<small> / ${st.concernes.length} membres</small></div>
      <div class="progress" role="progressbar" aria-valuenow="${st.taux}" aria-valuemin="0" aria-valuemax="100"><div style="width:${st.taux}%"></div></div>
      <div class="hero-pied"><span>${st.taux} % des membres</span><span>${argent(st.encaisse)} sur ${argent(st.attendu)}</span></div>
    </div>
    <button class="btn primaire xl bloc" data-action="payer">${ic("plus", 24)} Enregistrer un paiement</button>
    <div class="tuiles">
      <div class="tuile"><span>Reçu pour ce mois</span><strong class="t-ok">${argent(st.encaisse)}</strong></div>
      <div class="tuile"><span>Reste à collecter</span><strong class="${st.reste ? "t-ko" : "t-ok"}">${argent(st.reste)}</strong></div>
      <button class="tuile" data-action="voirRetards"><span>Membres en retard</span><strong class="${retard.length ? "t-ko" : "t-ok"}">${retard.length}</strong></button>
      <div class="tuile"><span>Membres actifs</span><strong>${S.membres.filter(m => m.actif).length}</strong></div>
    </div>
    <h3 class="section">Dernières opérations</h3>
    <div class="liste carte-liste">
      ${derniers.length ? derniers.map(v => {
        const m = membre(v.membreId); if (!m) return "";
        const mois = moisDuVersement(v);
        return `<button class="ligne-liste" data-action="fiche" data-id="${m.id}">${avatar(m)}
          <span class="ll-texte"><span class="ll-nom">${echapper(nomComplet(m))}</span>
          <span class="ll-sous">${pluriel(mois.length, "mois", "mois")} · ${echapper(libelleMoisListe(mois))}</span></span>
          <span class="ll-droite"><span class="${v.annule ? "barre" : "t-ok"} montant">${argent(v.montant)}</span>
          <span class="ll-sous">${v.annule ? "Annulé" : dateFr(v.date)}</span></span></button>`;
      }).join("") : vide("Aucun paiement enregistré pour le moment.")}
    </div>`;
  }
};

/* ---------- B. Membres ---------- */
function filtrerMembres() {
  const q = normaliser(ui.recherche);
  return S.membres.filter(m => {
    const e = etatMembre(m).cle;
    if (ui.filtre === "archives" ? e !== "archive" : e === "archive") return false;
    if (ui.filtre === "ajour" && e !== "ajour") return false;
    if (ui.filtre === "retard" && e !== "retard") return false;
    return !q || normaliser(nomComplet(m) + " " + m.tel).includes(q);
  });
}
function listeMembresHTML() {
  const l = filtrerMembres();
  return l.length ? l.map(m => ligneMembre(m, etatMembre(m).badge)).join("") : vide(ui.recherche ? "Aucun membre ne correspond à « " + echapper(ui.recherche) + " »." : "Aucun membre dans cette liste.");
}
VUES.membres = {
  titre: "Membres",
  html() {
    const n = (c) => S.membres.filter(m => etatMembre(m).cle === c).length;
    const chips = [["tous", "Tous", S.membres.filter(m => m.actif).length], ["ajour", "À jour", n("ajour")], ["retard", "En retard", n("retard")], ["archives", "Archivés", n("archive")]];
    return `
    <label class="recherche">${ic("recherche", 20)}<input type="search" placeholder="Rechercher un membre" value="${echapper(ui.recherche)}" data-input="recherche" enterkeyhint="search" autocomplete="off"></label>
    <div class="chips" role="tablist">${chips.map(([k, l, c]) => `<button class="chip" role="tab" aria-selected="${ui.filtre === k}" data-action="filtre" data-f="${k}">${l} <b>${c}</b></button>`).join("")}</div>
    <button class="btn secondaire bloc" data-action="ajouterMembre">${ic("plus")} Ajouter un membre</button>
    <div class="liste carte-liste" id="liste-membres">${listeMembresHTML()}</div>`;
  }
};

/* ---------- Fiche membre ---------- */
VUES.fiche = {
  titre: "Fiche du membre", sansNav: false,
  html(e) {
    const m = membre(e.id);
    if (!m) return vide("Ce membre n'existe plus.");
    const dus = moisDus(m);
    const vs = versementsDe(m.id);
    // calendrier : de l'année d'inscription à l'année en cours (ou plus si payé d'avance)
    const derniersPayes = S.affectations.filter(a => a.membreId === m.id && !a.annule).map(a => a.mois).sort();
    const fin = [Mois.courant(), derniersPayes[derniersPayes.length - 1] || ""].sort().pop();
    let cal = "";
    for (let a = Mois.parse(debutMembre(m)).a; a <= Mois.parse(fin).a; a++) {
      cal += `<div class="cal-annee"><span class="cal-a">${a}</span><div class="cal-mois">` +
        MOIS_COURT.map((mc, i) => { const s = statutMois(m, Mois.cle(a, i)); return `<span class="cal c-${s}" title="${MOIS[i]} ${a}">${mc}</span>`; }).join("") + "</div></div>";
    }
    return `
    <div class="fiche-tete">${avatar(m, true)}
      <div><div class="fiche-nom">${echapper(nomComplet(m))}</div>
      <div class="fiche-sous">Inscrit en ${Mois.bas(m.inscription)}${m.tel ? ` · <a href="tel:${echapper(m.tel.replace(/\s/g, ""))}">${ic("tel", 16)} ${echapper(m.tel)}</a>` : ""}</div>
      <div style="margin-top:6px">${etatMembre(m).badge}</div></div></div>
    <div class="tuiles trois">
      <div class="tuile"><span>Total versé</span><strong class="t-ok">${argent(totalVerse(m.id))}</strong></div>
      <div class="tuile"><span>Mois réglés</span><strong>${moisRegles(m)}</strong></div>
      <div class="tuile"><span>Mois dus</span><strong class="${dus.length ? "t-ko" : "t-ok"}">${dus.length}</strong></div>
    </div>
    ${m.actif ? `<button class="btn primaire xl bloc" data-action="payer" data-id="${m.id}">${ic("plus", 24)} Enregistrer un paiement</button>` : ""}
    ${dus.length ? `<div class="carte"><h3>Mois à payer</h3><p class="t-ko fort">${argent(dus.reduce((s, k) => s + montantDe(k), 0))} · ${echapper(dus.map(k => Mois.libelle(k)).join(", "))}</p></div>` : ""}
    <div class="carte"><h3>Ses mois</h3>${cal}
      <div class="legende"><span><i class="c-paye"></i>Payé</span><span><i class="c-retard"></i>En retard</span><span><i class="c-apayer"></i>Ce mois</span><span><i class="c-avenir"></i>À venir</span></div></div>
    <div class="carte"><h3>Historique des paiements</h3>
      ${vs.length ? vs.map(v => {
        const mois = moisDuVersement(v);
        return `<div class="histo ${v.annule ? "annule" : ""}">
          <div class="histo-l1"><strong class="${v.annule ? "barre" : ""}">${argent(v.montant)}</strong><span>Reçu le ${dateFr(v.date)} · ${echapper(v.mode)}</span></div>
          <div class="histo-l2">${pluriel(mois.length, "mois", "mois")} : ${echapper(libelleMoisListe(mois))}${v.note ? " · " + echapper(v.note) : ""}</div>
          ${v.annule ? `<div class="histo-l2 t-ko">Annulé${v.motif ? " : " + echapper(v.motif) : ""}</div>`
            : `<button class="lien-danger" data-action="annulerVersement" data-id="${v.id}">Annuler ce paiement</button>`}
        </div>`;
      }).join("") : '<p class="aide">Aucun paiement pour le moment.</p>'}
    </div>
    <div class="actions-2">
      <button class="btn secondaire" data-action="modifierMembre" data-id="${m.id}">${ic("crayon", 20)} Modifier</button>
      ${m.actif ? `<button class="btn danger" data-action="archiverMembre" data-id="${m.id}">${ic("archive", 20)} Archiver</button>`
        : `<button class="btn secondaire" data-action="reactiverMembre" data-id="${m.id}">Réactiver</button>`}
    </div>`;
  }
};

/* ---------- C. Ajouter / modifier un membre ---------- */
function optionsMois(sel) { return MOIS.map((n, i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${n}</option>`).join(""); }
function optionsAnnees(sel, avant, apres) {
  let r = ""; const a = new Date().getFullYear();
  for (let y = a - (avant || 3); y <= a + (apres || 1); y++) r += `<option ${y === sel ? "selected" : ""}>${y}</option>`;
  return r;
}
VUES.formMembre = {
  titre: (e) => e.id ? "Modifier le membre" : "Ajouter un membre", sansNav: true,
  html(e) {
    const m = e.id ? membre(e.id) : { nom: "", prenom: "", tel: "", inscription: Mois.courant() };
    const ins = Mois.parse(m.inscription);
    return `
    <form id="form-membre" class="formulaire" novalidate>
      <label class="champ"><span>Nom <em>*</em></span><input name="nom" value="${echapper(m.nom)}" autocapitalize="characters" autocomplete="off" enterkeyhint="next" required></label>
      <label class="champ"><span>Prénom</span><input name="prenom" value="${echapper(m.prenom)}" autocapitalize="words" autocomplete="off" enterkeyhint="next"></label>
      <label class="champ"><span>Téléphone <small>(facultatif)</small></span><input name="tel" type="tel" inputmode="tel" value="${echapper(m.tel)}" autocomplete="off" enterkeyhint="done" placeholder="07 00 00 00 00"></label>
      <div class="champ"><span>Doit cotiser à partir de</span>
        <div class="deux"><select name="mois" aria-label="Mois">${optionsMois(ins.m)}</select><select name="annee" aria-label="Année">${optionsAnnees(ins.a)}</select></div>
        <small class="aide">Avant cette date, on ne lui demande rien.</small></div>
      <p class="erreur" id="erreur-membre" hidden></p>
      <div class="barre-action"><button class="btn primaire xl bloc" type="submit">${ic("check", 24)} Enregistrer</button></div>
    </form>`;
  },
  apres(e) {
    const f = $("#form-membre");
    if (!e.id) setTimeout(() => f.nom.focus(), 60);
    f.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = { nom: f.nom.value.trim(), prenom: f.prenom.value.trim(), tel: f.tel.value.trim(), inscription: Mois.cle(Number(f.annee.value), Number(f.mois.value)) };
      const err = $("#erreur-membre");
      if (!d.nom) { err.textContent = "Écrivez au moins le nom du membre."; err.hidden = false; f.nom.focus(); return; }
      const valider = () => {
        if (e.id) { modifierMembre(e.id, d); toast("Modifications enregistrées"); retour(); }
        else { const m = ajouterMembre(d); toast(nomComplet(m) + " a été ajouté"); remplacer("fiche", { id: m.id }); }
      };
      const doublon = doublonProbable(d.nom, d.prenom, e.id);
      if (doublon) {
        fenetre("Ce nom existe déjà", `<p>Un membre s'appelle déjà <strong>${echapper(nomComplet(doublon))}</strong>. Est-ce bien une autre personne ?</p>`,
          [{ texte: "Oui, c'est une autre personne", classe: "primaire", action: valider }, { texte: "Non, annuler", classe: "secondaire" }]);
      } else valider();
    });
  }
};

/* ---------- D. Enregistrer un paiement (3 étapes) ---------- */
function optionsMoisPaiement(m) {
  const dus = moisDus(m);
  const debutAvance = [Mois.ajouter(Mois.courant(), 1), debutMembre(m)].sort().pop();
  const avance = Mois.entre(debutAvance, Mois.ajouter(debutAvance, 11)).filter(k => concerne(m, k) && !estPaye(m.id, k));
  return [...dus, ...avance];
}
VUES.payer = {
  titre: (e) => ["Qui paie ?", "Quels mois ?", "Vérifier et confirmer"][e.etape - 1], sansNav: true,
  html(e) {
    const etapes = `<ol class="etapes" aria-label="Étape ${e.etape} sur 3">${[1, 2, 3].map(i => `<li class="${i < e.etape ? "fait" : i === e.etape ? "en-cours" : ""}"><span>${i < e.etape ? ic("check", 14) : i}</span>${["Membre", "Mois", "Confirmer"][i - 1]}</li>`).join("")}</ol>`;
    if (e.etape === 1) {
      const actifs = S.membres.filter(m => m.actif);
      return etapes + `
      <label class="recherche">${ic("recherche", 20)}<input type="search" placeholder="Rechercher un membre" data-input="rechercherPayeur" autocomplete="off" enterkeyhint="search"></label>
      <div class="liste carte-liste" id="liste-payeurs">${actifs.map(m => ligneMembre(m, etatMembre(m).badge + ic("suivant", 18), "choisirPayeur")).join("")}</div>`;
    }
    const m = membre(e.membreId);
    if (e.etape === 2) {
      const opts = optionsMoisPaiement(m);
      const n = e.mois.length, total = e.mois.reduce((s, k) => s + montantDe(k), 0);
      const c = Mois.courant();
      return etapes + `
      <div class="carte mini">${avatar(m)}<strong>${echapper(nomComplet(m))}</strong></div>
      <p class="consigne">Touchez les mois que ce paiement couvre. Les mois en retard sont en premier.</p>
      <div class="raccourcis"><span>Raccourci :</span>${[1, 2, 3, 6, 12].filter(x => x <= opts.length).map(x => `<button class="chip" data-action="nbMois" data-n="${x}">${x} mois</button>`).join("")}</div>
      <div class="choix-mois">${opts.map(k => {
        const sel = e.mois.includes(k);
        const etat = k < c ? '<span class="badge ko">En retard</span>' : k === c ? '<span class="badge att">Ce mois</span>' : '<span class="badge neutre">D\'avance</span>';
        return `<button class="mois-opt" role="checkbox" aria-checked="${sel}" data-action="basculerMois" data-k="${k}">
          <span class="case-coche">${sel ? ic("check", 18) : ""}</span><span class="mo-lib">${Mois.libelle(k)}</span>${etat}<span class="mo-prix">${argent(montantDe(k))}</span></button>`;
      }).join("") || vide("Tous les mois sont déjà payés.")}</div>
      <div class="barre-action">
        <div class="recap-bas"><span>${pluriel(n, "mois", "mois")}</span><strong>${argent(total)}</strong></div>
        <button class="btn primaire xl" data-action="etape" data-n="3" ${n ? "" : "disabled"}>Continuer ${ic("suivant", 20)}</button>
      </div>`;
    }
    const total = e.mois.reduce((s, k) => s + montantDe(k), 0);
    return etapes + `
    <div class="carte recap">
      <div class="recap-l"><span>Membre</span><strong>${echapper(nomComplet(m))}</strong></div>
      <div class="recap-l"><span>Mois couverts</span><strong>${e.mois.map(k => Mois.libelle(k)).join("<br>")}</strong></div>
      <div class="recap-l"><span>Calcul</span><strong>${e.mois.length} × ${argent(montantDe(e.mois[0]))}</strong></div>
      <div class="recap-total"><span>Montant à recevoir</span><strong>${argent(total)}</strong></div>
    </div>
    <div class="champ"><span>Date de réception de l'argent</span><input type="date" id="p-date" value="${e.date}" max="${aujourdhuiISO()}"></div>
    <div class="champ"><span>Mode de paiement</span>
      <div class="seg" role="radiogroup">${MODES.map(x => `<button role="radio" aria-checked="${e.mode === x}" data-action="mode" data-m="${x}">${x}</button>`).join("")}</div></div>
    <label class="champ"><span>Note <small>(facultatif)</small></span><input id="p-note" value="${echapper(e.note)}" placeholder="Ex : référence du dépôt" enterkeyhint="done" autocomplete="off"></label>
    <div class="barre-action"><button class="btn succes xl bloc" data-action="confirmerPaiement">${ic("check", 24)} Confirmer le paiement</button></div>`;
  },
  apres(e) {
    if (e.etape === 3) {
      $("#p-date").addEventListener("change", (ev) => majEtat({ date: ev.target.value }));
      $("#p-note").addEventListener("input", (ev) => majEtat({ note: ev.target.value }));
    }
  }
};

/* Confirmation / reçu */
VUES.recu = {
  titre: "Paiement enregistré",
  html(e) {
    const v = S.versements.find(x => x.id === e.versementId);
    if (!v) return vide("Paiement introuvable.");
    const m = membre(v.membreId), mois = moisDuVersement(v);
    return `
    <div class="succes-tete"><div class="succes-rond">${ic("check", 44)}</div>
      <h2>Paiement enregistré</h2><p>${echapper(nomComplet(m))} · ${argent(v.montant)}</p></div>
    <div class="carte recap">
      <div class="recap-l"><span>Membre</span><strong>${echapper(nomComplet(m))}</strong></div>
      <div class="recap-l"><span>Mois payés</span><strong>${mois.map(k => Mois.libelle(k)).join("<br>")}</strong></div>
      <div class="recap-l"><span>Reçu le</span><strong>${dateFr(v.date)}</strong></div>
      <div class="recap-l"><span>Mode</span><strong>${echapper(v.mode)}</strong></div>
      <div class="recap-total"><span>Montant</span><strong>${argent(v.montant)}</strong></div>
    </div>
    <button class="btn secondaire bloc" data-action="envoyerRecu" data-id="${v.id}">${ic("message")} Envoyer le reçu sur WhatsApp</button>
    <div class="actions-2">
      <button class="btn secondaire" data-action="ficheRemplace" data-id="${m.id}">Voir sa fiche</button>
      <button class="btn primaire" data-action="onglet" data-onglet="accueil">Retour à l'accueil</button>
    </div>`;
  }
};

/* ---------- E. Suivi des paiements ---------- */
VUES.paiements = {
  titre: "Suivi des paiements",
  html() {
    const M = ui.moisSuivi, st = statsMois(M);
    let liste = st.concernes;
    if (ui.filtreSuivi === "payes") liste = st.payes;
    if (ui.filtreSuivi === "non") liste = st.nonPayes;
    return `
    ${navMois(M, "moisSuivi")}
    <div class="tuiles trois">
      <div class="tuile"><span>Ont payé</span><strong class="t-ok">${st.payes.length}</strong></div>
      <div class="tuile"><span>N'ont pas payé</span><strong class="${st.nonPayes.length ? "t-ko" : "t-ok"}">${st.nonPayes.length}</strong></div>
      <div class="tuile"><span>Recouvrement</span><strong>${st.taux} %</strong></div>
    </div>
    <div class="progress large"><div style="width:${st.taux}%"></div></div>
    <div class="chips">${[["tous", "Tous", st.concernes.length], ["payes", "Ont payé", st.payes.length], ["non", "Pas payé", st.nonPayes.length]]
      .map(([k, l, c]) => `<button class="chip" aria-selected="${ui.filtreSuivi === k}" data-action="filtreSuivi" data-f="${k}">${l} <b>${c}</b></button>`).join("")}</div>
    <div class="liste carte-liste">${liste.length ? liste.map(m => {
      const a = affectation(m.id, M), v = a && versement(a.versementId);
      return ligneMembre(m, badgeMois(statutMois(m, M)) + (v ? `<span class="ll-sous">le ${dateFr(v.date)}</span>` : ""));
    }).join("") : vide("Personne dans cette liste.")}</div>
    <p class="aide centre">Cet écran sert à consulter. Pour noter un paiement :</p>
    <button class="btn primaire bloc" data-action="payer">${ic("plus")} Enregistrer un paiement</button>`;
  }
};

/* ---------- F. Rapports ---------- */
VUES.rapports = {
  titre: "Rapports",
  html() {
    const r = ui.rapport;
    const du = Mois.parse(r.du), au = Mois.parse(r.au);
    return `
    <div class="carte">
      <h3>1. Quel rapport ?</h3>
      <div class="seg" role="radiogroup">
        <button role="radio" aria-checked="${r.type === "mensuel"}" data-action="rapportType" data-t="mensuel">Un mois</button>
        <button role="radio" aria-checked="${r.type === "periode"}" data-action="rapportType" data-t="periode">Une période</button></div>
      ${r.type === "mensuel" ? navMois(r.mois, "moisRapport") : `
        <div class="periode">
          <div class="champ"><span>Du mois de</span><div class="deux"><select data-change="rDuM">${optionsMois(du.m)}</select><select data-change="rDuA">${optionsAnnees(du.a)}</select></div></div>
          <div class="champ"><span>Au mois de</span><div class="deux"><select data-change="rAuM">${optionsMois(au.m)}</select><select data-change="rAuA">${optionsAnnees(au.a)}</select></div></div>
        </div>`}
      <h3>2. Quel niveau de détail ?</h3>
      <div class="seg" role="radiogroup">
        <button role="radio" aria-checked="${!r.detail}" data-action="rapportDetail" data-d="0">Résumé</button>
        <button role="radio" aria-checked="${r.detail}" data-action="rapportDetail" data-d="1">Détaillé</button></div>
    </div>
    <div class="carte">
      <h3>3. Partager</h3>
      <div class="partage">
        <button class="btn primaire xl" data-action="rapportPDF">${ic("partage")} Partager en PDF</button>
        <button class="btn secondaire" data-action="rapportWord">${ic("rapports")} Partager en Word</button>
        <button class="btn secondaire" data-action="rapportMessage">${ic("message")} Message WhatsApp</button>
        <button class="btn secondaire" data-action="imprimer">${ic("imprimer")} Imprimer</button>
      </div>
      <p class="aide">Le menu de partage s'ouvre : choisissez WhatsApp, puis le groupe. Rien n'est envoyé sans votre accord.</p>
    </div>
    <h3 class="section">Aperçu</h3>
    <div class="carte apercu" id="apercu">${rapportHTML(modeleRapport(r))}</div>`;
  }
};

/* ---------- G. Paramètres ---------- */
VUES.reglages = {
  titre: "Paramètres", sansNav: true,
  html() {
    const d = Mois.parse(S.asso.debutSuivi);
    return `
    <form id="form-reglages" class="carte formulaire" novalidate>
      <h3>L'association</h3>
      <label class="champ"><span>Nom de l'association</span><input name="nom" value="${echapper(S.asso.nom)}" autocomplete="off"></label>
      <label class="champ"><span>Cotisation par mois</span><input name="montant" type="number" inputmode="numeric" min="0" step="50" value="${S.asso.montant}"></label>
      <label class="champ"><span>Monnaie</span><input name="devise" value="${echapper(S.asso.devise)}" autocomplete="off"></label>
      <label class="champ"><span>Numéro de dépôt (Mobile Money)</span><input name="depot" type="tel" inputmode="tel" value="${echapper(S.asso.depot)}" autocomplete="off"></label>
      <label class="champ"><span>Nom du trésorier</span><input name="tresorier" value="${echapper(S.asso.tresorier)}" autocomplete="name"></label>
      <div class="champ"><span>Début du suivi des cotisations</span>
        <div class="deux"><select name="dmois" aria-label="Mois">${optionsMois(d.m)}</select><select name="dannee" aria-label="Année">${optionsAnnees(d.a, 5)}</select></div></div>
      <button class="btn primaire bloc" type="submit">${ic("check")} Enregistrer</button>
    </form>
    <div class="carte">
      <h3>Sauvegarde</h3>
      <p class="aide">Les données restent sur cet appareil. Si le téléphone est perdu ou l'application désinstallée sans copie, tout est perdu. Faites une copie chaque mois et envoyez-la vous sur WhatsApp ou Google Drive.</p>
      <div class="partage">
        <button class="btn primaire" data-action="sauvegarder">${ic("sauver")} Faire une copie</button>
        <button class="btn secondaire" data-action="restaurer">${ic("restaurer")} Reprendre une copie</button>
      </div>
      <p class="aide">${S.meta.derniereSauvegarde ? "Dernière copie : " + dateFr(S.meta.derniereSauvegarde) : "Aucune copie faite pour le moment."}</p>
      <input type="file" id="fichier-restaurer" accept=".json,application/json" hidden>
    </div>
    <div class="carte">
      <h3>Sécurité</h3>
      <p class="aide">${S.asso.pin ? "Un code PIN est demandé à l'ouverture." : "Aucun code PIN. Vous pouvez en ajouter un pour que personne d'autre n'ouvre l'application."}</p>
      ${S.asso.pin ? `<div class="partage"><button class="btn secondaire" data-action="definirPin">${ic("cadenas")} Changer le code</button>
        <button class="btn danger" data-action="retirerPin">Retirer le code</button></div>`
        : `<button class="btn secondaire bloc" data-action="definirPin">${ic("cadenas")} Ajouter un code PIN</button>`}
    </div>
    <div class="carte liste-liens">
      <button class="ligne-liste" data-action="ouvrir" data-vue="journal">${ic("historique")}<span class="ll-texte"><span class="ll-nom">Historique des modifications</span><span class="ll-sous">${S.journal.length} opérations</span></span>${ic("suivant", 18)}</button>
      <button class="ligne-liste" data-action="ouvrir" data-vue="aide">${ic("aide")}<span class="ll-texte"><span class="ll-nom">Aide</span><span class="ll-sous">Comment utiliser l'application</span></span>${ic("suivant", 18)}</button>
    </div>
    <p class="aide centre">Ma Cotisation · suivi des cotisations seulement (pas de comptabilité ni de solde de caisse).</p>`;
  },
  apres() {
    const f = $("#form-reglages");
    f.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const avant = JSON.stringify({ nom: S.asso.nom, montant: S.asso.montant, devise: S.asso.devise, depot: S.asso.depot, tresorier: S.asso.tresorier, debut: S.asso.debutSuivi });
      const montant = Math.max(0, Math.round(Number(f.montant.value) || 0));
      const appliquer = () => {
        if (montant !== S.asso.montant) changerMontant(montant);
        Object.assign(S.asso, { nom: f.nom.value.trim(), devise: f.devise.value.trim() || "FCFA", depot: f.depot.value.trim(), tresorier: f.tresorier.value.trim(),
          debutSuivi: Mois.cle(Number(f.dannee.value), Number(f.dmois.value)) });
        const apres = JSON.stringify({ nom: S.asso.nom, montant: S.asso.montant, devise: S.asso.devise, depot: S.asso.depot, tresorier: S.asso.tresorier, debut: S.asso.debutSuivi });
        if (apres !== avant) journaliser("Paramètres modifiés", "Association", avant, apres);
        enregistrer(); toast("Paramètres enregistrés"); rendre();
      };
      if (!montant) { toast("Indiquez le montant de la cotisation"); f.montant.focus(); return; }
      if (montant !== S.asso.montant) {
        fenetre("Changer la cotisation ?", `<p>La cotisation passera de <strong>${argent(S.asso.montant)}</strong> à <strong>${argent(montant)}</strong> à partir de <strong>${Mois.bas(Mois.courant())}</strong>. Les mois précédents gardent l'ancien montant.</p>`,
          [{ texte: "Oui, changer", classe: "primaire", action: appliquer }, { texte: "Annuler", classe: "secondaire" }]);
      } else appliquer();
    });
    $("#fichier-restaurer").addEventListener("change", lireCopie);
  }
};

VUES.journal = {
  titre: "Historique", sansNav: true,
  html() {
    const j = [...S.journal].reverse();
    return `<p class="aide">Tout ce qui a été fait dans l'application, du plus récent au plus ancien. Rien n'est effacé.</p>
    <div class="liste carte-liste">${j.map(x => `<div class="journal-l">
      <div class="j-tete"><strong>${echapper(x.action)}</strong><span>${heureFr(x.date)}</span></div>
      <div>${echapper(x.element)}</div>
      ${x.avant ? `<div class="j-det">Avant : ${echapper(x.avant)}</div>` : ""}
      ${x.apres ? `<div class="j-det">${x.avant ? "Après : " : ""}${echapper(x.apres)}</div>` : ""}
      ${x.motif ? `<div class="j-det t-ko">Motif : ${echapper(x.motif)}</div>` : ""}</div>`).join("") || vide("Aucune opération.")}</div>`;
  }
};

VUES.aide = {
  titre: "Aide", sansNav: true,
  html() {
    return `<div class="carte aide-texte">
      <h3>Noter un paiement</h3><ol><li>Touchez <strong>Enregistrer un paiement</strong>.</li><li>Choisissez le membre.</li><li>Touchez les mois qu'il paie (3 000 F = 3 mois).</li><li>Vérifiez la date et le mode, puis <strong>Confirmer</strong>.</li></ol>
      <h3>Une erreur ?</h3><p>Ouvrez la fiche du membre, puis « Annuler ce paiement » et donnez la raison. Le paiement reste visible dans l'historique, barré.</p>
      <h3>Envoyer le point au groupe</h3><p>Onglet <strong>Rapports</strong> : choisissez le mois ou la période, puis <strong>Partager en PDF</strong> et choisissez WhatsApp.</p>
      <h3>Un nouveau membre</h3><p>Onglet <strong>Membres</strong>, puis <strong>Ajouter un membre</strong>. Indiquez le mois à partir duquel il doit cotiser.</p>
      <h3>Un membre qui part</h3><p>Sur sa fiche, <strong>Archiver</strong>. On ne lui demande plus rien, mais son historique est gardé.</p>
      <h3>Ne rien perdre</h3><p>Paramètres, puis <strong>Faire une copie</strong>, une fois par mois.</p></div>`;
  }
};

/* ================= Actions ================= */
const ACTIONS = {
  retour,
  onglet: (d) => onglet(d.onglet),
  ouvrir: (d) => ouvrir(d.vue),
  fiche: (d) => ouvrir("fiche", { id: d.id }),
  ficheRemplace: (d) => remplacer("fiche", { id: d.id }),
  moisAccueil: (d) => { ui.moisAccueil = Mois.ajouter(ui.moisAccueil, Number(d.pas)); rendre(); },
  moisSuivi: (d) => { ui.moisSuivi = Mois.ajouter(ui.moisSuivi, Number(d.pas)); rendre(); },
  moisRapport: (d) => { ui.rapport.mois = Mois.ajouter(ui.rapport.mois, Number(d.pas)); rendre(); },
  voirRetards: () => { ui.filtre = "retard"; ui.recherche = ""; onglet("membres"); },
  filtre: (d) => { ui.filtre = d.f; rendre(); },
  filtreSuivi: (d) => { ui.filtreSuivi = d.f; rendre(); },
  ajouterMembre: () => ouvrir("formMembre"),
  modifierMembre: (d) => ouvrir("formMembre", { id: d.id }),
  archiverMembre: (d) => {
    const m = membre(d.id);
    fenetre("Archiver " + nomComplet(m) + " ?", `<p>On ne lui demandera plus de cotisation après <strong>${Mois.bas(Mois.courant())}</strong>. Son historique est conservé et vous pourrez le réactiver.</p>`,
      [{ texte: "Archiver", classe: "danger", action: () => { archiverMembre(d.id); toast(nomComplet(m) + " est archivé"); rendre(); } }, { texte: "Annuler", classe: "secondaire" }]);
  },
  reactiverMembre: (d) => { reactiverMembre(d.id); toast("Membre réactivé"); rendre(); },
  annulerVersement: (d) => {
    const v = S.versements.find(x => x.id === d.id);
    fenetre("Annuler ce paiement ?", `<p>${argent(v.montant)} reçu le ${dateFr(v.date)} pour ${echapper(libelleMoisListe(moisDuVersement(v)))}.</p>
      <p>Les mois redeviendront « à payer ». Le paiement restera visible, barré, dans l'historique.</p>
      <label class="champ"><span>Pourquoi ? <em>*</em></span><input id="motif" placeholder="Ex : erreur de membre" autocomplete="off"></label>`,
      [{ texte: "Annuler le paiement", classe: "danger", garder: true, action: () => {
        const motif = $("#motif").value.trim();
        if (!motif) { $("#motif").focus(); $("#motif").classList.add("invalide"); return false; }
        annulerVersement(d.id, motif); toast("Paiement annulé"); rendre();
      } }, { texte: "Garder le paiement", classe: "secondaire" }]);
    setTimeout(() => $("#motif") && $("#motif").focus(), 80);
  },
  /* paiement */
  payer: (d) => {
    if (d.id) ouvrir("payer", { etape: 2, membreId: d.id, mois: moisDus(membre(d.id)).slice(0, 1), date: aujourdhuiISO(), mode: "Espèces", note: "" });
    else ouvrir("payer", { etape: 1, membreId: null, mois: [], date: aujourdhuiISO(), mode: "Espèces", note: "" });
  },
  choisirPayeur: (d) => {
    const e = pile[pile.length - 1];
    ouvrir("payer", Object.assign({}, e, { etape: 2, membreId: d.id, mois: moisDus(membre(d.id)).slice(0, 1) }));
  },
  basculerMois: (d) => {
    const e = pile[pile.length - 1];
    const mois = e.mois.includes(d.k) ? e.mois.filter(k => k !== d.k) : [...e.mois, d.k].sort();
    majEtat({ mois }); rendre();
  },
  nbMois: (d) => {
    const e = pile[pile.length - 1];
    majEtat({ mois: optionsMoisPaiement(membre(e.membreId)).slice(0, Number(d.n)) }); rendre();
  },
  etape: (d) => { const e = pile[pile.length - 1]; ouvrir("payer", Object.assign({}, e, { etape: Number(d.n) })); },
  mode: (d) => { majEtat({ mode: d.m }); document.querySelectorAll(".seg [data-action=mode]").forEach(b => b.setAttribute("aria-checked", b.dataset.m === d.m)); },
  confirmerPaiement: () => {
    const e = pile[pile.length - 1];
    const date = $("#p-date").value || aujourdhuiISO();
    if (date > aujourdhuiISO()) { toast("La date ne peut pas être dans le futur"); return; }
    let v;
    try { v = enregistrerVersement({ membreId: e.membreId, mois: e.mois, date, mode: e.mode, note: $("#p-note").value }); }
    catch (err) { fenetre("Impossible d'enregistrer", `<p>${echapper(err.message)}</p>`); return; }
    let n = 0; for (let i = pile.length - 1; i >= 0 && pile[i].vue === "payer"; i--) n++;
    revenirDe(n, () => ouvrir("recu", { versementId: v.id }));
  },
  envoyerRecu: (d) => {
    const v = S.versements.find(x => x.id === d.id), m = membre(v.membreId);
    partagerTexte(`*${nomAsso()}* — Reçu de cotisation\n\n👤 ${nomComplet(m)}\n💰 ${argent(v.montant)} reçu le ${dateFr(v.date)} (${v.mode})\n📅 ${moisDuVersement(v).map(Mois.libelle).join(", ")}\n\nMerci 🙏` + (S.asso.tresorier ? `\n${S.asso.tresorier}, trésorier` : ""));
  },
  /* rapports */
  rapportType: (d) => { ui.rapport.type = d.t; rendre(); },
  rapportDetail: (d) => { ui.rapport.detail = d.d === "1"; rendre(); },
  rapportPDF: async () => {
    if (!window.jspdf) { fenetre("PDF indisponible", "<p>Le module PDF est introuvable. Vérifiez que le dossier « lib » est bien à côté de l'application.</p>"); return; }
    const mod = modeleRapport(ui.rapport);
    const r = await partagerFichier(rapportPDF(mod), mod.nomFichier("pdf"), "application/pdf", nomAsso());
    if (r === "telecharge") guideEnvoi(mod.nomFichier("pdf"));
  },
  rapportWord: async () => {
    const mod = modeleRapport(ui.rapport);
    const r = await partagerFichier(rapportDOCX(mod), mod.nomFichier("docx"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", nomAsso());
    if (r === "telecharge") guideEnvoi(mod.nomFichier("docx"));
  },
  rapportMessage: () => partagerTexte(messageRapport(ui.rapport)),
  imprimer: () => window.print(),
  /* paramètres */
  sauvegarder: async () => {
    S.meta.derniereSauvegarde = new Date().toISOString();
    journaliser("Copie de sauvegarde", "Toutes les données", "", "");
    enregistrer();
    const nom = "Sauvegarde-Ma-Cotisation-" + aujourdhuiISO() + ".json";
    const r = await partagerFichier(new Blob([JSON.stringify(S)], { type: "application/json" }), nom, "application/json", "Sauvegarde Ma Cotisation");
    if (r === "telecharge") toast("Copie enregistrée dans Téléchargements");
    if (r === "partage") toast("Copie envoyée");
    rendre();
  },
  restaurer: () => $("#fichier-restaurer").click(),
  definirPin: () => {
    fenetre(S.asso.pin ? "Changer le code PIN" : "Ajouter un code PIN",
      `<p class="aide">4 chiffres. Notez-le quelque part : sans lui, impossible d'ouvrir l'application.</p>
       <label class="champ"><span>Nouveau code</span><input id="pin1" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>
       <label class="champ"><span>Encore une fois</span><input id="pin2" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label>
       <p class="erreur" id="pin-err" hidden></p>`,
      [{ texte: "Enregistrer le code", classe: "primaire", garder: true, action: () => {
        const a = $("#pin1").value, b = $("#pin2").value, err = $("#pin-err");
        if (!/^\d{4}$/.test(a)) { err.textContent = "Le code doit faire 4 chiffres."; err.hidden = false; return false; }
        if (a !== b) { err.textContent = "Les deux codes sont différents."; err.hidden = false; return false; }
        hacherPin(a).then(pin => { S.asso.pin = pin; journaliser("Code PIN", "Sécurité", "", "Code défini"); enregistrer(); toast("Code PIN enregistré"); rendre(); });
      } }, { texte: "Annuler", classe: "secondaire" }]);
    setTimeout(() => $("#pin1") && $("#pin1").focus(), 80);
  },
  retirerPin: () => {
    fenetre("Retirer le code PIN ?", `<label class="champ"><span>Code actuel</span><input id="pin0" type="password" inputmode="numeric" maxlength="4" autocomplete="off"></label><p class="erreur" id="pin-err" hidden></p>`,
      [{ texte: "Retirer le code", classe: "danger", garder: true, action: () => {
        verifierPin($("#pin0").value).then(ok => {
          if (!ok) { $("#pin-err").textContent = "Code incorrect."; $("#pin-err").hidden = false; return; }
          S.asso.pin = null; journaliser("Code PIN", "Sécurité", "Code défini", "Code retiré"); enregistrer();
          $("#dlg").close(); toast("Code PIN retiré"); rendre();
        });
        return false;
      } }, { texte: "Annuler", classe: "secondaire" }]);
  }
};

const ENTREES = {
  recherche: (v) => { ui.recherche = v; $("#liste-membres").innerHTML = listeMembresHTML(); },
  rechercherPayeur: (v) => {
    const q = normaliser(v);
    $("#liste-payeurs").innerHTML = S.membres.filter(m => m.actif && (!q || normaliser(nomComplet(m) + " " + m.tel).includes(q)))
      .map(m => ligneMembre(m, etatMembre(m).badge + ic("suivant", 18), "choisirPayeur")).join("") || vide("Aucun membre trouvé.");
  }
};
const CHANGEMENTS = {
  rDuM: (v) => { const p = Mois.parse(ui.rapport.du); ui.rapport.du = Mois.cle(p.a, Number(v)); rendre(); },
  rDuA: (v) => { const p = Mois.parse(ui.rapport.du); ui.rapport.du = Mois.cle(Number(v), p.m); rendre(); },
  rAuM: (v) => { const p = Mois.parse(ui.rapport.au); ui.rapport.au = Mois.cle(p.a, Number(v)); rendre(); },
  rAuA: (v) => { const p = Mois.parse(ui.rapport.au); ui.rapport.au = Mois.cle(Number(v), p.m); rendre(); }
};

document.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const f = ACTIONS[el.dataset.action];
  if (f) { ev.preventDefault(); f(el.dataset, el); }
});
document.addEventListener("input", (ev) => { const el = ev.target.closest("[data-input]"); if (el && ENTREES[el.dataset.input]) ENTREES[el.dataset.input](el.value); });
document.addEventListener("change", (ev) => { const el = ev.target.closest("[data-change]"); if (el && CHANGEMENTS[el.dataset.change]) CHANGEMENTS[el.dataset.change](el.value); });
document.querySelectorAll("#nav-bas button").forEach(b => b.addEventListener("click", () => {
  if (pile.length === 1 && pile[0].vue === b.dataset.onglet) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  onglet(b.dataset.onglet);
}));

/* ================= Fenêtres et messages ================= */
function fenetre(titre, html, boutons) {
  const d = $("#dlg");
  $("#dlg-titre").textContent = titre;
  $("#dlg-corps").innerHTML = html;
  const zone = $("#dlg-boutons"); zone.innerHTML = "";
  (boutons || [{ texte: "D'accord", classe: "primaire" }]).forEach(b => {
    const el = document.createElement("button");
    el.type = "button"; el.className = "btn bloc " + (b.classe || "secondaire"); el.textContent = b.texte;
    el.onclick = () => {
      if (b.garder) { const r = b.action(); if (r === false) return; d.close(); return; }
      d.close(); if (b.action) b.action();
    };
    zone.appendChild(el);
  });
  d.showModal();
}
function guideEnvoi(nom) {
  fenetre("Le fichier est prêt",
    `<p>Le fichier <strong>${echapper(nom)}</strong> est dans le dossier <strong>Téléchargements</strong>.</p>
     <ol><li>Ouvrez WhatsApp et le groupe de l'association.</li><li>Touchez le trombone 📎, puis <strong>Document</strong>.</li><li>Choisissez le fichier et envoyez.</li></ol>`,
    [{ texte: "Ouvrir WhatsApp", classe: "primaire", action: () => window.open("https://web.whatsapp.com/", "_blank") }, { texte: "Fermer", classe: "secondaire" }]);
}
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("visible");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("visible"), 2400);
}

/* ================= Sauvegarde : reprise ================= */
function lireCopie(ev) {
  const f = ev.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    let x;
    try {
      x = JSON.parse(r.result);
      if (x && Array.isArray(x.membres) && Array.isArray(x.versements)) x = Object.assign(etatVide(), x);
      else if (x && Array.isArray(x.membres) && x.paiements) x = migrerV1(x);
      else throw new Error();
    } catch (e) { fenetre("Fichier non reconnu", "<p>Ce fichier n'est pas une copie de sauvegarde de Ma Cotisation.</p>"); return; }
    fenetre("Reprendre cette copie ?",
      `<p>Elle contient <strong>${x.membres.length} membres</strong> et <strong>${x.versements.length} paiements</strong>${x.meta && x.meta.derniereSauvegarde ? ", copie du " + dateFr(x.meta.derniereSauvegarde) : ""}.</p><p>Les données actuelles de l'appareil seront remplacées.</p>`,
      [{ texte: "Oui, reprendre", classe: "primaire", action: () => {
        S = x; journaliser("Reprise d'une copie", f.name, "", x.membres.length + " membres, " + x.versements.length + " paiements"); enregistrer();
        toast("Copie reprise"); onglet("accueil");
      } }, { texte: "Annuler", classe: "secondaire" }]);
  };
  r.readAsText(f);
  ev.target.value = "";
}

/* ================= Code PIN ================= */
async function hacherPin(pin, sel) {
  sel = sel || Math.random().toString(36).slice(2, 10);
  const texte = sel + ":" + pin;
  let empreinte;
  if (window.crypto && crypto.subtle) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texte));
    empreinte = [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  } else {
    let h = 2166136261; for (const c of texte) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } empreinte = "f" + (h >>> 0).toString(16);
  }
  return { sel, empreinte };
}
async function verifierPin(pin) {
  if (!S.asso.pin) return true;
  return (await hacherPin(pin, S.asso.pin.sel)).empreinte === S.asso.pin.empreinte;
}
function verrouiller() {
  const v = $("#verrou"); let saisie = "";
  v.hidden = false;
  const points = () => { v.querySelector(".pin-points").innerHTML = [0, 1, 2, 3].map(i => `<span class="${i < saisie.length ? "plein" : ""}"></span>`).join(""); };
  v.querySelector(".pin-asso").textContent = nomAsso();
  v.querySelector(".clavier").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "x"].map(k =>
    k === "" ? "<span></span>" : `<button type="button" data-k="${k}" aria-label="${k === "x" ? "Effacer" : k}">${k === "x" ? ic("effacer", 26) : k}</button>`).join("");
  points();
  v.querySelector(".clavier").onclick = async (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    if (b.dataset.k === "x") saisie = saisie.slice(0, -1); else if (saisie.length < 4) saisie += b.dataset.k;
    points();
    if (saisie.length === 4) {
      if (await verifierPin(saisie)) { v.hidden = true; demarrer(); }
      else { v.querySelector(".pin-points").classList.add("faux"); setTimeout(() => { v.querySelector(".pin-points").classList.remove("faux"); saisie = ""; points(); }, 450); }
    }
  };
}

/* ================= Démarrage ================= */
function demarrer() {
  if (NATIF) {
    Natif.StatusBar.setBackgroundColor({ color: "#173B61" }).catch(() => {});
    Natif.StatusBar.setStyle({ style: "DARK" }).catch(() => {});
  }
  enregistrer();
  history.replaceState({ pile }, "");
  rendre(true);
  if (!S.meta.bienvenueVue) {
    fenetre("Bienvenue dans Ma Cotisation",
      `<p>Les <strong>${S.membres.length} membres</strong> du groupe sont déjà enregistrés, avec les versements de la liste du 1er octobre 2026.</p>
       <ol><li>Quand quelqu'un paie : <strong>Enregistrer un paiement</strong>.</li>
       <li>Pour voir qui doit encore payer : onglet <strong>Paiements</strong>.</li>
       <li>Pour envoyer le point au groupe WhatsApp : onglet <strong>Rapports</strong>.</li></ol>
       <p class="aide">Pensez à écrire votre nom de trésorier dans les Paramètres (roue en haut à droite).</p>`,
      [{ texte: "C'est parti", classe: "primaire", action: () => { S.meta.bienvenueVue = true; enregistrer(); } }]);
  }
}
if (S.asso.pin) verrouiller(); else demarrer();

if (!NATIF && "serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
