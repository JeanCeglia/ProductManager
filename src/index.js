import express from "express";
import products from "./routes/Products.js";
import carrito from "./routes/carrito.js";
import upload from "./config/multer.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";

//settings
const app = express();
const PORT = 8000;

//server
const server = []; 

const io = new Server(server);

//Middlewares
app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

io.on('con nection', (socket) => {
    console.log('cliente conectado');
    
    socket.on('movimiento', info => { 
        //Cuando el cliente me envia un mensaje, lo capturo y lo muestro
        console.log(info)
    })
    
    socket.on('rendirse', info => { 
        //Cuando el cliente me envia un mensaje, lo capturo y lo muestro
        console.log(info)
        socket.emit('mensaje-jugador', "Te has rendido") //Cliente que envio este mensaje
        socket.broadcast.emit('rendicion', "El jugador se rindio") //Clientes que tengan establecida la comunicacion con el servidor
    })
    
});

//Routes
app.use('/static', express.static(__dirname + '/public'));
app.use('/api/products', products, express.static(__dirname + '/public'));
app.use('/api/car', carrito);
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        
        console.log(req.file);
        console.log(req.body);
        res.status(200).send('imagen subida correctamente');
        
    } catch (error) {
        res.status(500).send("Error al cargar la imagen.")
    }
});

/* app.get('/static', (req, res) => {
    
    const prods = [
        { id: 1, title: "Celular", price: 1500, img: "./img/17078660465233-4.png" },
        { id: 2, title: "Televisor", price: 1800, img: "https://www.radiosapienza.com.ar/Image/0/500_500-526469_1.jpg" },
        { id: 3, title: "Tablet", price: 1200, img: "https://www.radiosapienza.com.ar/Image/0/500_500-526469_1.jpg" },
        { id: 4, title: "Notebook", price: 1900, img: "https://www.radiosapienza.com.ar/Image/0/500_500-526469_1.jpg" }
    ]
    
    res.render('products', {
        mostrarProductos: true,
        productos: prods,
        css: 'products.css'
    })
}) */

app.listen(PORT, () => {
    console.log(`Servert on port ${PORT}`);
});