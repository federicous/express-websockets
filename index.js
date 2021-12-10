const express = require('express');
let app = express();
let path = require('path')
let {Server:HttpServer} = require('http')
let {Server:SocketIO} = require('socket.io');
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./public"));

app.set('views', path.join(__dirname, 'views', 'ejs'))
app.set('view engine', 'ejs');


app.get("/", (req, res, next)=>{
	res.render('index',{});
})

let productos= [];

let httpServer = new HttpServer(app);
let socketIOServer = new SocketIO(httpServer);

socketIOServer.on('connection', socket =>{
	socket.on('fillP', data =>{
		let res = {
			id: socket.id,
			data
		}
		productos.push(res)
		socketIOServer.sockets.emit('fillP', productos)
	})
	socket.emit('MI SALA', 'hola, desde la sala');
	console.log(`Nuevo usuario: ${socket.id}`);
})

httpServer.listen(PORT, ()=>{
	console.log(`Server on!: http://localhost:${PORT}`)
})