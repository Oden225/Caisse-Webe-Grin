/* Ma Cotisation — rapports (aperçu, PDF, Word, message) et partage. */
"use strict";

const TONS = {
  ok:   { fond: "E6F6EE", texte: "0E7A4E", rgbF: [230, 246, 238], rgbT: [14, 122, 78] },
  ko:   { fond: "FCEAEA", texte: "C23A3A", rgbF: [252, 234, 234], rgbT: [194, 58, 58] },
  att:  { fond: "FBF1DF", texte: "A86B10", rgbF: [251, 241, 223], rgbT: [168, 107, 16] },
  hors: { fond: null,     texte: "9AA4B2", rgbF: null,            rgbT: [154, 164, 178] }
};
const MARINE = [23, 59, 97];

function nomAsso() { return (S.asso.nom || "").trim() || "Notre association"; }

/* ---------- Modèle commun : une liste de blocs ---------- */
function modeleRapport(cfg) {
  const courant = Mois.courant();
  const blocs = [];
  const infos = ["Cotisation : " + argent(S.asso.montant) + " par mois"];
  if (S.asso.depot) infos.push("Dépôt : " + S.asso.depot);
  infos.push("Généré le " + dateLongue());
  if (S.asso.tresorier) infos.push("Trésorier : " + S.asso.tresorier);
  let paysage = false;

  if (cfg.type === "mensuel") {
    const M = cfg.mois;
    const st = statsMois(M);
    blocs.push({ type: "entete", titre: nomAsso(), sousTitre: "Rapport mensuel — " + Mois.libelle(M), infos: infos.join("   ·   ") });
    blocs.push({ type: "stats", items: [
      { lib: "Membres concernés", val: String(st.concernes.length) },
      { lib: "Ont payé", val: st.payes.length + " / " + st.concernes.length + "  (" + st.taux + " %)", ton: "ok" },
      { lib: "Encaissé pour le mois", val: nombre(st.encaisse) + " / " + argent(st.attendu) },
      { lib: "Reste à collecter", val: argent(st.reste), ton: st.reste ? "ko" : "ok" }
    ] });
    const entetes = cfg.detail ? ["N°", "Membre", "Statut", "Reçu le", "Mode", "Mois dus (total)"] : ["N°", "Membre", "Statut"];
    const lignes = st.concernes.map((m, i) => {
      const s = statutMois(m, M);
      const a = affectation(m.id, M);
      const v = a && versement(a.versementId);
      const statut = { paye: ["Payé", "ok"], retard: ["En retard", "ko"], apayer: ["Non payé", "att"], avenir: ["À venir", "hors"] }[s];
      const ligne = [{ t: String(i + 1) }, { t: nomComplet(m), nom: true }, { t: statut[0], ton: statut[1] }];
      if (cfg.detail) {
        const dus = moisDus(m).length;
        ligne.push({ t: v ? dateFr(v.date) : "" }, { t: v ? v.mode : "" }, { t: dus ? String(dus) : "0", ton: dus ? "ko" : "ok" });
      }
      return ligne;
    });
    blocs.push({ type: "titre", texte: "Situation des membres" });
    blocs.push({ type: "tableau", entetes, lignes, poids: cfg.detail ? [0.6, 4, 1.6, 1.4, 1.6, 1.4] : [0.6, 5, 2] });
    if (st.nonPayes.length && M <= courant) {
      blocs.push({ type: "texte", ton: "ko", texte: "Pas encore payé (" + st.nonPayes.length + ") : " + st.nonPayes.map(nomComplet).join(", ") });
    }
  } else {
    let du = cfg.du, au = cfg.au;
    if (du > au) [du, au] = [au, du];
    const liste = Mois.entre(du, au);
    const de = (k) => (/^[aeiouy]/.test(Mois.bas(k)) ? "d'" : "de ") + Mois.bas(k);
    const libPeriode = du === au ? Mois.bas(du) : de(du) + " à " + Mois.bas(au);
    blocs.push({ type: "entete", titre: nomAsso(), sousTitre: "Rapport de période — " + libPeriode, infos: infos.join("   ·   ") });

    const parMois = liste.map(k => {
      const ms = S.membres.filter(m => concerne(m, k));
      const payes = ms.filter(m => estPaye(m.id, k));
      const exigible = k <= courant;
      const attendu = exigible ? ms.length * montantDe(k) : 0;
      const affecte = payes.reduce((s, m) => s + affectation(m.id, k).montant, 0);
      return { k, concernes: ms.length, payes: payes.length, attendu, affecte, reste: exigible ? Math.max(0, attendu - affecte) : 0, exigible };
    });
    const recu = S.versements.filter(v => !v.annule && v.date >= Mois.premierJour(du) && v.date <= Mois.dernierJour(au)).reduce((s, v) => s + v.montant, 0);
    const attendu = parMois.reduce((s, x) => s + x.attendu, 0);
    const affecte = parMois.reduce((s, x) => s + (x.exigible ? x.affecte : 0), 0);
    const reste = parMois.reduce((s, x) => s + x.reste, 0);
    const arrieres = arrieresTotaux();
    blocs.push({ type: "stats", items: [
      { lib: "Reçu pendant la période", val: argent(recu), ton: "ok" },
      { lib: "Dû sur la période", val: argent(attendu) },
      { lib: "Reste à collecter (période)", val: argent(reste), ton: reste ? "ko" : "ok" },
      { lib: "Arriérés au " + dateFr(aujourdhuiISO()), val: argent(arrieres), ton: arrieres ? "ko" : "ok" }
    ] });
    blocs.push({ type: "titre", texte: "Tableau mensuel" });
    blocs.push({ type: "tableau",
      entetes: ["Mois", "Membres", "Ont payé", "Attendu", "Encaissé", "Reste"],
      lignes: parMois.map(x => [
        { t: Mois.libelle(x.k), nom: true }, { t: String(x.concernes) },
        { t: x.payes + " / " + x.concernes, ton: x.exigible ? (x.payes === x.concernes ? "ok" : "att") : "hors" },
        { t: x.exigible ? nombre(x.attendu) : "à venir", ton: x.exigible ? null : "hors" },
        { t: nombre(x.affecte) }, { t: x.exigible ? nombre(x.reste) : "", ton: x.reste ? "ko" : "ok" }
      ]),
      pied: [{ t: "TOTAL", nom: true }, { t: "" }, { t: "" }, { t: nombre(attendu) }, { t: nombre(affecte) }, { t: nombre(reste) }],
      poids: [2.4, 1.2, 1.4, 1.6, 1.6, 1.6] });

    const membres = S.membres.filter(m => liste.some(k => concerne(m, k)));
    const enRetard = membres.map(m => ({ m, dus: liste.filter(k => k <= courant && statutMois(m, k) !== "paye" && concerne(m, k)) }))
      .filter(x => x.dus.length);
    if (cfg.detail) {
      paysage = liste.length > 5;
      const symbole = { paye: ["✓", "ok"], retard: ["✗", "ko"], apayer: ["✗", "att"], avenir: ["·", "hors"], hors: ["—", "hors"] };
      blocs.push({ type: "titre", texte: "Détail par membre" });
      blocs.push({ type: "tableau",
        entetes: ["N°", "Membre", ...liste.map(k => Mois.court(k, Mois.parse(du).a !== Mois.parse(au).a)), "Dus", "Versé"],
        lignes: membres.map((m, i) => {
          const dus = liste.filter(k => k <= courant && concerne(m, k) && !estPaye(m.id, k)).length;
          const verse = liste.reduce((s, k) => s + (affectation(m.id, k) ? affectation(m.id, k).montant : 0), 0);
          return [{ t: String(i + 1) }, { t: nomComplet(m), nom: true },
            ...liste.map(k => { const s = symbole[statutMois(m, k)]; return { t: s[0], ton: s[1] }; }),
            { t: String(dus), ton: dus ? "ko" : "ok" }, { t: nombre(verse) }];
        }),
        pied: [{ t: "" }, { t: "TOTAL", nom: true }, ...parMois.map(x => ({ t: nombre(x.affecte) })), { t: "" }, { t: nombre(affecte) }],
        poids: [0.6, 4, ...liste.map(() => 1), 0.9, 1.3], serre: liste.length > 8 });
      blocs.push({ type: "legende", texte: "✓ payé   ✗ non payé   · à venir   — pas encore membre" });
    }
    if (enRetard.length) {
      blocs.push({ type: "texte", ton: "ko", texte: "Reste à payer sur la période (" + enRetard.length + ") : " +
        enRetard.map(x => nomComplet(x.m) + " (" + pluriel(x.dus.length, "mois", "mois") + ")").join(", ") });
    } else {
      blocs.push({ type: "texte", ton: "ok", texte: "Tous les membres sont à jour sur la période. Merci à tous !" });
    }
  }
  blocs.push({ type: "legende", texte: "Ces montants concernent uniquement les cotisations : ce n'est pas le solde de la caisse." });
  return { blocs, paysage, nomFichier: (ext) => nomFichierRapport(cfg, ext) };
}

