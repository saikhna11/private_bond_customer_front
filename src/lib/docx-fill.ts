import JSZip from 'jszip';

/** One interest payment of the contract's schedule: each schedule placeholder's value. */
export type ScheduleRow = Record<string, string>;

const rowStart = /<w:tr[ >]/g;
const wordIds = / w14:(?:paraId|textId)="[^"]*"/g;
// A placeholder: a name in braces that starts with a letter and goes on with letters,
// digits and underscores, as the backend's placeholderPattern matches it.
const placeholder = /\{(\p{L}[\p{L}\p{N}_]*)\}/gu;
// The parts the backend fills: the body, the headers and the footers.
const filledPart = /^word\/(?:document|header\d*|footer\d*)\.xml$/;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Replaces each placeholder of xml that values names with its value; any other stays. */
function fillPlaceholders(xml: string, values: Record<string, string>): string {
  return xml.replace(placeholder, (match, key: string) =>
    key in values ? escapeXml(values[key]) : match,
  );
}

/**
 * Repeats the table row holding the schedule's placeholders (keys) once per payment,
 * filled, and drops the original, as the backend's cloneScheduleRows does. Word's paragraph
 * ids are removed from the copies, which would otherwise repeat.
 */
function cloneScheduleRows(
  doc: string,
  keys: string[],
  rows: ScheduleRow[],
): string {
  if (keys.length === 0) return doc;
  const first = `{${keys[0]}}`;
  const at = doc.indexOf(first);
  const starts = [...doc.slice(0, Math.max(at, 0)).matchAll(rowStart)];
  const end = doc.indexOf('</w:tr>', at);
  const last = starts.at(-1);
  if (at < 0 || last?.index === undefined || end < 0) {
    throw new Error(`${first} is not inside a table row`);
  }
  const from = last.index;
  const to = end + '</w:tr>'.length;
  const row = doc.slice(from, to).replace(wordIds, '');
  const copies = rows.map((r) => fillPlaceholders(row, r));
  return doc.slice(0, from) + copies.join('') + doc.slice(to);
}

/** A signature a party already gave: a base64 PNG and its picture's Alt Text. */
export interface PlacedSignature {
  picture: string;
  image: string;
}

const embedAttr = /r:embed="([^"]+)"/;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The media file, relative to word/, of the picture whose Alt Text is alt, found as the
 * backend's mediaFor finds it: the picture's relationship id, then the document's
 * relationships. Both pictures of one signer share it.
 */
function mediaFor(doc: string, rels: string, alt: string): string {
  const at = doc.indexOf(`descr="${alt}"`);
  if (at < 0)
    throw new Error(`the template has no picture with Alt Text ${alt}`);
  const embed = embedAttr.exec(doc.slice(at));
  if (!embed) throw new Error(`the picture ${alt} embeds no image`);
  const rel = new RegExp(
    `<Relationship\\b[^>]*\\bId="${escapeRegExp(embed[1])}"[^>]*>`,
  ).exec(rels);
  const target = rel && /\bTarget="([^"]+)"/.exec(rel[0]);
  if (!target) throw new Error(`no relationship ${embed[1]} for ${alt}`);
  return target[1];
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/**
 * Fills a template .docx in the browser for its preview: the schedule's rows, then every
 * {name} that values names, then the signatures the parties already gave, on their
 * pictures. The backend gathered each placeholder into one text run when the template was
 * uploaded, so a text replacement is enough; one values leaves out stays as it is, as the
 * backend leaves it. The backend fills the signed document from the same values and
 * signatures.
 */
export async function fillDocx(
  template: ArrayBuffer,
  values: Record<string, string>,
  scheduleKeys: string[],
  schedule: ScheduleRow[],
  signatures: PlacedSignature[] = [],
): Promise<ArrayBuffer> {
  const zip = await JSZip.loadAsync(template);
  for (const name of Object.keys(zip.files)) {
    if (!filledPart.test(name)) continue;
    let xml = await zip.file(name)?.async('string');
    if (xml === undefined) continue;
    if (name === 'word/document.xml') {
      xml = cloneScheduleRows(xml, scheduleKeys, schedule);
    }
    zip.file(name, fillPlaceholders(xml, values));
  }
  if (signatures.length > 0) {
    const doc = (await zip.file('word/document.xml')?.async('string')) ?? '';
    const rels =
      (await zip.file('word/_rels/document.xml.rels')?.async('string')) ?? '';
    for (const s of signatures) {
      zip.file(`word/${mediaFor(doc, rels, s.picture)}`, fromBase64(s.image));
    }
  }
  return zip.generateAsync({ type: 'arraybuffer' });
}
