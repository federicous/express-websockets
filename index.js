const express = require('express');
let app = express();
let path = require('path')
let Contenedor=require('./public/manejadorDocumentos')
let {Server:HttpServer} = require('http')
let {Server:SocketIO} = require('socket.io');
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./public"));

app.set('views', path.join(__dirname, 'views', 'ejs'))
app.set('view engine', 'ejs');


app.get("/", async(req, res, next)=>{
	let total= await misProductos.getAll();
	res.render('index',{productList: total, listExist: total.length});
})

let misProductos = new Contenedor('./public/productos.txt')
let productos= [];
let dataArray=[];

let httpServer = new HttpServer(app);
let socketIOServer = new SocketIO(httpServer);

socketIOServer.on('connection', async socket =>{
	let misProductosGuardados= await misProductos.getAll()
	await socket.on('fillP', async data =>{
		/* let res = {
			id: socket.id,
			data
		} */
		await misProductos.save(data)
		dataArray.push(data)
		console.log(data);
		// console.log(dataArray);
		// productos.push(res)
		// replico la info a todos los conectados
		// socketIOServer.sockets.emit('listenserver', productos)
		// socketIOServer.sockets.emit('listenserver', dataArray)
		await socketIOServer.sockets.emit('listenserver', misProductosGuardados)
	})
	// await socketIOServer.sockets.emit('listenserver', misProductosGuardados)

	socket.emit('MI SALA', 'hola, desde la sala');
	await socket.emit('listenserver', misProductosGuardados)
	console.log(`Nuevo usuario: ${socket.id}`);
	console.log(`data arrray: ${dataArray}`);
	// Utilizo el archivo
	
})
// socketIOServer.init();

httpServer.listen(PORT, ()=>{
	console.log(`Server on!: http://localhost:${PORT}`)
})