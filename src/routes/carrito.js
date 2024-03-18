import { Router } from "express";
import cartModel from "../models/cartModel.js";

const carrito = Router();

carrito.post("/", async (req, res) => {
  try {
    const newcart = await cartModel.create({ products: [] });
    res.status(200).send(newcart);
  } catch (e) {
    res.status(500).send(`Error inesperado al crear el carrito ${e}`);
  }
});

carrito.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);
    const index = cart.products.findIndex((product) => product.id_prod == pid);

    if (index != -1) {
      //Consultar Stock para ver cantidades
      cart.products[index].quantity = quantity; //5 + 5 = 10, asigno 10 a quantity
    } else {
      cart.products.push({ id_prod: pid, quantity: quantity });
    }
    const mensaje = await cartModel.findByIdAndUpdate(cid, cart);
    res.status(200).send(mensaje);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al crear producto: ${error}`);
  }
});

carrito.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId);
    res.status(200).send(cart);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al consultar carrito: ${error}`);
  }
});

export default carrito;
