/* Ma Cotisation — données, règles métier et calculs.
   Tout est stocké sur l'appareil (localStorage). */
"use strict";

const CLE_V2 = "ma-cotisation-v2";
const CLE_V1 = "caisse-asso-v1";
const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MOIS_COURT = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];
const MODES = ["Espèces", "Mobile Money", "Autre"];

/* ---------- Mois au format "AAAA-MM" ---------- */
const Mois = {
  cle: (a, m) => a + "-" + String(m + 1).padStart(2, "0"),
  parse: (k) => { const [a, m] = k.split("-").map(Number); return { a, m: m - 1 }; },
  idx: (k) => { const p = Mois.parse(k); return p.a * 12 + p.m; },
  deIdx: (i) => Mois.cle(Math.floor(i / 12), i % 12),
  ajouter: (k, n) => Mois.deIdx(Mois.idx(k) + n),
  courant: () => { const d = new Date(); return Mois.cle(d.getFullYear(), d.getMonth()); },
  libelle: (k) => { const p = Mois.parse(k); return MOIS[p.m] + " " + p.a; },
  bas: (k) => { const p = Mois.parse(k); return MOIS[p.m].toLowerCase() + " " + p.a; },
  court: (k, annee) => { const p = Mois.parse(k); return MOIS_COURT[p.m] + (annee ? " " + String(p.a).slice(2) : ""); },
  entre: (a, b) => { const r = []; for (let i = Mois.idx(a); i <= Mois.idx(b); i++) r.push(Mois.deIdx(i)); return r; },
  premierJour: (k) => k + "-01",
  dernierJour: (k) => { const p = Mois.parse(k); return k + "-" + String(new Date(p.a, p.m + 1, 0).getDate()).padStart(2, "0"); }
};

