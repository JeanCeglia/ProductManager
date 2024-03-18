import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
            id_product: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "products"
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

const cartModel = model('carts', cartSchema);
export default cartModel;