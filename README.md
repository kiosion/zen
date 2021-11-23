# Zen
A simple socket.io web chat app.
- Public instance > https://zen.kio.dev/
- Project wiki > https://github.com/kiosion/zen/wiki

## Features:
- Public room and ability to create private rooms
- Supports setting usernames
- Timestamps for messages
- Protection against dumb stuff like injecting code or unsupported chars into message/username fields

## Hosting an instance:
1. Clone `https://github.com/kiosion/zen/` and cd into `./zen/`
2. Ensure node.js is up-to-date, or install it
3. Install project deps with `npm install --production`
4. Configure the server port (and any needed DNS records if using a domain)
5. Run start script in the project directory: `npm run start`, or `npm run start:dev` to use nodemon

## Known issues / todo:
- See [todo.md](TODO.md)