function nomFichierRapport(cfg, ext) {
  const morceau = cfg.type === "mensuel" ? Mois.libelle(cfg.mois)
    : (cfg.du === cfg.au ? Mois.libelle(cfg.du) : Mois.libelle(cfg.du < cfg.au ? cfg.du : cfg.au) + " a " + Mois.libelle(cfg.du < cfg.au ? cfg.au : cfg.du));
  return ("Cotisations " + nomAsso() + " " + morceau).normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") + "." + ext;
}

/* ---------- Aperçu à l'écran ---------- */
function rapportHTML(mod) {
  return mod.blocs.map(b => {
    if (b.type === "entete") return `<div class="r-entete"><div class="r-titre">${echapper(b.titre)}</div><div class="r-sous">${echapper(b.sousTitre)}</div></div><p class="r-infos">${echapper(b.infos)}</p>`;
    if (b.type === "stats") return `<div class="r-stats">${b.items.map(i => `<div class="r-stat ${i.ton || ""}"><span>${echapper(i.lib)}</span><strong>${echapper(i.val)}</strong></div>`).join("")}</div>`;
    if (b.type === "titre") return `<h4 class="r-h">${echapper(b.texte)}</h4>`;
    if (b.type === "texte") return `<p class="r-texte ${b.ton || ""}">${echapper(b.texte)}</p>`;
    if (b.type === "legende") return `<p class="r-legende">${echapper(b.texte)}</p>`;
    if (b.type === "tableau") {
      const cel = (c, balise) => `<${balise} class="${c.ton || ""} ${c.nom ? "g" : ""}">${echapper(c.t)}</${balise}>`;
      return `<div class="r-table-wrap"><table class="r-table ${b.serre ? "serre" : ""}"><thead><tr>${b.entetes.map(e => `<th>${echapper(e)}</th>`).join("")}</tr></thead>` +
        `<tbody>${b.lignes.map(l => "<tr>" + l.map(c => cel(c, "td")).join("") + "</tr>").join("")}</tbody>` +
        (b.pied ? `<tfoot><tr>${b.pied.map(c => cel(c, "td")).join("")}</tr></tfoot>` : "") + "</table></div>";
    }
    return "";
  }).join("");
}

