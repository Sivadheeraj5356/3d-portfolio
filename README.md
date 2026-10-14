# Siva Dheeraj - portfolio desk

Portfolio of Siva Dheeraj, laid out as a small desktop: About (notes), Projects (finder), a working Terminal and Contact (mail). Plain HTML, CSS and JavaScript. No build step.

The site lives in `docs/`. Open `docs/index.html`, or serve that folder with any static server:

    cd docs && python3 -m http.server 8000

The terminal is a small in-browser simulation (client-side JavaScript only, no backend). Commands: `help`, `about`, `projects`, `stack`, `path`, `contact`, `open <about|projects|contact>`, `clear`.

## Notes

- Visual direction is a desktop-OS layout, inspired by the structure of nikhilsheoran.com. All code, copy and artwork here are original; no assets or text were copied.
- The site was studied with [REA](https://github.com/morluto/rea) (MIT) browser analysis to understand the reference's structure.
- Content comes from Siva's own portfolio, resume and GitHub.

## Reference analysis

`reference/rea-analyze-web-bundle.json` is output from REA 6.5.0 `analyze-web-bundle` run on https://nikhilsheoran.com/desktop (Next.js and React detected, 34 scripts). It is analysis metadata only.
