import multer from "multer";
import path from "path";

const destination = path.resolve('tmp');


const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}}`;
        const fileName = `${uniquePrefix}_${file.originalname}`;
        cb(null, fileName);
    }
})

const limits = {
    fileSize: 1024 * 1024 * 5,
}

const upload = multer({
    storage,
    limits,
})

export default upload;