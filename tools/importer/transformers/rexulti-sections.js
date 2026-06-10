/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rexulti.com section boundaries.
 *
 * Inserts a section break (<hr>) before each non-first section and a
 * Section Metadata block for any section that defines a `style`.
 *
 * Section definitions come from payload.template.sections (page-templates.json).
 * Section selectors were verified against migration-work/cleaned.html:
 *   - section-1-hero  -> #paragraph-2656 / .paragraph__hero-general (line 161)
 *   - section-2-isi   -> #inline-isi-wrapper / .general-isi-section (line 329)
 *
 * Runs in afterTransform only (block parsing has already produced cells).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

function findSectionElement(element, selectors) {
  if (!selectors) return null;
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const selector of list) {
    try {
      const found = element.querySelector(selector);
      if (found) return found;
    } catch (e) {
      // Ignore invalid selectors and keep trying the rest.
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  const document = element.ownerDocument;

  // Process in reverse order so earlier insertions do not shift later targets.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = findSectionElement(element, section.selector);
    if (!sectionEl) continue;

    // Section Metadata block (only when the section defines a style).
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metadataBlock);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
