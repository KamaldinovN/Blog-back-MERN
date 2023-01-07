import express from 'express'
import fs from "fs"
import mongoose from "mongoose";
import multer from 'multer'
import cors from "cors"

import { registerValidation, loginValidation, postCreateValidation } from './validation/auth.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController } from './Controlers/index.js';

const PORT = process.env.PORT || 5000
const app = express()



app.use(express.json())
app.use(cors())


const storage = multer.diskStorage({
    destination: (_,__, cb) =>{
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename:(_,file, cb) =>{
        cb(null, file.originalname)
    },
})
app.use('/uploads', express.static('uploads'))
const upload = multer({storage})

mongoose
    .connect('mongodb+srv://nKama:123K@mern.7tfuwgl.mongodb.net/Main?retryWrites=true&w=majority')
    .then(() => console.log('MongoDb connected'))
    .catch((err) => console.log('MongoDb error', err))


app.listen(PORT, (err) => {
    if(err){
        return console.log(err)
    }
    console.log(`Server start at port ${PORT}`)
})



app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors,  UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth ,upload.single('image'),(req,res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/tags', PostController.getLastTags)


app.get('/posts/', PostController.getAll);
app.get('/posts/new', PostController.getNewPosts);
app.get('/posts/popular', PostController.getPopularPost);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update,
);