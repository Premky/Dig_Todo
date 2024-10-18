import express from 'express'
import con from '../utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt' //Toencrypt the password
import multer from 'multer' //For File Handling
import path from 'path'
// import { Upload } from 'react-bootstrap-icons'
import verifyToken from '../middleware/verifyuser.js'
import NepaliDate from 'nepali-datetime'
import fs from 'fs';
import { promisify } from 'util';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router()
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date = fy + '-4-1'

// const storage = multer.memoryStorage(); //you can change this to diskstorege if needed
// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = 'Public/Uploads/Employee';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir); // Set the upload directory
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now(); // or use a library like uuid
        const sanitized = sanitizedFilename(file.originalname);
        console.log('uniqueSuffix',uniqueSuffix);
        console.log('sanitized', sanitized);

        const filename = `${uniqueSuffix}_${sanitized}`;
        callback(null, filename); // Set the filename
    }
});

// Function to sanitize filenames
const sanitizedFilename = (filename) => {
    return filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};

const upload = multer({ storage: storage });

const query = promisify(con.query).bind(con);
// console.log(fy_date)

router.post('/add_emp', upload.single('photo'), async (req, res) => {
    const { 
        docr_no, personal_no, pmis, symbol_no, name_en, name_np, dob, recruit_date, recruit_rank, gender, 
        sanchay_kosh, nalakosh, pan, ctz_no, issue_district, blood_group, height, chest, huliya, warna, family 
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed
    const filePath = req.file ? path.posix.join('Uploads/Employee', req.file.filename) : null; // Handle file upload path

    console.log('filepath:',filePath)

    const sql = `INSERT INTO employee (
        docr_no, personal_no, pmis, symbol_no, name_en, name_np, dob, recruit_date, recruit_rank, gender, 
        sanchay_kosh, nalakosh, pan, ctz_no, issue_district, blood_group, height, chest, huliya, warna, photo, family, created_by
    ) VALUES (?)`;

    const values = [
        docr_no, personal_no, pmis, symbol_no, name_en, name_np, dob, recruit_date, recruit_rank, gender, 
        sanchay_kosh, nalakosh, pan, ctz_no, issue_district, blood_group, height, chest, huliya, warna, 
        filePath, // Store file path as photo in the database
        family, created_by
    ];
    
    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis:pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});




export {router as employeeRouter}