import { Router } from "express";
import { ProductManager } from "../config/ProductManager.js";
import { __dirname } from "../path.js";

const pm = new ProductManager(__dirname + `/data/Products.json`); //instanciando la clase ProductManager
const vista = Router();

vista.get("/", async (req, res) => {
    const productList = await pm.getProducts();
    res.render("home", {productList});
});

vista.get("/realTimeProducts", (req, res)=>{
    res.render("realtimeproducts")
})

export default vista;