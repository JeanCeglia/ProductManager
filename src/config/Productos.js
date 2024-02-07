import crypto from 'crypto';

export class Productos {
    constructor(name, description, code, stock, price){
        this.name = name,
        this.description = description,
        this.code = code,
        this.thumbnail = [],
        this.stock = stock,
        this.price = price,
        this.id = this.generateRandomId()
    }

    generateRandomId() {
        return crypto.randomBytes(10).toString('hex');
    }
}