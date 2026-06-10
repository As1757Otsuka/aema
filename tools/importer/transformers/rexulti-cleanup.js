/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rexulti.com site-wide cleanup.
 *
 * Removes non-authorable site chrome and third-party widgets so the import
 * contains only the page-level authorable content (hero + inline ISI).
 *
 * ALL selectors below were verified against migration-work/cleaned.html
 * for the rexulti.com homepage. Line references point at that captured DOM.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Third-party / overlay widgets that can interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk', // OneTrust cookie banner (cleaned.html line 815)
      '#addtoany', // AddToAny social-share iframe widget (cleaned.html line 807)
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site shell / global chrome and leftover widgets.
    WebImporter.DOMUtils.remove(element, [
      'header', // Top utility/announcement bar + main header/nav (cleaned.html line 9)
      'footer', // Site footer (cleaned.html line 683)
      '#drawer-isi', // Sticky ISI drawer tray, duplicate of inline ISI (cleaned.html line 480)
      '#block-customisiforgeneralsection', // Wrapper that holds only the sticky ISI drawer, lives outside <main> (cleaned.html line 478)
      '#drupal-live-announce', // ARIA live-region helper, empty (cleaned.html line 813)
      'div.hidden:empty', // Empty hidden placeholder div before main content (cleaned.html line 152)
      // Safe non-authorable element types.
      'iframe',
      'link',
      'noscript',
      'script',
      'style',
    ]);
  }
}
