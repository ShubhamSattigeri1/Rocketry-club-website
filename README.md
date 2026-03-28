# rocketry New website

## Project structure

```text
.
|-- data/
|   `-- submissions.csv
|-- public/
|   |-- assets/
|   |   |-- images/
|   |   `-- videos/
|   |-- css/
|   |   `-- style.css
|   |-- js/
|   |   `-- script.js
|   `-- index.html
|-- server.js
`-- README.md
```

## Run locally

Start the site with:

```bash
node server.js
```

The CSV endpoint stores submissions at `data/submissions.csv`.
The current frontend form submission in `public/js/script.js` uses Supabase.
