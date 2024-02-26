import express from "express"; // importa express
import products from "./routes/Products.js"; //importamos la ruta productos
import carrito from "./routes/carrito.js"; //importamos la ruta donde manipulamos el carrito
import vista from "./routes/views.js";
import upload from "./config/multer.js";
import { Server } from "socket.io";
import socketProducts from "./listeners/socketProducts.js";
import { engine } from "express-handlebars"; //importamos el motor de plantillas
import { __dirname } from "./path.js"; //importamos la ruta raiz de nuestro proyecto

//settings
const app = express();
const PORT = 8000; //guardamos el puerto a utilizar en nuestro proyecto en una constante
const server = app.listen(PORT, () => {
    try {
        console.log(`Servert on port ${PORT}`);
    } catch (error) {
        console.log(error)
    }
});

const socketServer = new Server(server);
socketProducts(socketServer);


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

app.post('/upload', upload.single('product'), (req, res) => {
    try {
        
        console.log(req.file);
        console.log(req.body);
        res.status(200).send('imagen subida correctamente');
        
    } catch (error) {
        res.status(500).send("Error al cargar la imagen.")
    }
});

