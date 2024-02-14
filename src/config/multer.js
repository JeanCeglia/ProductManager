import multer from "multer";
import { __dirname } from "../path.js";

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, `${__dirname}/public/img`);
    },
    filename: (req, file, cd) => {
        cd(null, `${Date.now()}${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

export default upload;