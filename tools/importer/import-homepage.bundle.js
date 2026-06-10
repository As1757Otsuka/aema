/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-conditions.js
  function parse(element, { document }) {
    const withHint = (name, ...nodes) => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:${name} `));
      nodes.forEach((n) => {
        if (n) frag.appendChild(n);
      });
      return frag;
    };
    const heroImg = element.querySelector(
      ".paragraph__hero-general-images .paragraph__hero-general-image .field-type-image img"
    ) || element.querySelector(
      ".paragraph__hero-general-images-mobile .paragraph__hero-general-image-mobile .field-type-image img"
    ) || element.querySelector(".field-type-image img") || element.querySelector(":scope > img");
    const heading = element.querySelector(".paragraph__hero-general-content h1, h1");
    const subheading = element.querySelector(".paragraph__hero-general-links h2, h2");
    const conditionLinks = Array.from(
      element.querySelectorAll(".paragraph__hero-general-links a, .paragraph__hero-general-content a")
    );
    const cells = [];
    if (heroImg) {
      cells.push([withHint("image", heroImg)]);
    } else {
      cells.push([""]);
    }
    const textContent = [];
    if (heading) textContent.push(heading);
    if (subheading) textContent.push(subheading);
    textContent.push(...conditionLinks);
    if (textContent.length) {
      cells.push([withHint("text", ...textContent)]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-conditions", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rexulti-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        // OneTrust cookie banner (cleaned.html line 815)
        "#addtoany"
        // AddToAny social-share iframe widget (cleaned.html line 807)
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        // Top utility/announcement bar + main header/nav (cleaned.html line 9)
        "footer",
        // Site footer (cleaned.html line 683)
        "#drawer-isi",
        // Sticky ISI drawer tray, duplicate of inline ISI (cleaned.html line 480)
        "#block-customisiforgeneralsection",
        // Wrapper that holds only the sticky ISI drawer, lives outside <main> (cleaned.html line 478)
        "#drupal-live-announce",
        // ARIA live-region helper, empty (cleaned.html line 813)
        "div.hidden:empty",
        // Empty hidden placeholder div before main content (cleaned.html line 152)
        // Safe non-authorable element types.
        "iframe",
        "link",
        "noscript",
        "script",
        "style"
      ]);
    }
  }

  // tools/importer/transformers/rexulti-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function findSectionElement(element, selectors) {
    if (!selectors) return null;
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const selector of list) {
      try {
        const found = element.querySelector(selector);
        if (found) return found;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const document = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, section.selector);
      if (!sectionEl) continue;
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(metadataBlock);
      }
      if (i > 0) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-conditions": parse
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Rexulti brand homepage with hero, informational content sections, and navigation",
    urls: ["https://www.rexulti.com"],
    blocks: [
      {
        name: "hero-conditions",
        instances: ["#paragraph-2656", ".paragraph__hero-general"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero - Could REXULTI help?",
        selector: ["#paragraph-2656", ".paragraph__hero-general"],
        style: null,
        blocks: ["hero-conditions"],
        defaultContent: []
      },
      {
        id: "section-2-isi",
        name: "Important Safety Information and Indications",
        selector: ["#inline-isi-wrapper", ".general-isi-section"],
        style: null,
        blocks: [],
        defaultContent: [".isi-content-wrapper"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index";
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
