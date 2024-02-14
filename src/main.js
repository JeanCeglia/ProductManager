import express from "express";
import products from "./routes/Products.js";
import carrito from "./routes/carrito.js";
import upload from "./config/multer.js";
import { __dirname } from "./path.js";

//settings
const app = express();
const PORT = 8000;

//Middlewares
app.use(express.json());
app.use('/static', express.static(__dirname + '/public'));

//Routes
app.use('/api/products', products);
app.use('/api/car', carrito);
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        
        console.log(req.file);
        console.log(req.body);
        res.status(200).send('imagen subida correctamente');

    } catch (error) {
        res.status(500).send("Error al cargar la imagen.")
    }
})

//server
app.listen(PORT, () => {
    console.log(`Servert on port ${PORT}`);
});
