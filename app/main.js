import { Productos } from "./Productos.js";
import { ProductManager } from "./ProductManager.js";

const producto1 = new Productos("Tv", "Smart tv 4k", 1, 20, 150000);
const producto2 = new Productos("pc", "pc gamer ryzen 5 5600g", 2, 10, 255000);
const producto3 = new Productos("notebook", "thikpad lenovo i5", 3, 22, 50000);
const producto4 = new Productos("notebook", "lenovo thikbook i5", 4, 14, 450000);

const producto1version2 = new Productos("tv", "smart tv 4k sansung", 1, 16, 150000);

const productManager = new ProductManager('./Products.json');

//productManager.addProduct(producto4);
//productManager.getProducts();
//productManager.getProductsById("d1f20eed8640baa681b2");
//productManager.updateProduct('871ef9cc5b75c230ba1e', producto1version2);
productManager.deleteProduct('8fad0c88355b1f42cfd4');