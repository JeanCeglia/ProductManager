import express from "express";
import products from "./routes/Products.js";

const app = express();
const PORT = 8000;

//ejecutar JSON desde express
app.use(express.json());
app.use('/static', express.static('public'))

app.use('/products', products)

app.listen(PORT, () => {
    console.log(`Servert on port ${PORT}`)
});