/* ---------- PDF ---------- */
const pdfTexte = (s) => String(s).replace(/✓/g, "OK").replace(/✗/g, "X").replace(/—/g, "-").replace(/→/g, "à").replace(/[  ]/g, " ");

function rapportPDF(mod) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: mod.paysage ? "landscape" : "portrait", unit: "mm", format: "a4" });
  const L = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), marge = 14;
  let y = 14;
  const place = (h) => { if (y + h > H - 16) { doc.addPage(); y = 16; } };

  mod.blocs.forEach(b => {
    if (b.type === "entete") {
      doc.setFillColor(...MARINE); doc.rect(0, 0, L, 27, "F");
      doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.text(pdfTexte(b.titre), marge, 12);
      doc.setFont("helvetica", "normal"); doc.setFontSize(11.5); doc.text(pdfTexte(b.sousTitre), marge, 20.5);
      doc.setTextColor(90, 100, 115); doc.setFontSize(9);
      const l = doc.splitTextToSize(pdfTexte(b.infos), L - 2 * marge);
      doc.text(l, marge, 34); y = 34 + l.length * 4.2 + 2;
    }
    if (b.type === "stats") {
      const n = b.items.length, gap = 3, w = (L - 2 * marge - gap * (n - 1)) / n;
      place(20);
      b.items.forEach((it, i) => {
        const x = marge + i * (w + gap);
        doc.setDrawColor(215, 222, 232); doc.setFillColor(245, 247, 250); doc.roundedRect(x, y, w, 18, 2, 2, "FD");
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100, 112, 130);
        doc.text(pdfTexte(it.lib), x + 3, y + 5.5);
        doc.setFont("helvetica", "bold"); doc.setFontSize(w < 45 ? 9.5 : 11);
        doc.setTextColor(...(it.ton && TONS[it.ton] ? TONS[it.ton].rgbT : MARINE));
        doc.text(doc.splitTextToSize(pdfTexte(it.val), w - 5)[0], x + 3, y + 13);
      });
      doc.setFont("helvetica", "normal");
      y += 24;
    }
    if (b.type === "titre") {
      place(14);
      doc.setFont("helvetica", "bold"); doc.setFontSize(11.5); doc.setTextColor(...MARINE);
      doc.text(pdfTexte(b.texte), marge, y + 2); doc.setFont("helvetica", "normal"); y += 5;
    }
    if (b.type === "texte" || b.type === "legende") {
      doc.setFontSize(b.type === "legende" ? 8.5 : 9.5);
      const t = TONS[b.ton];
      doc.setTextColor(...(t ? t.rgbT : b.type === "legende" ? [110, 120, 135] : [40, 40, 40]));
      const l = doc.splitTextToSize(pdfTexte(b.texte), L - 2 * marge);
      place(l.length * 4.5 + 2);
      doc.text(l, marge, y + 3); y += l.length * 4.5 + 3;
    }
    if (b.type === "tableau") {
      const total = b.poids.reduce((a, c) => a + c, 0), larg = L - 2 * marge;
      const colStyles = {};
      b.poids.forEach((p, i) => { colStyles[i] = { cellWidth: larg * p / total }; });
      const iNom = b.entetes.findIndex((_, i) => b.lignes[0] && b.lignes[0][i] && b.lignes[0][i].nom);
      if (iNom >= 0) Object.assign(colStyles[iNom], { halign: "left", fontStyle: "bold" });
      doc.autoTable({
        startY: y, margin: { left: marge, right: marge }, theme: "grid",
        head: [b.entetes.map(pdfTexte)],
        body: b.lignes.map(l => l.map(c => pdfTexte(c.t))),
        foot: b.pied ? [b.pied.map(c => pdfTexte(c.t))] : undefined,
        styles: { fontSize: b.serre ? 7 : 8.8, halign: "center", valign: "middle", cellPadding: b.serre ? 1.1 : 1.7, lineColor: [215, 222, 232], textColor: [30, 40, 55] },
        headStyles: { fillColor: MARINE, textColor: 255, fontStyle: "bold" },
        footStyles: { fillColor: [235, 239, 245], textColor: [23, 59, 97], fontStyle: "bold" },
        columnStyles: colStyles,
        didParseCell: (d) => {
          if (d.section !== "body") return;
          const c = b.lignes[d.row.index][d.column.index];
          const t = c && TONS[c.ton];
          if (t) { if (t.rgbF) d.cell.styles.fillColor = t.rgbF; d.cell.styles.textColor = t.rgbT; if (c.ton !== "hors") d.cell.styles.fontStyle = "bold"; }
        }
      });
      y = doc.lastAutoTable.finalY + 6;
    }
  });
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150);
    doc.text(pdfTexte(nomAsso() + "  -  page " + i + "/" + n), L / 2, H - 7, { align: "center" });
  }
  return doc.output("blob");
}

