import { Router } from "express";
import { CarManagers } from "../config/carManagers.js";

const carManagers = new CarManagers('./src/data/carrito.json');
const carrito = Router();

carrito.post('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const { quantity } = req.body;
        const mensaje = await carManagers.addProductCar(productId, quantity);
        res.status(200).send(mensaje);
    } catch (error) {
        res.status(500).send(`Error interno al crear el carrito: ${error}`);
    }
});

carrito.get('/', async (req, res) => {
    try {
        const car = await carManagers.getCar()
        res.status(200).send(car)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
})


export default carrito;