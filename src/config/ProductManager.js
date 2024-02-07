import {promises as fs} from "fs";

export class ProductManager {
    constructor(path){
        this.path = path
    }

    validaCampos(product){
        if (!product.name || !product.description || !product.code || !product.stock || !product.price) {
            throw new Error('Todos los campos son obligatorios.');
        }
    }

    async addProduct(product){
        
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        
        this.validaCampos(product);
        
        const codigo = prods.find((prod) => prod.code === product.code)

        if(!codigo){
            
            prods.push(product);
            await fs.writeFile(this.path, JSON.stringify(prods))
            return console.log('producto creado con exito.');
        }else{
            return console.log('El producto ya existe. ');
        }
    }

    async getProducts(){
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        return prods;
    }

    //Buscamos por la propiedad code
    async getProductsById(id){
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const prod = prods.find((product) => 
            product.id === id
        )

        if(!prod){
            return 'Product does not exist';
        }else{
            return prod;
        }

    }

    async updateProduct(id, nuevoProducto) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = prods.findIndex(producto => producto.id === id)
        if (indice != -1) {
            prods[indice].name = nuevoProducto.title
            prods[indice].description = nuevoProducto.description
            prods[indice].code = nuevoProducto.code
            prods[indice].thumbnail = nuevoProducto.thumbnail
            prods[indice].stock = nuevoProducto.stock
            prods[indice].price = nuevoProducto.price
            await fs.writeFile(this.path, JSON.stringify(prods))
            return console.log('Producto actualizado con exito!')
        } else {
            return console.log('El producto no existe')
        }

    }

    async deleteProduct(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const indice = prods.findIndex(producto => producto.id === id)
        if (indice != -1) {
            const prodsFiltrados = prods.filter(prod => prod.id != id)
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados))
            return console.log('Producto eliminado correctamente')
        } else {
            return console.log('Producto no existe')
        }

    }

}