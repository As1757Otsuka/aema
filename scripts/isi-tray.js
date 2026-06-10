/*
 * Sticky ISI (Important Safety Information) tray.
 *
 * Mirrors the behavior on https://www.rexulti.com/: a fixed drawer pinned to the
 * bottom of the viewport that keeps the safety information on screen while
 * scrolling. It can be expanded/collapsed via a toggle, and it auto-hides once
 * the inline ISI section scrolls into view (the full copy is then visible in the
 * page, so the tray is redundant).
 *
 * The tray clones content from the inline ISI section already present in the
 * page, so there is a single source of truth for the safety copy.
 */

const COLLAPSED_HEIGHT = '160px';

function findInlineIsiSection(main) {
  // The inline ISI section is the one containing the ISI heading.
  const heading = main.querySelector(
    'h3#important-safety-information-and-indications-for-rexulti-brexpiprazole, [id^="important-safety-information"]',
  );
  return heading ? heading.closest('.section, div') : null;
}

function buildTray(sourceSection) {
  const tray = document.createElement('aside');
  tray.id = 'isi-tray';
  tray.className = 'isi-tray isi-tray-collapsed';
  tray.setAttribute('aria-label', 'Important Safety Information');

  // Header bar with title + toggle
  const header = document.createElement('div');
  header.className = 'isi-tray-header';

  const title = document.createElement('p');
  title.className = 'isi-tray-title';
  title.textContent = 'IMPORTANT SAFETY INFORMATION AND INDICATIONS';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'isi-tray-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'isi-tray-content');
  toggle.setAttribute('aria-label', 'Expand Important Safety Information');

  header.append(title, toggle);

  // Scrollable content cloned from the inline ISI
  const content = document.createElement('div');
  content.id = 'isi-tray-content';
  content.className = 'isi-tray-content';
  const clone = sourceSection.cloneNode(true);
  // Strip ids from the clone to avoid duplicate ids in the document.
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  clone.removeAttribute('id');
  content.append(clone);

  tray.append(header, content);
  return { tray, toggle, content };
}

export default function decorateIsiTray(main) {
  const sourceSection = findInlineIsiSection(main);
  if (!sourceSection) return;

  const { tray, toggle, content } = buildTray(sourceSection);
  document.body.append(tray);

  const setExpanded = (expanded) => {
    tray.classList.toggle('isi-tray-expanded', expanded);
    tray.classList.toggle('isi-tray-collapsed', !expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute(
      'aria-label',
      expanded ? 'Collapse Important Safety Information' : 'Expand Important Safety Information',
    );
    if (!expanded) content.scrollTop = 0;
  };

  toggle.addEventListener('click', () => {
    setExpanded(!tray.classList.contains('isi-tray-expanded'));
  });

  // Auto-hide the tray when the inline ISI section is in view.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        tray.classList.toggle('isi-tray-hidden', entry.isIntersecting);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -40% 0px' },
  );
  observer.observe(sourceSection);

  // Expose collapsed height as a CSS custom property for styling.
  tray.style.setProperty('--isi-tray-collapsed-height', COLLAPSED_HEIGHT);
}
