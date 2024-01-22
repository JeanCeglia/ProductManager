import crypto from 'crypto';
import { Products } from './Products.js'; //importamos la clase Products para poder instanciar desde este archivo

class ProductManager {
    constructor(){
        this.products = []
    }

    validaCampos(product){
        if (product.name === undefined || product.description === undefined || product.code === undefined || product.thumbnail === undefined || product.stock === undefined || product.price === undefined) {
            throw new Error('Todos los campos son obligatorios.');
        }
    }

    addProduct(product){
        

        const codigo = this.products.find((prod) => prod.code === product.code)

        this.validaCampos(product);

        if(codigo === undefined){
             // usa de findIndex para recorrer el array products y buscar si encuentra el codigo
            const ID = this.products.findIndex(prod => prod.code === product.code);
            //si lo encuentra, devuelve 1 y si no, -1
            if(ID != -1){
                return `El producto ${product.name} cullo codigo es ${product.code} ya existe.`
            }else{
                product.id = crypto.randomBytes(10).toString('hex');
                this.products.push(product);
            }
        }else{
            return console.log('El codigo debe ser unico');
        }
    }

    getProducts(){
        this.products.forEach((e) => console.log(e));
    }

    //Buscamos por la propiedad code
    getProductsByCode(code){
        const encontrado = this.products.find((product) => 
            product.code === code
        )

        if(encontrado === undefined){
            return 'Not found'
        }else{
            return encontrado;
        }

    }

}

// Creando los productos en base a la clase Producto
const tv = new Products('Tv', 'Smart tv para tus series o pelis favoritas', 1, 'https://www.philips.com.ar/c-p/50PUD7406_77/7000-series-android-tv-led-4k-uhd', 20, 150000);

const PC = new Products('PC', 'Lenovo thinkStation pro', 2, 'https://www.lenovo.com/ar/es/workstations/thinkstation-p/c/thinkstationp', 10, 450000);

const notebook = new Products('notebook', 'Lenovo thinkpad l360', 3, 'https://www.lenovo.com/ar/es/workstations/thinkstation-p/c/thinkstationp', 15, 500000);
// Fin de creacion de objetos productos

//Aca creamos un productManager para gestionar la clase PM
const productManager1 = new ProductManager();

//Aca agregamos los productos creados al array de productos en la clase productManager
productManager1.addProduct(tv);
productManager1.addProduct(PC);
productManager1.addProduct(notebook);

//Mostrar los productos agregados al array producto de cla clase PM
//productManager1.getProducts();

//Buscamos por el codigo un producto especifico
console.log(productManager1.getProductsByCode(3)); 