/* ---------- Word (.docx) ---------- */
function rapportDOCX(mod) {
  const largeur = mod.paysage ? 15138 : 10206;
  let corps = "";
  mod.blocs.forEach(b => {
    if (b.type === "entete") {
      corps += Docx.p(b.titre, { gras: true, taille: 20, couleur: "173B61", apres: 40 });
      corps += Docx.p(b.sousTitre, { gras: true, taille: 13, couleur: "1677D2", apres: 80 });
      corps += Docx.p(b.infos, { taille: 9, couleur: "5A6473", apres: 200 });
    }
    if (b.type === "stats") {
      const w = Math.floor(largeur / b.items.length);
      corps += Docx.tableau([
        b.items.map(i => ({ t: i.lib, fond: "F5F7FA", couleur: "5A6473", align: "left" })),
        b.items.map(i => ({ t: i.val, gras: true, couleur: i.ton && TONS[i.ton] ? TONS[i.ton].texte : "173B61", align: "left" }))
      ], b.items.map(() => w), { taille: 10.5 });
      corps += Docx.p("", { apres: 80 });
    }
    if (b.type === "titre") corps += Docx.p(b.texte, { gras: true, taille: 12, couleur: "173B61", avant: 160, apres: 80 });
    if (b.type === "texte") corps += Docx.p(b.texte, { taille: 10, couleur: TONS[b.ton] ? TONS[b.ton].texte : "1D2939", avant: 120 });
    if (b.type === "legende") corps += Docx.p(b.texte, { taille: 8.5, couleur: "6E7887", avant: 80 });
    if (b.type === "tableau") {
      const total = b.poids.reduce((a, c) => a + c, 0);
      const larg = b.poids.map(p => Math.floor(largeur * p / total));
      const lignes = [b.entetes.map(e => ({ t: e, gras: true, fond: "173B61", couleur: "FFFFFF" }))];
      b.lignes.forEach(l => lignes.push(l.map(c => {
        const t = TONS[c.ton];
        return { t: c.t, gras: !!c.nom || (t && c.ton !== "hors"), fond: t ? t.fond : null, couleur: t ? t.texte : "1D2939", align: c.nom ? "left" : "center" };
      })));
      if (b.pied) lignes.push(b.pied.map(c => ({ t: c.t, gras: true, fond: "EBEFF5", couleur: "173B61", align: c.nom ? "left" : "center" })));
      corps += Docx.tableau(lignes, larg, { entete: true, taille: b.serre ? 8 : 9.5 });
    }
  });
  return Docx.document(corps, { paysage: mod.paysage });
}

