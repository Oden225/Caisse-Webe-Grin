/* Petit générateur de fichiers Word (.docx) sans dépendance.
   Un .docx est une archive ZIP contenant du XML : on l'écrit à la main. */
"use strict";

const Docx = (() => {
  /* ---- ZIP (méthode « stockée », sans compression) ---- */
  const TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

  function zip(fichiers) {
    const enc = new TextEncoder();
    const d = new Date();
    const heure = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const jour = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    const morceaux = [], central = [];
    let decalage = 0;
    fichiers.forEach(f => {
      const nom = enc.encode(f.nom), data = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, heure, true); h.setUint16(12, jour, true); h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nom.length, true); h.setUint16(28, 0, true);
      morceaux.push(new Uint8Array(h.buffer), nom, data);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint16(10, 0, true); c.setUint16(12, heure, true); c.setUint16(14, jour, true); c.setUint32(16, crc, true);
      c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, nom.length, true);
      c.setUint32(42, decalage, true);
      central.push(new Uint8Array(c.buffer), nom);
      decalage += 30 + nom.length + data.length;
    });
    const tailleCentral = central.reduce((s, x) => s + x.length, 0);
    const fin = new DataView(new ArrayBuffer(22));
    fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, fichiers.length, true); fin.setUint16(10, fichiers.length, true);
    fin.setUint32(12, tailleCentral, true); fin.setUint32(16, decalage, true);
    return new Blob([...morceaux, ...central, new Uint8Array(fin.buffer)],
      { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  /* ---- WordprocessingML ---- */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function run(texte, o) {
    o = o || {};
    let rpr = '<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>';
    if (o.gras) rpr += "<w:b/>";
    if (o.couleur) rpr += `<w:color w:val="${o.couleur}"/>`;
    rpr += `<w:sz w:val="${Math.round((o.taille || 10.5) * 2)}"/>`;
    return `<w:r><w:rPr>${rpr}</w:rPr><w:t xml:space="preserve">${esc(texte)}</w:t></w:r>`;
  }
  /* p("texte", options) ou p([["morceau", options], ...], options) */
  function p(contenu, o) {
    o = o || {};
    const runs = Array.isArray(contenu) ? contenu.map(([t, ro]) => run(t, Object.assign({}, o, ro))).join("") : run(contenu, o);
    let ppr = `<w:spacing w:before="${o.avant || 0}" w:after="${o.apres == null ? 120 : o.apres}"/>`;
    if (o.align) ppr += `<w:jc w:val="${o.align}"/>`;
    return `<w:p><w:pPr>${ppr}</w:pPr>${runs}</w:p>`;
  }
  /* lignes : [[{t, gras, fond, couleur, align}]] ; largeurs en twips */
  function tableau(lignes, largeurs, o) {
    o = o || {};
    const bord = (n) => `<w:${n} w:val="single" w:sz="4" w:space="0" w:color="D0D5DD"/>`;
    let x = `<w:tbl><w:tblPr><w:tblW w:w="${largeurs.reduce((a, b) => a + b, 0)}" w:type="dxa"/>` +
      `<w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(bord).join("")}</w:tblBorders>` +
      `<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="70" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="70" w:type="dxa"/></w:tblCellMar></w:tblPr>`;
    x += "<w:tblGrid>" + largeurs.map(l => `<w:gridCol w:w="${l}"/>`).join("") + "</w:tblGrid>";
    lignes.forEach((ligne, i) => {
      x += "<w:tr>" + (i === 0 && o.entete ? "<w:trPr><w:tblHeader/></w:trPr>" : "");
      ligne.forEach((c, j) => {
        x += `<w:tc><w:tcPr><w:tcW w:w="${largeurs[j]}" w:type="dxa"/>` +
          (c.fond ? `<w:shd w:val="clear" w:color="auto" w:fill="${c.fond}"/>` : "") + `<w:vAlign w:val="center"/></w:tcPr>` +
          p(c.t, { gras: c.gras, couleur: c.couleur, taille: o.taille || 9.5, align: c.align || "center", apres: 0 }) + "</w:tc>";
      });
      x += "</w:tr>";
    });
    return x + "</w:tbl>";
  }

  function document(corps, o) {
    o = o || {};
    const page = o.paysage
      ? '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>'
      : '<w:pgSz w:w="11906" w:h="16838"/>';
    const xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + corps +
      `<w:sectPr>${page}<w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="400" w:footer="400" w:gutter="0"/></w:sectPr>` +
      "</w:body></w:document>";
    return zip([
      { nom: "[Content_Types].xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>' },
      { nom: "_rels/.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>' },
      { nom: "word/document.xml", data: xml }
    ]);
  }

  return { p, tableau, document, zip };
})();
