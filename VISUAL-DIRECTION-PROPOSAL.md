# Visual and graphics direction proposal

## Purpose

This is a proposal only. The site should remain primarily typographic and reading-centered; the recommendation is to create a small, coherent visual vocabulary rather than add graphics throughout the site.

## Current visual foundation

The existing illustrated mountain-and-ensign hero works well as a proof of direction: it is warm, quiet, responsive to the color theme, and does not compete with the title. The limitation is that it is a general scripture-study image. It does not yet make a visitor feel that they have entered Isaiah, Genesis, or Jeremiah specifically.

## Recommended visual principle

Use illustrations as landmarks, not content. A reader should encounter them at moments of orientation:

- the home page,
- book landing pages,
- guides and theme pages,
- major explanatory diagrams.

Do not create chapter-by-chapter decorative art. The scripture text, highlighted phrases, and notes should remain the visual focus of a chapter page.

## Proposed visual system

### 1. Create one book-specific emblem for each book

Replace the single reused hero illustration on book pages with a small set of book-specific, original SVG illustrations. They should use the existing warm palette, simple filled shapes, and minimal detail.

Suggested directions:

| Book | Visual motif | Intended feeling |
| --- | --- | --- |
| Isaiah | A city on a hill with a vineyard, watchtower, or highway through the wilderness | Prophecy, Zion, distance becoming return |
| Jeremiah | A scroll, almond branch, and broken/renewed clay vessel | Calling, warning, remaking |
| Genesis | A river dividing into four streams, a tree, or a small altar beneath stars | Beginnings, covenant, family |

The illustrations should be symbolic rather than literal historical reconstructions. They can be reused at modest sizes in book-level guides and theme indexes.

### 2. Keep the home-page illustration as a stable invitation

Keep the home hero as the one broad, stable site-level illustration. It should convey coming unto Jesus Christ through patient study of the scriptures: light or a clear way forward, an open record or words, and a place of welcome or ascent. The current mountain-and-ensign direction is a strong starting point because it can suggest invitation and revelation without illustrating a sacred figure.

Book emblems, rather than the home hero, should provide the site’s changing visual specificity. This lets the home page become familiar over time while each book still has its own visual identity.

### 3. Prefer explanatory diagrams where a visual can teach

Use diagrams selectively when they clarify structure that prose alone makes difficult:

- a horizontal map of a book's literary divisions;
- a sparse geographic map for a guide about names and places;
- a timeline for historical context;
- a visual thread diagram that connects recurring images across a theme page.

These should use the established division colors and labels, but stay legible in grayscale and dark mode. They should be SVG and text-first: useful without a visual interpretation.

### 4. Add one quiet visual treatment to closing sections

The **Seeing Christ in…** sections are natural emotional endings. Rather than a full illustration, add a modest identifying mark—such as a small radiant line, branch, doorway, or water motif—that is shared across books but shifts subtly in the book's accent color.

It should be a cue of arrival, not a devotional illustration competing with the prose.

### 5. Keep the material language consistent

For every new visual, use these constraints:

- Original SVGs, or AI-assisted source artwork that is simplified and redrawn as an original SVG before use. Do not use stock photography or generated biblical scenes as final assets.
- Flat or lightly textured shapes, with two to five colors from the current design tokens.
- No photographic realism, faux parchment, ornamental borders, or icon overload.
- A clear light-theme and dark-theme palette for each illustration.
- `aria-hidden` for purely decorative art; a text caption and description for explanatory diagrams.

## AI illustration guidelines

Use this as the shared brief whenever generating or commissioning visual source material. It is intentionally specific about style and deliberately flexible about the symbol for a particular book.

### Visual constants

- Make a symbolic editorial illustration, not a scene from a biblical film.
- Use a calm, warm, restrained editorial-illustration style: broad, clean shapes with modest tonal layering and minimal internal detail. It should feel composed and mature rather than cartoonish, but remain flatter, clearer, and less expressive than a fine-art painting.
- Build the composition from two to five flat colors drawn from the site’s design tokens. Reserve the lightest color for a small focal point or sense of illumination.
- Favor an open composition with generous negative space, a clear silhouette, and one primary symbol. A small secondary detail is acceptable only when it reinforces the primary symbol.
- Use gentle geometry: hills, paths, branches, water, simple architecture, stars, scroll forms, and vessels. Keep line work sparse, medium-weight, and rounded where present.
- Design for a small responsive rectangle first. The emblem must remain recognizable at roughly 160 pixels wide and must not depend on tiny text or detail.
- Provide both light- and dark-theme color variants using the same forms and composition; do not merely invert the colors.

### Content boundaries

- Avoid faces, bodies, literal depictions of Jesus Christ or other sacred figures, battle scenes, and historical-costume realism.
- Avoid photorealism, painterly brushwork, fine-art canvas or watercolor effects, exaggerated cartoon proportions, 3D rendering, parchment texture, gold filigree, stained-glass effects, ornamental frames, clip-art icons, and visible AI artifacts.
- Do not include words, verse references, lettering, logos, UI controls, or decorative borders within the image.
- Do not make a claim the page’s text does not support. The visual should evoke a scriptural theme rather than interpret a passage by itself.

### Prompt scaffold

> Create a quiet, symbolic editorial illustration for a scripture-study website. The style is mature and composed—not cartoonish, not a fine-art painting—with broad clean filled shapes, restrained tonal layering, and minimal internal detail. Subject: **[book or page motif]**. Use **[two to five named site colors]**, ample negative space, and a single clear silhouette readable at small size. Convey **[intended feeling]** through symbolism rather than people or a literal biblical scene. No text, faces, sacred figures, realism, parchment, decorative frame, 3D effects, painterly texture, exaggerated cartoon forms, or ornate detail. Deliver an uncluttered landscape composition that can be redrawn as an accessible SVG, with distinct light- and dark-theme palettes.

AI output is reference material, not a drop-in asset: remove artifacts, normalize the geometry, verify palette contrast, and redraw the approved composition as a compact SVG before publishing.

## What not to add

- A hero image for every chapter.
- Generic ancient-world scenery that is unrelated to the book's content.
- Decorative images embedded among verse text.
- Artwork with faces or literal depictions of sacred figures; it would introduce theological, cultural, and stylistic questions without improving the reading task.

## Recommended first visual package

Start with three deliverables:

1. An Isaiah-specific hero emblem that replaces the generic mountain-and-ensign illustration where Isaiah is featured.
2. A Genesis and Jeremiah companion emblem built in the same visual language.
3. One explanatory SVG diagram for an existing guide or book division map.

That gives the site a recognizably authored visual world while keeping illustrations sparse and meaningful.
