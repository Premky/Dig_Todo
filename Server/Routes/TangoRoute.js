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
const currentDate = new NepaliDate().format('YYYY-MM-DD'); //Support for filter
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

//गाडीका विवरणहरुः नाम सुची
router.post('/add_vehicle', verifyToken, async (req, res) => {
    const active_office = req.userOffice;
    const user_id = req.userId;
    console.log(active_office, user_id)

    const {
        vehicle_np, vehicle_en
    } = req.body;

    const created_by = user_id; // Adjust this to dynamically handle creator if needed
    console.log(created_by)

    const sql = `INSERT INTO tango_vehicles (
        name_np, name_en
    ) VALUES (?)`;

    const values = [
        vehicle_np, vehicle_en
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_vehicle/:id', async (req, res) => {
    const id = req.params.id;
    const {
        vehicle_np, vehicle_en
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE tango_vehicles SET name_np=?, name_en=?  WHERE id=?`;
    const values = [
        vehicle_np, vehicle_en, id
    ];
    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_vehicle/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const sql = `DELETE FROM tango_vehicles WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch (err) {
        console.error('Error Deleting Record:', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})


//Rajashwa Sirshak hru
router.get('/rajashwa_data', async (req, res) => {
    const sql = `SELECT tp.*, tv.* 
            FROM tango_punishment_data tp
            LEFT JOIN tango_vehicles tv 
            ON tp.vehicle_id= tv.id
            `;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add_rajashwa', verifyToken, async (req, res) => {
    const active_office = req.userOffice;
    const user_id = req.userId;

    const {
        date, vehicle_id, count, fine,
    } = req.body;

    const created_by = user_id; // Adjust this to dynamically handle creator if needed
    console.log(created_by)

    const sql = `INSERT INTO tango_punishment_data (
        date, vehicle_id, count, fine, office_id, created_by
    ) VALUES (?)`;

    const values = [
        date, vehicle_id, count, fine, active_office, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_rajashwa/:id', async (req, res) => {
    const active_office = req.userOffice;
    const id = req.params.id;
    const {
        vehicle_id, count, fine, date,
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE tango_punishment_data SET vehicle_id=?, count=?, fine=?,date=?, updated_by=? WHERE id=?`;
    const values = [
        vehicle_id, count, fine, date, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_rajashwa/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const sql = `DELETE FROM tango_punishment_data WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch (err) {
        console.error('Error Deleting Record:', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

//कसुरका विवरणहरुः नाम सुची
router.post('/add_kasur', async (req, res) => {
    const active_office = req.userOffice;
    const user_id = req.userId;

    const {
        name_np, name_en
    } = req.body;

    const created_by = user_id; // Adjust this to dynamically handle creator if needed
    console.log(created_by)

    const sql = `INSERT INTO tango_punishment (
        name_np, name_en
    ) VALUES (?)`;

    const values = [
        name_np, name_en
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_kasur/:id', async (req, res) => {
    const id = req.params.id;
    const {
        name_np, name_en
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE tango_punishment SET name_np=?, name_en=?  WHERE id=?`;
    const values = [
        name_np, name_en, id
    ];
    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_kasur/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const sql = `DELETE FROM tango_punishment WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch (err) {
        console.error('Error Deleting Record:', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})


//For Kasur
router.get('/kashurs', async (req, res) => {
    const sql = `SELECT * FROM tango_punishment`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/kasur_data', async (req, res) => {
    const active_office = req.userOffice;
    const sql = `SELECT dk.*, tp.* 
            FROM tango_daily_kasur dk
            LEFT JOIN tango_punishment tp 
            ON dk.kasur_id= tp.id
            `;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add_kasurs', verifyToken, async (req, res) => {
    const active_office = req.userOffice;
    const user_id = req.userId;

    const {
        date, kasur_id, count, fine
    } = req.body;

    const created_by = user_id; // Adjust this to dynamically handle creator if needed
    console.log(created_by)

    const sql = `INSERT INTO tango_daily_kasur (
        date, kasur_id, count, fine, office_id, created_by
    ) VALUES (?)`;

    const values = [
        date, kasur_id, count, fine, active_office, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_kasurs/:id', async (req, res) => {
    const active_office = req.userOffice;
    const id = req.params.id;
    const {
        kasur_id, count, fine, date
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE tango_daily_kasur SET kasur_id=?,count=?, fine=?, date=?, updated_by=? WHERE id=?`;
    const values = [
        kasur_id, count, fine, date, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_kasurs/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const sql = `DELETE FROM tango_daily_kasur WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch (err) {
        console.error('Error Deleting Record:', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.get('/search_kasur', (req, res) => {
    const todaydate=currentDate
    // const todaydate='2081-07-08'
    const { date, type } = req.query; // Extract query parameters
    
    // Base SQL query with joins
    let sql = `
        SELECT dk.*, tp.*, o.* 
        FROM tango_daily_kasur dk 
        LEFT JOIN tango_punishment tp ON dk.kasur_id = tp.id 
        LEFT JOIN office o ON dk.office_id = o.o_id 
        WHERE 1=1
    `;
    const values = [];

    // Add conditions based on received parameters
    if (date) {
        sql += ' AND dk.date = ?';
        values.push(date);
    } else{
        sql += ' AND dk.date = ?';
        values.push(todaydate);
    }

    if (type) {
        sql += ' AND dk.punishment_id = ?'; // Adjust according to your schema
        values.push(type);
    }

    // Log the final query for debugging
    // console.log('Executing SQL:', sql);
    // console.log('With Params:', values);

    // Execute the query
    con.query(sql, values, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ Status: false, Error: 'Database query failed.' });
        }

        if (results.length > 0) {
            return res.json({ Status: true, Result: results });
        } else {
            return res.json({ Status: false, Error: 'No records found.' });
        }
    });
});

router.get('/search_rajashwa', (req, res) => {
    const todaydate=currentDate
    // const todaydate='2081-07-15'
    const { date, type } = req.query; // Extract query parameters
    
    // Base SQL query with joins
    let sql = `
        SELECT dk.*, tp.*, o.* 
        FROM tango_punishment_data dk 
        LEFT JOIN tango_vehicles tp ON dk.vehicle_id = tp.id 
        LEFT JOIN office o ON dk.office_id = o.o_id 
        WHERE 1=1
    `;
    const values = [];

    // Add conditions based on received parameters
    if (date) {
        sql += ' AND dk.date = ?';
        values.push(date);
    } else{
        sql += ' AND dk.date = ?';
        values.push(todaydate);
    }

    if (type) {
        sql += ' AND dk.vehicle_id = ?'; // Adjust according to your schema
        values.push(type);
    }

    // Log the final query for debugging
    // console.log('Executing SQL:', sql);
    // console.log('With Params:', values);

    // Execute the query
    con.query(sql, values, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ Status: false, Error: 'Database query failed.' });
        }

        if (results.length > 0) {
            return res.json({ Status: true, Result: results });
        } else {
            return res.json({ Status: false, Error: 'No records found.' });
        }
    });
});




export { router as tangoRouter }