/* ---------- Message WhatsApp ---------- */
function messageRapport(cfg) {
  const courant = Mois.courant();
  let s = `*${nomAsso()}*\n`;
  if (cfg.type === "mensuel") {
    const M = cfg.mois, st = statsMois(M);
    s += `*Cotisations de ${Mois.bas(M)}*\n\n`;
    s += `✅ Ont payé (${st.payes.length}/${st.concernes.length}) : ${st.payes.map(nomComplet).join(", ") || "personne pour le moment"}\n\n`;
    if (st.nonPayes.length && M <= courant) s += `⏳ Pas encore payé (${st.nonPayes.length}) : ${st.nonPayes.map(nomComplet).join(", ")}\n\n`;
    s += `💰 Encaissé pour le mois : ${argent(st.encaisse)} sur ${argent(st.attendu)}\n`;
    s += `📌 Reste à collecter : ${argent(st.reste)}\n`;
  } else {
    let du = cfg.du, au = cfg.au; if (du > au) [du, au] = [au, du];
    const liste = Mois.entre(du, au);
    const recu = S.versements.filter(v => !v.annule && v.date >= Mois.premierJour(du) && v.date <= Mois.dernierJour(au)).reduce((t, v) => t + v.montant, 0);
    s += `*Point des cotisations : ${Mois.bas(du)}${du !== au ? " → " + Mois.bas(au) : ""}*\n\n`;
    s += `💰 Reçu pendant la période : ${argent(recu)}\n`;
    const membres = S.membres.filter(m => liste.some(k => concerne(m, k)));
    const retards = membres.map(m => ({ m, dus: liste.filter(k => k <= courant && concerne(m, k) && !estPaye(m.id, k)) })).filter(x => x.dus.length);
    const aJour = membres.filter(m => !retards.some(r => r.m === m));
    const reste = retards.reduce((t, r) => t + r.dus.reduce((u, k) => u + montantDe(k), 0), 0);
    s += `📌 Reste à collecter : ${argent(reste)}\n\n`;
    if (retards.length) s += `⏳ *Reste à payer (${retards.length})* :\n` + retards.map(r => `• ${nomComplet(r.m)} : ${pluriel(r.dus.length, "mois", "mois")} (${argent(r.dus.reduce((u, k) => u + montantDe(k), 0))})`).join("\n") + "\n\n";
    if (aJour.length) s += `✅ *À jour (${aJour.length})* : ${aJour.map(nomComplet).join(", ")}\n`;
  }
  if (S.asso.depot) s += `\n📲 Numéro de dépôt : ${S.asso.depot}\n`;
  s += `\nMerci à tous 🙏` + (S.asso.tresorier ? `\n${S.asso.tresorier}, trésorier` : "");
  return s;
}

