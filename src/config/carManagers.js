import {promises as fs} from 'fs'

export class CarManagers {
    constructor(path){
        this.products = path;
    }

    async getCar() {
        const car = JSON.parse(await fs.readFile(this.products, 'utf-8'));
        return car;
    }

    async addProductCar(idProducto, quantity){
        const car = JSON.parse(await fs.readFile(this.products, 'utf-8'));

        const index = car.findIndex(product => product.id = idProducto);

        if(index != -1){
            car[index].quantity += quantity;
        }else{
            const prod = { id: idProducto, quantity: quantity }
            car.push(prod)
        }

        await fs.writeFile(this.products, JSON.stringify(car))
        return "Producto cargado correctamente"
    }
}