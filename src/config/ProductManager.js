import {promises as fs} from "fs";
import crypto from 'crypto';

export class ProductManager {
    //Metodo constructor que recibe la ruta donde se encuentra el json que almacena los productos "la base de datos"
    constructor(path){
        this.path = path
    }

    //Creo una funcion que captura el objeto enviado al momento de crear un nuevo producto en addProduct
    validaCampos(product){
        //validamos que el objeto tenga los siguientes parametros, si falta alguno, lo captura y devuelve un mensaje de error
        if (!product.name || !product.description || !product.code || !product.stock || !product.price) {
            throw new Error('Todos los campos son obligatorios.');
        }
    }

    async addProduct(product){ //Recibimos el objeto al intentar crear un producto
        
        //Creamos un constante que lee el alrchivo que esta en la ruta antes traida desde el constructor
        //usamos el JSON.parse para convertir en objetos los datos que se encuentren en dicho fichero que antes habiamos leido y que ahora se almacenan en la constante prods.
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        
        this.validaCampos(product); //invocamos la funcion que validaba los datos traidos al intentar agregar el nuevo producto, en caso de que todo este bien, sigue el flujo
        
        const codigo = prods.find((prod) => prod.code === product.code) //la constante codigo va a analizar prods, buscando que el valor code del producto que estamos intentando agregar ya no exista en los productos almacenado en el fichero que estamos leyendo en la constante prods

        if(!codigo){//la funcion find devuelve undefined en caso de que el codigo no este creado ya, ese caso, procedemos a crear el producto.
            product.id = crypto.randomBytes(10).toString('hex'); //creamos un id con el modulo crypto nativo de node (opcion sugerida por el profe)
            product.status = true;
            prods.push(product);//pusheamos el objeto del nuevo producto en el array de objetos
            await fs.writeFile(this.path, JSON.stringify(prods)) //reescribimos el fichero que se encuentra en la ruta recibida, usamos el JSON.stringify para volverlo a u su estado inicial.
            return 'producto creado con exito.';//Si todo esta bien, retornamos un mensaje. 
        }else{
            return 'El producto ya existe. '; //si el codigo se encuentra pro el find, retornamos un mensaje que avisa la existencia del producto. 
        }
    }

    //la funcion getProduct nos permite visualizar todos los productos que tenemos en la "base"
    async getProducts(){
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'));// leemos y convertimos en objetos los productos
        return prods; //retornamos el array de productos para que se puedan visualizar. 
    }

    //Esta funcion basicamente lo que hace es leer el fichero y devolverme el objeto que contenga el id que le proporcionamos al invocarla
    async getProductsById(id){
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8')); //leemos y convertimos el fichero
        const prod = prods.find((product) => //creamos una constante prod, la cual va a almacenar el objeto que coincida con el id recibido en el parametro
            product.id === id
        )

        return prod; //retornamos el objeto encontrado para ser visualizado

    }

    //Esta funcion nos sirve para actualizar un producto ya existente en la "base", recibe dos parametros, id: el cual usaremos para buscar el producto a actualizar y como segundo parametro pasaremos los datos actualizados de dicho producto
    async updateProduct(id, nuevoProducto) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8')) //leemos y convertimos el fichero
        const indice = prods.findIndex(producto => producto.id === id); //El findIndex me devuelve la posicion en la que se encuentra el producto y devuelve -1 si no lo encuentra.

        if (indice != -1) { //en caso de encontrar el producto, procedemos a actualizarlo
            prods[indice].name = nuevoProducto.title
            prods[indice].description = nuevoProducto.description
            prods[indice].code = nuevoProducto.code
            prods[indice].thumbnail = nuevoProducto.thumbnail
            prods[indice].stock = nuevoProducto.stock
            prods[indice].price = nuevoProducto.price
            await fs.writeFile(this.path, JSON.stringify(prods)) //y por ultimo reescribimos el fichero
            return 'Producto actualizado con exito!'; //devolvemos al usuario un mensaje indicando la actualizacion
        } else {
            return 'El producto no existe'; //en caso de no encontrar el id, avisamos que el producto no existe. 
        }

    }

    //Esta funcion elimina un producto de nuestra "base", recibe un id, que corresponde al producto que vamos a eliminar.
    async deleteProduct(id) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8')); //leemos y convertimos el fichero
        const indice = prods.findIndex(producto => producto.id === id); //El findIndex me devuelve la posicion en la que se encuentra el producto y devuelve -1 si no lo encuentra.

        if (indice != -1) { //en caso de encontrar el producto, procedemos a eliminarlo
            const prodsFiltrados = prods.filter(prod => prod.id != id); //el filter me devuelve un nuevo arrauy con todos los las posiciones que cumplan con la condiciones, en este caso me devolvera un array de objetos que no contengan el id que pasamos por parametros
            await fs.writeFile(this.path, JSON.stringify(prodsFiltrados)); //reescribimos el fichero una vez mas, pero ahora le pasamos los productos filtrados (que no incluyen el producto del id pasado por parametro)
            return 'Producto eliminado correctamente'; //devolvemos mensaje
        } else {
            return 'Producto no existe'; //en caso de no encontrar el id, avisamos que ya no existe el producto y por ende, no hay nada que borrar. 
        }

    }

}