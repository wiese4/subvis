# subvis
Visualized Subtitle Analysis

## Rules for Contributors
- Master branch ALWAYS contains a working version
- The code is organized strictly modular
- We use issues to track not yet done work
- Each issue is handled in an own branch

## Things to do
- List of available subtitles
  - local
  - id and/or imdbid, movie name
  - selectable e.g. via autocomplete search input field
  - List already created and filtered --> subtitles.txt (142802 movies)
  - create server-side, show client-side
- Filter subtitle files for a specific movie
  - Opus dump?
  - Use API?
  - Limit available movies and store list locally?
  - Always use the best rated sub file
  - server-side
- Download the selected subtitle file
  - Opus dump?
  - Use API
  - server-side
- Preprocess file
  - convert into object
  - server-side
- NLP
  - Node.js natural
  - server-side
- Visualise
  - Node.js D3
  - client-side