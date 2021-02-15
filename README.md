# Waiting List Widget

Used in Webflow website.

## Development

Run `npm start` then use `index.html` to preview.

For help with tailwind: https://tailwindcss.com/docs

### Tailwind preview

- copy the content of `tailwind.config.js`
- go to https://play.tailwindcss.com/,
- paste the config you copied in the "Config" tab
- use this playground to preview HTML

## Deployment

- make your changes
- run `npm run build` to re-generate the files inside the `dist/` folder
- create a new git commit and push

Then the website will automatically use the new files in `dist/` (that's all it needs).

## External linking

Keep the folder structure because the paths are linked to directly from webflow as per below:

Landing page:
- https://raw.githubusercontent.com/proptee/widget/master/waiting-list-widget/dist/bundle.js
- https://raw.githubusercontent.com/proptee/widget/master/waiting-list-widget/dist/final.html

Invest page:
- https://raw.githubusercontent.com/proptee/widget/master/waiting-list-investor-widget/dist/bundle.js
- https://raw.githubusercontent.com/proptee/widget/master/waiting-list-investor-widget/dist/final.html

This is why this repo is public (temporarily).
