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
// import {PizZip} from 'pizzip';
// import {Docxtemplater} from 'docxtemplater';

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
        console.log('uniqueSuffix', uniqueSuffix);
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


router.post('/add_punishment',verifyToken, async (req, res) => {

    const user_id=req.userId;

    const {
        date, vehicle_id, count, fine,
    } = req.body;

    const created_by = user_id; // Adjust this to dynamically handle creator if needed
    console.log(created_by)

    const sql = `INSERT INTO tango_punishment_data (
        date, vehicle_id, count, fine, created_by
    ) VALUES (?)`;

    const values = [
        date, vehicle_id, count, fine, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_punishment/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        vehicle_id, punishment_id, fine
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE tango_punishment_data SET vehicle_id=?, punishment_id=?, fine=?, updated_by=? WHERE id=?`;
    const values = [
        vehicle_id, punishment_id, fine, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_punishment/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM tango_punishment_data WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})






export { router as tangoRouter }