# BadWolfMC Voting App

See the demo here: https://adimouk.github.io/BadWolfMC-Voting-App/

Minimalistic app designed to help remember to vote for BadWolfMC loyalty points. Created using React + Vite and Tailwind CSS. Also using lucide-react for icons.

To build your own app, clone / fork this repo and simply run `npm run build`.

To create the Tailwind CSS file (required for index.css file), run `npx @tailwindcss/cli -i ./src/input.css -o ./index.css ` optionally add `--watch` to the end to continually monitor for changes and rebuild as necessary.

List of servers to vote on is located in `.src/App.jsx`, on line 14 onwards.
 - `name` is a friendly name that's displayed on the site
 - `url` is meant to be the url that is either opened inside the iframe, or opens in a new tab
 - `id` needs to be a unique ID for this server
 - `type` needs to be either `iframe` or `link` which decides whether this opens in the inbuilt iframe or new tab
``` javascript
const votingSites = [
    { name: 'Friendly Name shown on site', url: 'https://badwolfmc.com/vote/badwolfmc', id: 'unique-id', type: 'iframe' },
    
    (...)
    
]

```

By default, script is designed to sit in base directory `/BadWolfMC-Voting-App/`. To edit this, change the `base` variable located in `vite.config.js` on line 6. For example if you'll run this on the base domain `https://example.com` then you can simply remove the base variable completely, otherwise ensure it contains both slash at the beginning and the trailing slash so `base: '/BadWolfMC-Voting-App/,`.

GitHub Actions is configured to automatically build the repo upon any pushes to master branch. This can then be seen on the GitHub Page https://adimouk.github.io/BadWolfMC-Voting-App/