# BadWolfMC Voting App

Minimalistic app created using React + Vite and Tailwind CSS. Also using lucide-react for icons.

To create Tailwind CSS file (required for index.css file), run `npx @tailwindcss/cli -i ./src/input.css -o ./index.css ` optionally add `--watch` to the end to watch for changes.

List of servers is located in .src/App.jsx, on line 14 onwards.
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