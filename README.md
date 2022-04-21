<div align="center">
<h1>Zen</h1>
  <p>A simple socket.io-based web chat app.</p>
  <p><a href="https://zen.kio.dev/" target="_blank">⇒&nbsp;Public&nbsp;instance</a></p>
  <p><a href="https://github.com/kiosion/zen/wiki" target="_blank">⇒&nbsp;Project&nbsp;wiki</a></p>
</div>

### FEATURES
- Public chat room, and ability to create private, single-use rooms
- Set usernames
- Date/Timestamps for messages
- Planned: Member lists, register accounts, voice rooms using webRTC

### HOST AN INSTANCE
1. Clone using `git clone git@github.com:kiosion/zen.git` & cd into `zen/`
2. Ensure node.js is installed and updated
3. Install project deps using `npm i`
4. Configure server port (and any needed DNS records if using a domain name)
5. Run the build + startup scripts in the project directory
   * `npm run build` + `npm run serve`, or
   * `npm run dev` to run in dev mode with concurrently + nodemon

### BUGS / TODO
- See [todo.md](TODO.md)
