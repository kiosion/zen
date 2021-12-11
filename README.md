# Zen
A simple socket.io web chat app.
- Public instance > https://zen.kio.dev/
- Project wiki > https://github.com/kiosion/zen/wiki

## Features:
- Public room and ability to create private rooms
- Set usernames
- Timestamps for messages

## Hosting an instance:
1. Clone `https://github.com/kiosion/zen/` & cd into `./zen/`
2. Ensure node.js is up-to-date, or install it
3. Install project deps with `npm install --production`
4. Configure the server port (and any needed DNS records, if using a domain)
5. Run the start script in the project directory: `npm run start`, or `npm run start:dev` to use nodemon

## Known issues / Future plans:
- See [todo.md](TODO.md)
