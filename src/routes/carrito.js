import { Router } from "express";
import { CarManagers } from "../config/carManagers.js";

const carManagers = new CarManagers('./src/data/carrito.json');
const carrito = Router();

carrito.post("/:cid/products/:pid", async (req, res) => {
    try {
      const cid = parseInt(req.params.cid);
      const pid = req.params.pid;
  
      await carManagers.addProductToCart(cid, pid);
      res.status(200).json({ status: "success", message: "Product added to cart successfully." });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ status: "error", message: "Failed to add product to cart." });
    }
});

carrito.post("/", async (req, res) => {
    const newcart = await carManagers.addCart();
     res.json({ status: "success", newcart });
});

carrito.get('/', async (req, res) => {
    try {
        const car = await carManagers.getCarts()
        res.status(200).send(car)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
})

carrito.get("/:cid", async (req,res)=>{
    const carritofound=await carManagers.getCartbyId(req.params)
    res.json({status:"success",carritofound})
})

export default carrito;