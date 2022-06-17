// import { Server } from "./app";
import app from "./app";

var server = require('http').Server(app);

var server_port=4000;
server.listen(server_port, () => {
    console.log('listening on http://localhost:' + server_port);
});
//HOLA
// app.listen(app.get('port'), () => {
//     console.log(`Server on port ${app.get('port')}`);
// });

// const server = new Server();
// server.start();