/* ---------- Partage ---------- */
/* Dans l'application Android (APK), on passe par les modules natifs de Capacitor */
const CAP = window.capacitorExports;
const NATIF = !!(CAP && CAP.Capacitor && CAP.Capacitor.isNativePlatform && CAP.Capacitor.isNativePlatform());
const Natif = NATIF ? { Share: CAP.registerPlugin("Share"), Filesystem: CAP.registerPlugin("Filesystem"), StatusBar: CAP.registerPlugin("StatusBar") } : null;
function blobEnBase64(blob) {
  return new Promise((ok, ko) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1]); r.onerror = ko; r.readAsDataURL(blob); });
}
const estAnnulation = (e) => /cancel|annul/i.test((e && e.message) || "");

async function partagerFichier(blob, nom, type, titre) {
  if (NATIF) {
    try {
      const { uri } = await Natif.Filesystem.writeFile({ path: nom, data: await blobEnBase64(blob), directory: "CACHE" });
      await Natif.Share.share({ title: titre || nom, files: [uri], dialogTitle: "Envoyer le fichier" });
      return "partage";
    } catch (e) {
      if (estAnnulation(e)) return "annule";
      toast("Partage impossible : " + ((e && e.message) || "erreur inconnue"));
      return "erreur";
    }
  }
  const fichier = new File([blob], nom, { type });
  if (navigator.canShare && navigator.canShare({ files: [fichier] })) {
    try { await navigator.share({ files: [fichier], title: titre || nom }); return "partage"; }
    catch (e) { if (e.name === "AbortError") return "annule"; }
  }
  telecharger(blob, nom);
  return "telecharge";
}
function telecharger(blob, nom) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
async function partagerTexte(texte) {
  if (NATIF) {
    try { await Natif.Share.share({ text: texte, dialogTitle: "Envoyer le message" }); }
    catch (e) { if (!estAnnulation(e)) toast("Partage impossible : " + ((e && e.message) || "erreur inconnue")); }
    return;
  }
  if (navigator.share && matchMedia("(pointer: coarse)").matches) {
    try { await navigator.share({ text: texte }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(texte); } catch (e) { /* facultatif */ }
  window.open("https://wa.me/?text=" + encodeURIComponent(texte), "_blank");
}
