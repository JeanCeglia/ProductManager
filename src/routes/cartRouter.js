import { Router } from "express";
import cartModel from "../models/cartModel.js";

const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const mensaje = await cartModel.create({ products: [] });
    res.status(201).send(mensaje);
  } catch (e) {
    res
      .status(500)
      .send(`Error interno del servidor al crear carrito: ${error}`);
  }
});

cartRouter.get("/:cid", async (req, res) => {
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

cartRouter.post("/:cid/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    const cart = await cartModel.findById(cartId);

    const indice = cart.products.findIndex(
      (product) => product.id_prod == productId
    );

    if (indice != -1) {
      //Consultar Stock para ver cantidades
      cart.products[indice].quantity = quantity; //5 + 5 = 10, asigno 10 a quantity
    } else {
      cart.products.push({ id_prod: productId, quantity: quantity });
    }
    const mensaje = await cartModel.findByIdAndUpdate(cartId, cart);
    res.status(200).send(mensaje);
  } catch (error) {
    res
      .status(500)
      .send(`Error interno del servidor al crear producto: ${error}`);
  }
});

//Aqui actualiza la cantidad de productos
cartRouter.put("/:cid/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).send("Invalid quantity");
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId, "products.id_prod": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send("Cart or product not found");
    }

    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send(`Internal error : ${error}`);
  }
});

//deberá eliminar del carrito el producto seleccionado.
cartRouter.delete("/:cid/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { id_prod: productId } } }, //eliminamos el producto del array segun el id
      { new: true } //devolvemos el carrito actualizado
    );

    if (updatedCart) {
      res.status(200).send(updatedCart);
    } else {
      res.status(404).send("Cart not found");
    }
  } catch (error) {
    res
      .status(500)
      .send(`internal error when deleting product from cart: ${error}`);
  }
});

//deja solo un array vacio en el carrito []
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const updatedCart = await cartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send("Cart not found");
    }

    res.status(200).send(" removed!");
  } catch (error) {
    res.status(500).send(`Internal error : ${error}`);
  }
});

export default cartRouter;
