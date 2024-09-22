import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import Jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { superAdminRouter } from './Routes/SuperAdminRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { displayRouter } from './Routes/DisplayRoute.js';
import { employeeRouter } from './Routes/EmployeeRoute.js';

const app = express();

// Get the directory name from the URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This method is for single origin 
// app.use(cors({
//     // origin: "http://192.168.162.15:8211", // Allow your frontend's origin
//     // origin: "http://192.168.1.35:5173", // Allow your frontend's origin
//     origin: "http://localhost:5173", // Allow your frontend's origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true // Allow credentials such as cookies
// }));


// ####################################
// This method is for multiple origin
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://192.168.162.15:8211',
            'http://192.168.1.35:5173',
            'http://192.168.192.15:8211'
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow credentials such as cookies
}));


app.use(express.json());
app.use(cookieParser());
app.use('/display', displayRouter);
app.use('/auth', adminRouter);
app.use('/super', superAdminRouter);
app.use('/emp', employeeRouter);

app.use(express.static('Public'));

// Serve files from the 'Public/Uploads' directory
// app.use('/Uploads', express.static(path.join(__dirname, 'Public/Uploads')));
app.use('/Uploads', express.static(path.join(__dirname, 'Public','Uploads')));

app.listen(3001, () => {
    console.log("Server is running");
});
