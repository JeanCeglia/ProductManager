import { Router } from "express";
import { userModel } from "../models/users.js";

const user = Router();

user.get("/", async (req, res) => {
    try{
        const USERS = await userModel.find();
        res.status(200).send(USERS);
    }catch(error){
        res.status(500).send("Ocurrio un error inesperado", error);
    }
})

user.post("/", async (req, res) => {
    try{
        const {fullName, edad, pass, emaill} = req.body;
        const RESULT = await userModel.create({fullName, edad, pass, emaill})
        res.status(201).send(RESULT);
    }catch(e){
        res.status(500).send(`Ocurrio un error inesperado al crear el usuario ${e}`);
    }
})


export default user;