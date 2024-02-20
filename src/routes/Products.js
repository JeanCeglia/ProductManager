import { Router } from "express";
import { ProductManager } from "../config/ProductManager.js";

const productManager = new ProductManager('./src/data/Products.json');
const products = Router();

products.get('/', async (req, res) => {
    try{

        const { limit } = req.query;
        const prods = await productManager.getProducts();
        let limite = parseInt(limit);

        if(!limite){
            limite = prods.length;
        }
        
        const prodsLimit = prods.slice(0, limite)
        res.status(200).render('products', {
            mostrarProductos: true,
            productos: prodsLimit,
            css: 'product.css'
        })

    }catch(error){
        res.status(500).send(`Error interno del servidor al consultar el cliente ${error}`);
    }
    

});

products.get('/:pid', async (req, res) => {
    try {
        
        const idProducto = req.params.pid;
        const prod = await productManager.getProductsById(idProducto);
        if(prod){
            res.status(200).send(prod);
        }else{
            res.status(404).send(`El producto con el id ${idProducto} no existe.`);
        }

    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar el cliente ${error}`);
    }
});

products.post('/', async (req, res) => {
    try {
        const product = req.body;
        const mensaje = await productManager.addProduct(product);
        if(mensaje == 'producto creado con exito.'){
            res.status(200).send(mensaje);
        }else{
            res.status(400).send(mensaje);
        }

    } catch (error) {
        res.status(500).send(`Error interno al crear el producto ${error}`);
    }
});

products.put('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const updateProduct = req.body
        const mensaje = await productManager.updateProduct(idProducto, updateProduct)
        if(mensaje == 'Producto actualizado con exito!'){
            res.status(200).send(mensaje);
        }else{
            res.status(404).send(mensaje)
        }
    } catch (error) {
        res.status(500).send(`Error interno al actualizar el producto ${error}`)
    }
});

products.delete('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const mensaje = await productManager.deleteProduct(idProducto)
        if (mensaje == "Producto eliminado correctamente"){
            res.status(200).send(mensaje)
        }
        else{
            res.status(404).send(mensaje)
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
});

export default products;