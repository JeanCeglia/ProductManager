import express from "express"; // importa express
import products from "./routes/Products.js"; //importamos la ruta productos
import carrito from "./routes/carrito.js"; //importamos la ruta donde manipulamos el carrito
import chatRouter from "./routes/chatRouter.js";
import user from "./routes/user.js";
import vista from "./routes/views.js";
import { ProductManager } from "./config/ProductManager.js";
import upload from "./config/multer.js";
//import socketProducts from "./listeners/socketProducts.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { engine } from "express-handlebars"; //importamos el motor de plantillas
import { __dirname } from "./path.js"; //importamos la ruta raiz de nuestro proyecto

//settings
const app = express();
const PORT = 8000; //guardamos el puerto a utilizar en nuestro proyecto en una constante

//Conections db
mongoose.connect('mongodb+srv://franco1018:coder1018@cluster0.ahjyvpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("DB is conect")).catch(e => console.log(e));


//Middlewares
app.use(express.json()); //hace que express use json
//Config handlebars
app.engine('handlebars', engine()); //indicamos la configuracion que va a tener el motor de plantillas
app.set('views', __dirname + '/views');//donde se encuentran las plantillas
app.set('view engine', 'handlebars');//le indico que lo use
//end config handlebars


//Routes
app.use('/static', express.static(__dirname + '/public'));
app.use('/api/products', products);
app.use('/api/car', carrito);
app.use("/", vista);
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
app.use("/api/users", user);

app.post('/upload', upload.single('product'), (req, res) => {
    try {
        
        console.log(req.file);
        console.log(req.body);
        res.status(200).send('imagen subida correctamente');
        
    } catch (error) {
        res.status(500).send("Error al cargar la imagen.")
    }
});

const server = app.listen(PORT, () => {
    try {
        console.log(`Servert on port ${PORT}`);
    } catch (error) {
        console.log(error)
    }
});

const socketServer = new Server(server);

const pm = new ProductManager("./data/products.json");

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id);
        const listadeproductos = await pm.getProducts();
        
        socketServer.emit("enviodeproducts", listadeproductos);
        
        socket.on("addProduct", async (obj) => {
            await pm.addProduct(obj);
            const listadeproductos = await pm.getProducts();
            socketServer.emit("enviodeproducts", listadeproductos);
        });
        
        socket.on("deleteProduct", async (id) => {
            await pm.deleteProduct(id);
            const listadeproductos = await pm.getProducts();
            socketServer.emit("enviodeproducts", listadeproductos);
        });
    });
};

const mensajes = [];
socketServer.on('connection', (server) => {
    console.log("Conexion con Socket.io")

    server.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje)
            const mensajes = await messageModel.find()
            socketServer.emit('mensajeLogs', mensajes)
        } catch (e) {
            socketServer.emit('mensajeLogs', e)
        }

    })

})

socketProducts(socketServer);