const multer = require("multer");
const uuid = require('uuid').v4;

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

//fileUpload ek multer object ko return karta hai jo ki ek group of middlewares hote hain,

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/images');
        },
        filename: (req, file, cb) => {
            const ext =  MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid()+'.'+ext);
        },
    }),
    //VALIDATION FOR IMAGE ERROR While signing up, we provide error checking validation from the frontend, but it is better to validate those inputs in the backend like the other inputs, as the frontend can be manipulated by the users. the fileFilter is used to validate the image file by returning a function with arguments(request, file, callback fn) which check's that whether the extension of file is present in the MIME_TYPE_MAP, the map returns undefined if th extension key is'nt found, this undefined is converted into false by using !! operator, which returns true if it finds it in map or false if map returns undefined, the value of isValid is then returned back to the callback function which is then excecuted
    
    //fileFilter is used to handle errors
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype)
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
        //cb or callback mein null paas karenge jab koi error nhi hai, aur agar hai to fir us error ko paas karenge
    }
});

module.exports = fileUpload;