/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-conditions.
 * Base block: hero.
 * Variant: hero-conditions (xwalk).
 * Source URL: https://www.rexulti.com
 * Selector: #paragraph-2656 / .paragraph__hero-general
 * Generated: 2026-06-10
 *
 * Model fields (blocks/hero-conditions/_hero-conditions.json):
 *   - image    (reference)  -> row 1, field:image  (primary lifestyle hero photo)
 *   - imageAlt (text, Alt)  -> collapsed into the <img alt="..."> attribute (no row/hint)
 *   - text     (richtext)   -> row 2, field:text   (H1 heading, H2 subheading, condition CTAs)
 *
 * Layout follows the block library description: dark-green overlay panel with the H1
 * "Could REXULTI help?", an H2 "Choose a Condition", and two condition selector links
 * (Depression -> /mdd, Agitation ... -> /aad), over a full-bleed lifestyle background image.
 */
export default function parse(element, { document }) {
  // --- Field hint helper: prepend `<!-- field:name -->` before the cell content ---
  const withHint = (name, ...nodes) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    nodes.forEach((n) => {
      if (n) frag.appendChild(n);
    });
    return frag;
  };

  // ---------------------------------------------------------------------------
  // INPUT EXTRACTION (validated against live DOM at #paragraph-2656)
  // ---------------------------------------------------------------------------

  // Primary lifestyle hero photo: first image in the desktop slick carousel.
  // Fallbacks cover the mobile carousel and any direct top-level <img>.
  const heroImg = element.querySelector(
    '.paragraph__hero-general-images .paragraph__hero-general-image .field-type-image img',
  )
    || element.querySelector(
      '.paragraph__hero-general-images-mobile .paragraph__hero-general-image-mobile .field-type-image img',
    )
    || element.querySelector('.field-type-image img')
    || element.querySelector(':scope > img');

  // Overlay panel content.
  const heading = element.querySelector('.paragraph__hero-general-content h1, h1');
  const subheading = element.querySelector('.paragraph__hero-general-links h2, h2');
  const conditionLinks = Array.from(
    element.querySelectorAll('.paragraph__hero-general-links a, .paragraph__hero-general-content a'),
  );

  // ---------------------------------------------------------------------------
  // OUTPUT STRUCTURE (simple block: 2 content rows -> image, text)
  // ---------------------------------------------------------------------------
  const cells = [];

  // Row 1: image (imageAlt is collapsed into the <img alt> attribute).
  if (heroImg) {
    cells.push([withHint('image', heroImg)]);
  } else {
    cells.push(['']);
  }

  // Row 2: text (richtext) -> heading + subheading + condition CTAs.
  const textContent = [];
  if (heading) textContent.push(heading);
  if (subheading) textContent.push(subheading);
  textContent.push(...conditionLinks);

  if (textContent.length) {
    cells.push([withHint('text', ...textContent)]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-conditions', cells });
  element.replaceWith(block);
}