/* ---------- Petits outils ---------- */
function aujourdhuiISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function dateFr(iso) { if (!iso) return ""; const [a, m, j] = iso.slice(0, 10).split("-"); return j + "/" + m + "/" + a; }
function dateLongue(d) { d = d || new Date(); return d.getDate() + " " + MOIS[d.getMonth()].toLowerCase() + " " + d.getFullYear(); }
function heureFr(iso) { const d = new Date(iso); return dateFr(iso.slice(0, 10)) + " à " + String(d.getHours()).padStart(2, "0") + "h" + String(d.getMinutes()).padStart(2, "0"); }
function uid(p) { return (p || "x") + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function nombre(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function argent(n) { return nombre(n) + " " + ((S && S.asso.devise) || "FCFA"); }
function echapper(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function normaliser(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function pluriel(n, mot, motPluriel) { return n + " " + (n > 1 ? (motPluriel || mot + "s") : mot); }

/* ---------- État ---------- */
function etatVide() {
  return {
    version: 2,
    asso: {
      nom: "", montant: 1000, devise: "FCFA", depot: "", tresorier: "",
      debutSuivi: Mois.courant(), creeLe: new Date().toISOString(),
      tarifs: [{ depuis: "2000-01", montant: 1000 }],
      pin: null
    },
    membres: [],      // { id, nom, prenom, tel, inscription:"AAAA-MM", actif, archiveDepuis, creeLe }
    versements: [],   // { id, membreId, date:"AAAA-MM-JJ", montant, mode, note, creeLe, modifieLe, annule, motif }
    affectations: [], // { id, versementId, membreId, mois:"AAAA-MM", montant, annule }
    journal: [],      // { id, date, action, element, avant, apres, motif }
    meta: { derniereSauvegarde: null, bienvenueVue: false }
  };
}

/* Liste du Groupe Webe Grin au 01/10/2026 (dans l'ordre de la liste papier) */
function etatDepart() {
  const e = etatVide();
  e.asso.nom = "Groupe Webe Grin";
  e.asso.depot = "05 04 31 08 69";
  e.asso.debutSuivi = "2026-10";
  const liste = [
    ["SEGNON", "KOFFI", 1000],
    ["OUATTARA", "TAFENEGNINRI (Ahmed)", 0],
    ["KARIDIOULA", "LOGOFO LOUIS", 1000],
    ["OUATTARA", "ABOU (boucher)", 0],
    ["TOURE", "SOULEYMANE", 0],
    ["FOFANA", "ADAMA", 0],
    ["COULIBALY", "GBOROGBE", 0],
    ["COULIBALY", "LAMISSA", 0],
    ["OUATTARA", "ABOU (chauffeur)", 0],
    ["SEGNON", "LOUANGNIGUI", 3000],
    ["FOFANA", "YAH (la mère)", 2000],
    ["SORO", "GBARAMAN", 0],
    ["OUATTARA", "JUSTIN", 0],
    ["FATOU (SEWADJO)", "", 1000],
    ["TOURE", "GNIBIOSSE", 0]
  ];
  const quand = "2026-10-01T09:00:00.000Z";
  liste.forEach(([nom, prenom, verse], i) => {
    const id = "m" + String(i + 1).padStart(2, "0");
    e.membres.push({ id, nom, prenom, tel: "", inscription: "2026-10", actif: true, archiveDepuis: null, creeLe: quand });
    if (verse > 0) {
      const v = { id: "v" + id, membreId: id, date: "2026-10-01", montant: verse, mode: "Non précisé",
        note: "Liste du 01/10/2026", creeLe: quand, modifieLe: null, annule: false, motif: null };
      e.versements.push(v);
      for (let k = 0; k < verse / 1000; k++) {
        e.affectations.push({ id: "a" + id + k, versementId: v.id, membreId: id, mois: Mois.ajouter("2026-10", k), montant: 1000, annule: false });
      }
    }
  });
  e.journal.push({ id: uid("j"), date: new Date().toISOString(), action: "Création", element: "Liste de départ (15 membres)", avant: "", apres: "", motif: "" });
  return e;
}

/* Reprise des données de la première version (grille mois par mois) */
function migrerV1(v1) {
  const e = etatVide();
  const a = v1.asso || {};
  Object.assign(e.asso, { nom: a.nom || "", montant: Number(a.montant) || 1000, devise: a.devise || "FCFA", depot: a.depot || "", tresorier: a.tresorier || "" });
  e.asso.tarifs = [{ depuis: "2000-01", montant: e.asso.montant }];
  const debuts = (v1.membres || []).map(m => m.debut).filter(Boolean).sort();
  e.asso.debutSuivi = debuts[0] || Mois.courant();
  (v1.membres || []).forEach(m => {
    e.membres.push({ id: m.id, nom: m.nom, prenom: "", tel: "", inscription: m.debut || e.asso.debutSuivi, actif: true, archiveDepuis: null, creeLe: new Date().toISOString() });
  });
  Object.entries(v1.paiements || {}).sort().forEach(([cle, montant]) => {
    const [membreId, mois] = cle.split("|");
    if (!e.membres.some(m => m.id === membreId) || !(montant > 0)) return;
    const v = { id: uid("v"), membreId, date: Mois.premierJour(mois), montant, mode: "Non précisé", note: "Repris de l'ancienne version",
      creeLe: new Date().toISOString(), modifieLe: null, annule: false, motif: null };
    e.versements.push(v);
    e.affectations.push({ id: uid("a"), versementId: v.id, membreId, mois, montant, annule: false });
  });
  e.meta.derniereSauvegarde = v1.derniereSauvegarde || null;
  e.journal.push({ id: uid("j"), date: new Date().toISOString(), action: "Reprise", element: "Données de l'ancienne version", avant: "", apres: "", motif: "" });
  return e;
}

let S = null;
function charger() {
  try {
    const v2 = localStorage.getItem(CLE_V2);
    if (v2) return Object.assign(etatVide(), JSON.parse(v2));
    const v1 = localStorage.getItem(CLE_V1);
    if (v1) return migrerV1(JSON.parse(v1));
  } catch (e) { /* stockage indisponible : on part de la liste */ }
  return etatDepart();
}
let _index = null;
function enregistrer() {
  _index = null;
  try { localStorage.setItem(CLE_V2, JSON.stringify(S)); return true; }
  catch (e) { return false; }
}
function journaliser(action, element, avant, apres, motif) {
  S.journal.push({ id: uid("j"), date: new Date().toISOString(), action, element, avant: avant || "", apres: apres || "", motif: motif || "" });
}

/* ---------- Cotisation ---------- */
function montantDe(mois) {
  const t = [...(S.asso.tarifs || [])].sort((a, b) => a.depuis.localeCompare(b.depuis)).filter(x => x.depuis <= mois).pop();
  return t ? t.montant : S.asso.montant;
}
function changerMontant(nouveau) {
  const depuis = Mois.courant();
  S.asso.tarifs = (S.asso.tarifs || []).filter(t => t.depuis < depuis);
  S.asso.tarifs.push({ depuis, montant: nouveau });
  S.asso.montant = nouveau;
}

/* ---------- Membres ---------- */
function nomComplet(m) { return ((m.nom || "") + " " + (m.prenom || "")).trim(); }
function initiales(m) {
  const mots = nomComplet(m).replace(/\(.*?\)/g, "").split(/\s+/).filter(Boolean);
  return ((mots[0] || "?")[0] + (mots[1] ? mots[1][0] : "")).toUpperCase();
}
function membre(id) { return S.membres.find(m => m.id === id); }
function debutMembre(m) { return m.inscription > S.asso.debutSuivi ? m.inscription : S.asso.debutSuivi; }
function concerne(m, mois) { return mois >= debutMembre(m) && (!m.archiveDepuis || mois < m.archiveDepuis); }

function index() {
  if (_index) return _index;
  const aff = new Map();
  S.affectations.forEach(a => { if (!a.annule) aff.set(a.membreId + "|" + a.mois, a); });
  const vers = new Map(S.versements.map(v => [v.id, v]));
  _index = { aff, vers };
  return _index;
}
function affectation(membreId, mois) { return index().aff.get(membreId + "|" + mois) || null; }
function estPaye(membreId, mois) { return !!affectation(membreId, mois); }
function versement(id) { return index().vers.get(id) || null; }

/* Mois exigibles non réglés, du plus ancien au plus récent */
function moisDus(m, jusqua) {
  jusqua = jusqua || Mois.courant();
  const debut = debutMembre(m);
  if (debut > jusqua) return [];
  return Mois.entre(debut, jusqua).filter(k => concerne(m, k) && !estPaye(m.id, k));
}
/* Statut d'un membre pour un mois donné */
function statutMois(m, mois) {
  if (!concerne(m, mois)) return "hors";
  if (estPaye(m.id, mois)) return "paye";
  const c = Mois.courant();
  if (mois < c) return "retard";
  if (mois === c) return "apayer";
  return "avenir";
}
function versementsDe(membreId) {
  return S.versements.filter(v => v.membreId === membreId).sort((a, b) => (b.date + b.creeLe).localeCompare(a.date + a.creeLe));
}
function moisDuVersement(v) { return S.affectations.filter(a => a.versementId === v.id).map(a => a.mois).sort(); }
function totalVerse(membreId) { return S.versements.filter(v => v.membreId === membreId && !v.annule).reduce((s, v) => s + v.montant, 0); }
function moisRegles(m) { return S.affectations.filter(a => a.membreId === m.id && !a.annule).length; }

function libelleMoisListe(liste) {
  if (!liste.length) return "";
  if (liste.length === 1) return Mois.bas(liste[0]);
  // suite continue ?
  const continu = liste.every((k, i) => i === 0 || Mois.idx(k) === Mois.idx(liste[i - 1]) + 1);
  if (continu) return Mois.bas(liste[0]) + " → " + Mois.bas(liste[liste.length - 1]);
  return liste.map(k => Mois.court(k, true)).join(", ");
}

function doublonProbable(nom, prenom, saufId) {
  const cible = normaliser(nom + " " + prenom);
  return S.membres.find(m => m.id !== saufId && normaliser(nomComplet(m)) === cible) || null;
}
function ajouterMembre(d) {
  const m = { id: uid("m"), nom: d.nom.trim(), prenom: (d.prenom || "").trim(), tel: (d.tel || "").trim(),
    inscription: d.inscription, actif: true, archiveDepuis: null, creeLe: new Date().toISOString() };
  S.membres.push(m);
  journaliser("Ajout d'un membre", nomComplet(m), "", "Inscrit en " + Mois.bas(m.inscription));
  enregistrer();
  return m;
}
function modifierMembre(id, d) {
  const m = membre(id);
  const avant = [];
  const apres = [];
  const champ = (lib, a, b) => { if ((a || "") !== (b || "")) { avant.push(lib + " : " + (a || "—")); apres.push(lib + " : " + (b || "—")); } };
  champ("Nom", m.nom, d.nom.trim());
  champ("Prénom", m.prenom, (d.prenom || "").trim());
  champ("Téléphone", m.tel, (d.tel || "").trim());
  champ("Inscription", Mois.bas(m.inscription), Mois.bas(d.inscription));
  Object.assign(m, { nom: d.nom.trim(), prenom: (d.prenom || "").trim(), tel: (d.tel || "").trim(), inscription: d.inscription });
  if (avant.length) journaliser("Modification d'un membre", nomComplet(m), avant.join(" · "), apres.join(" · "));
  enregistrer();
}
function archiverMembre(id) {
  const m = membre(id);
  m.actif = false; m.archiveDepuis = Mois.ajouter(Mois.courant(), 1);
  journaliser("Archivage d'un membre", nomComplet(m), "Actif", "Archivé (ne cotise plus après " + Mois.bas(Mois.courant()) + ")");
  enregistrer();
}
function reactiverMembre(id) {
  const m = membre(id);
  m.actif = true; m.archiveDepuis = null;
  journaliser("Réactivation d'un membre", nomComplet(m), "Archivé", "Actif");
  enregistrer();
}

/* ---------- Versements ---------- */
function enregistrerVersement({ membreId, mois, date, mode, note }) {
  const liste = [...new Set(mois)].sort();
  if (!liste.length) throw new Error("Aucun mois choisi");
  const deja = liste.filter(k => estPaye(membreId, k));
  if (deja.length) throw new Error("Déjà payé : " + deja.map(Mois.bas).join(", "));
  const montant = liste.reduce((s, k) => s + montantDe(k), 0);
  const v = { id: uid("v"), membreId, date, montant, mode, note: (note || "").trim(),
    creeLe: new Date().toISOString(), modifieLe: null, annule: false, motif: null };
  S.versements.push(v);
  liste.forEach(k => S.affectations.push({ id: uid("a"), versementId: v.id, membreId, mois: k, montant: montantDe(k), annule: false }));
  journaliser("Paiement enregistré", nomComplet(membre(membreId)), "",
    argent(montant) + " · " + libelleMoisListe(liste) + " · reçu le " + dateFr(date) + " · " + mode);
  enregistrer();
  return v;
}
function annulerVersement(id, motif) {
  const v = S.versements.find(x => x.id === id);
  if (!v || v.annule) return;
  v.annule = true; v.motif = motif; v.modifieLe = new Date().toISOString();
  S.affectations.forEach(a => { if (a.versementId === id) a.annule = true; });
  journaliser("Paiement annulé", nomComplet(membre(v.membreId)),
    argent(v.montant) + " · " + libelleMoisListe(moisDuVersement(v)) + " · reçu le " + dateFr(v.date), "Annulé", motif);
  enregistrer();
}

/* ---------- Tableaux de bord ---------- */
function statsMois(M) {
  const concernes = S.membres.filter(m => concerne(m, M));
  const payes = concernes.filter(m => estPaye(m.id, M));
  const attendu = concernes.length * montantDe(M);
  const encaisse = payes.reduce((s, m) => s + affectation(m.id, M).montant, 0);
  return {
    concernes, payes, nonPayes: concernes.filter(m => !estPaye(m.id, M)),
    attendu, encaisse, reste: Math.max(0, attendu - encaisse),
    taux: concernes.length ? Math.round(payes.length / concernes.length * 100) : 0
  };
}
function membresEnRetard() { return S.membres.filter(m => m.actif && moisDus(m, Mois.ajouter(Mois.courant(), -1)).length > 0); }
function arrieresTotaux() {
  return S.membres.reduce((s, m) => s + moisDus(m).reduce((t, k) => t + montantDe(k), 0), 0);
}
