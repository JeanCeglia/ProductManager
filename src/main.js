import { Productos } from "./config/Productos.js";
import { ProductManager } from "./config/ProductManager.js";
import express from "express";

const producto1 = new Productos("Tv", "Smart tv 4k", 1, 20, 150000);
const producto2 = new Productos("pc", "pc gamer ryzen 5 5600g", 2, 10, 255000);
const producto3 = new Productos("notebook", "thikpad lenovo i5", 3, 22, 50000);
const producto4 = new Productos("notebook", "lenovo thikbook i5", 4, 14, 450000);

const producto1version2 = new Productos("tv", "smart tv 4k sansung", 1, 16, 150000);

const productManager = new ProductManager('./src/data/Products.json');

//productManager.addProduct(producto4);
//productManager.getProducts();
//productManager.getProductsById("d1f20eed8640baa681b2");
//productManager.updateProduct('871ef9cc5b75c230ba1e', producto1version2);
//productManager.deleteProduct('8fad0c88355b1f42cfd4');

const app = express();
const PORT = 8000;

app.get('/products', async (req, res) => {
    const { limit } = req.query;
    const prods = await productManager.getProducts();
    const limite = parseInt(limit);
    if(limit){
        if (limite < 0) {
            res.send("Ingrese un numero valido")
        } else {
            const prodsLimit = prods.slice(0, limit)
            res.send(prodsLimit)
        }
    }else{
        res.send('Ingresa un dato valido');
    }

});

app.get('/products/:pid', async (req, res) => {
    const idProducto = req.params.pid;
    const prod = await productManager.getProductsById(idProducto);
    res.send(prod);
})

app.listen(PORT, () => {
    console.log(`Servert on port ${PORT}`)
})
