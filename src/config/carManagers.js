import fs from "fs";

export class CarManagers {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  // Métodos privados
  async _readFile() {
    if (fs.existsSync(this.path)) {
      const cartlist = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(cartlist);
    } else {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  // READ
  async getCarts() {
    return await this._readFile();
  }

  async getCartbyId(objparams) {
    const { cid } = objparams;
    try {
      const allcarts = await this._readFile();
      const found = allcarts.find((element) => element.id === parseInt(cid));
      return found || "cart no existe";
    } catch (error) {
      return error;
    }
  }

  // GENERATE ID
  async generatecartId() {
    try {
      const cartlistJs = await this._readFile();
      const counter = cartlistJs.length;
      return counter === 0 ? 1 : cartlistJs[counter - 1].id + 1;
    } catch (error) {
      console.error("Error en generatecartId:", error);
      return 1; // Valor predeterminado en caso de error
    }
  }

  async addCart() {
    const listaCarts = await this.getCarts();
    const id = await this.generatecartId();
    const cartNew = {
      id,
      products: [],
    };
    listaCarts.push(cartNew);
    await this._writeFile(listaCarts);
  }

  async addProductToCart(cid, pid) {
    const listaCarts = await this._readFile();
    const cart = listaCarts.find((e) => e.id === cid);

    if (!cart) {
      console.error("El carrito no existe.");
      return;
    }

    const productIndex = cart.products.findIndex((p) => p.pid === pid);

    if (productIndex !== -1) {
      // Si el producto ya existe en el carrito, incrementar la cantidad
      cart.products[productIndex].quantity++;
    } else {
      // Si el producto no existe en el carrito, agregarlo como un nuevo objeto
      cart.products.push({
        pid,
        quantity: 1,
      });
    }

    await this._writeFile(listaCarts);
  }
}