<div align="center">
<h1>Zen</h1>
  <p>A simple socket.io web chat app. >&nbsp;<a href="https://zen.kio.dev/" target="_blank">Public instance</a> >&nbsp;<a href="https://github.com/kiosion/zen/wiki" target="_blank">Project wiki</a></p>
</div>

### FEATURES
- Public room and ability to create private, single-use rooms
- Set usernames
- Timestamps for messages

### HOST AN INSTANCE
1. Clone using `git clone git@github.com:kiosion/zen.git` & cd into `./zen/`
2. Ensure node.js is installed and updated
3. Install project deps using `npm install --production`
4. Configure the server port (and any needed DNS records if using a domain name)
5. Run the startup script in the project directory
   * `npm run start`, or
   * `npm run start:dev` to run in dev mode with nodemon

### BUGS / TODO
- See [todo.md](TODO.md)
