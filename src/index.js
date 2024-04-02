import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import messageModel from "./models/messages.js";
import indexRouter from "./routes/indexRouter.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";

//Configuraciones o declaraciones
const app = express();
const PORT = 8000;

//Server
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

//Connection DB
mongoose
  .connect(
    "mongodb+srv://franco1018:coder1018@cluster0.ahjyvpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB is conect"))
  .catch((e) => console.log(e));

//Middlewares
app.use(express.json());
app.use(session({
  secret: "coderSecret",
  resave: true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://franco1018:coder1018@cluster0.ahjyvpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    ttl: 60 * 60
  }),
  saveUninitialized: true
}));
app.use(cookieParser('claveOculta'));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Routers
app.use("/", indexRouter);

//rutas cookies
app.get('/setCookie', (req, res) => {
  res.cookie('CookieCookie', 'esto es una cookie', { maxAge: 3000000, signed: true }).send('cookie creada');
});

app.get('/getCookie', (req, res)=>{
  res.send(req.signedCookies);
});

app.get('/deleteCookie', (req, res)=> {
  res.clearCookie('CookieCookie').send('Cookie eliminada')
})

//Session Routes

app.get('/session', (req, res) => {
  console.log(req.session)
  if (req.session.counter) {
      req.session.counter++
      res.send(`Sos el usuario N° ${req.session.counter} en ingresar a la pagina`)
  } else {
      req.session.counter = 1
      res.send("eres el primer usuario que ingresa a la pagina")
  }
})

app.get('/login', (req, res) => {
  const { email, password } = req.body

  if (email == "admin@admin.com" && password == "1234") {
      req.session.email = email
      req.session.password = password
  }
  console.log(req.session)
  res.send("Login")
})

//webSocket
io.on("connection", (socket) => {
  console.log("Conexion con Socket.io");

  socket.on("mensaje", async (mensaje) => {
    try {
      await messageModel.create(mensaje);
      const mensajes = await messageModel.find();
      io.emit("mensajeLogs", mensajes);
    } catch (e) {
      io.emit("mensajeLogs", e);
    }

  });

});