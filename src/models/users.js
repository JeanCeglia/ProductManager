import { Schema, model } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        require: true
    },
    edad: {
        type: Number,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    emaill: {
        type: String,
        required: true,
        unique: true
    },
    rol: {
        type: String,
        default: "User"
    }
})

export const userModel = model("users", userSchema);