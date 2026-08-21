# Sheppy Consulting website

A lightweight one-page website for **sheppyconsulting.co.uk**. It uses plain HTML, CSS and JavaScript, so there is no build process or software to install.

## Preview locally

Open `index.html` directly in a browser, or run a small local web server from this folder:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Before publishing

1. Review the services and experience copy for any wording or specific examples you want to add.

## Publish with GitHub Pages

1. Create a new GitHub repository (for example, `sheppy-consulting-site`).
2. Add the contents of this folder to the repository and push them to the `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will publish the site. The included `CNAME` file tells GitHub Pages to use `sheppyconsulting.co.uk`.

## Connect the domain

Only change the website DNS records; keep all Google Workspace MX, SPF and DKIM records unchanged.

For the root domain (`@`), GitHub Pages currently documents four `A` records. For `www`, add a `CNAME` pointing to `<your-github-username>.github.io`. Confirm the current values in GitHub's official custom-domain documentation before changing DNS, then enable **Enforce HTTPS** in Pages settings once the certificate is ready.

## Project structure

- `index.html`: content and page structure
- `styles.css`: layout, typography, colour and responsive styling
- `script.js`: mobile navigation, header behaviour and subtle reveals
- `assets/favicon.svg`: browser icon
- `CNAME`: custom domain configuration for GitHub Pages
- `.nojekyll`: serves the files directly without Jekyll processing
