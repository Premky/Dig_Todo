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

router.post('/add_emp', upload.single('photo'), async (req, res) => {
    const {
        docr_no, personal_no, pmis, symbol_no, name_en, name_np, dob, recruit_date, recruit_rank, gender,
        sanchay_kosh, nalakosh, pan, ctz_no, issue_district, blood_group, height, chest, huliya, warna, family
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed
    const filePath = req.file ? path.posix.join('Uploads/Employee', req.file.filename) : null; // Handle file upload path

    console.log('filepath:', filePath)

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
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_emp/:id',upload.none(), async (req, res) => {
    const id=req.params.id;    
    const {
        docr_no, personal_no, pmis, symbol_no, name_en, name_np, dob, recruit_date, recruit_rank, gender,
        sanchay_kosh, nalakosh, pan, ctz_no, issue_district, blood_group, height, chest, huliya, warna, family
    } = req.body;

    
    const updated_by = 1;
    const sql = `UPDATE employee SET docr_no=?, personal_no=?, pmis=?, symbol_no=?, name_en=?, name_np=?, dob=?, recruit_date=?, recruit_rank=?, gender=?,
        sanchay_kosh=?, nalakosh=?, pan=?, ctz_no=?, issue_district=?, blood_group=?, height=?, chest=?, huliya=?, warna=?, family=?, updated_by=? WHERE pmis=?`;
    const values = [
        docr_no, personal_no, pmis, symbol_no, name_en, name_np, dob, recruit_date, recruit_rank, gender,
        sanchay_kosh, nalakosh, pan, ctz_no, issue_district, blood_group, height, chest, huliya, warna, family, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})


router.post('/add_qualification', async (req, res) => {

    const {
        pmis, level, faculty, institute, country, pass_year, rank, gpa, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_education (
        pmis, level, faculty, institute, country, pass_year, edu_rank, gpa, remarks, created_by, office_id, branch_id
    ) VALUES (?)`;

    const values = [
        pmis, level, faculty, institute, country, pass_year, rank, gpa, remarks, created_by, created_by, created_by
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});



router.put('/update_qualification/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis, level, faculty, institute, country, pass_year, rank, gpa, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_education SET pmis=?, level=?, faculty=?, institute=?, country=?, pass_year=?, edu_rank=?, gpa=?, remarks=?, updated_by=? WHERE edu_id=?`;
    const values = [
        pmis, level, faculty, institute, country, pass_year, rank, gpa, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_qualification/:id', async(req,res)=>{
    const {id} = req.params;
    try{
        const sql = `DELETE FROM emp_education WHERE edu_id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.post('/add_training', async (req, res) => {

    const {
        pmis, training, grade, training_center, batch, start_date, end_date, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_training (
        pmis, training, grade, training_center, batch, start_date, end_date, remarks, created_by
    ) VALUES (?)`;

    const values = [
        pmis, training, grade, training_center, batch, start_date, end_date, remarks, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_training/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis, training, grade, training_center, batch, start_date, end_date, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_training SET pmis=?, training=?, grade=?, training_center=?, batch=?, start_date=?, end_date=?, remarks=?, updated_by=? WHERE id=?`;
    const values = [
        pmis, training, grade, training_center, batch, start_date, end_date, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_training/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM emp_training WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.post('/add_award', async (req, res) => {

    const {
        pmis, name, office_id, date, prize, sn, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_award (
        pmis, name, office_id, date, prize, sn, remarks, created_by
    ) VALUES (?)`;

    const values = [
        pmis, name, office_id, date, prize, sn, remarks, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_award/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis, name, office_id, date, prize, sn, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_award SET pmis=?, name=?, office_id=?, date=?, prize=?, sn=?, remarks=?, updated_by=? WHERE id=?`;
    const values = [
        pmis, name, office_id, date, prize, sn, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_award/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM emp_award WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.post('/add_decoration', async (req, res) => {

    const {
        pmis, name, office_id, date, prize, sn, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_decoration (
        pmis, name, office_id, date, prize, sn, remarks, created_by
    ) VALUES (?)`;

    const values = [
        pmis, name, office_id, date, prize, sn, remarks, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_decoration/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis, name, office_id, date, prize, sn, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_decoration SET pmis=?, name=?, office_id=?, date=?, prize=?, sn=?, remarks=?, updated_by=? WHERE id=?`;
    const values = [
        pmis, name, office_id, date, prize, sn, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_decoration/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM emp_decoration WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.post('/add_punishment', async (req, res) => {

    const {
        pmis, office_id, type, sn, date, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_punishment (
        pmis, office_id, type, sn, date, remarks, created_by
    ) VALUES (?)`;

    const values = [
        pmis, office_id, type, sn, date, remarks, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_punishment/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis, office_id, type, sn, date, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_punishment SET pmis=?, office_id=?, type=?, sn=?, date=?, remarks=?, updated_by=? WHERE id=?`;
    const values = [
        pmis, office_id, type, sn, date, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_punishment/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM emp_punishment WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.post('/add_jd', async (req, res) => {

    const {
        pmis,rank_id, group_id, job_done_id, office_id, date, deputation_id, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_jd (
        pmis,rank_id, group_id, job_done_id, office_id, date, deputation_id, remarks, created_by
    ) VALUES (?)`;

    const values = [
        pmis,rank_id, group_id, job_done_id, office_id, date, deputation_id, remarks, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_jd/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis,rank_id, group_id, job_done_id, office_id, date, deputation_id, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_jd SET pmis=?,rank_id=?, group_id=?, job_done_id=?, office_id=?, date=?, deputation_id=?, remarks=?, updated_by=? WHERE id=?`;
    const values = [
        pmis,rank_id, group_id, job_done_id, office_id, date, deputation_id, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_jd/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM emp_jd WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.post('/add_in_change', async (req, res) => {

    const {
        pmis, office_id, date, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_internal_change (
        pmis, office_id, date, remarks, created_by
    ) VALUES (?)`;

    const values = [
        pmis, office_id, date, remarks, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_in_change/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis, office_id, date, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_internal_change SET pmis=?, office_id=?, date=?, remarks=?, updated_by=? WHERE id=?`;
    const values = [
        pmis, office_id, date, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_in_change/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM emp_internal_change WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.post('/add_punishment', async (req, res) => {

    const {
        pmis, office_id, date, remarks
    } = req.body;

    const created_by = 1; // Adjust this to dynamically handle creator if needed

    const sql = `INSERT INTO emp_internal_change (
        pmis, office_id, date, remarks, created_by
    ) VALUES (?)`;

    const values = [
        pmis, office_id, date, remarks, created_by,
    ];

    try {
        const result = await query(sql, [values]);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
});

router.put('/update_punishment/:id', async (req, res) => {
    const id=req.params.id;    
    const {
        pmis, office_id, date, remarks
    } = req.body;
    const updated_by = 1;
    const sql = `UPDATE emp_internal_change SET pmis=?, office_id=?, date=?, remarks=?, updated_by=? WHERE id=?`;
    const values = [
        pmis, office_id, date, remarks, updated_by, id
    ];

    try {
        const result = await query(sql, values);
        return res.json({ Status: true, Result: result, pmis: pmis });
    } catch (err) {
        console.error('Database error', err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.delete('/delete_punishment/:id', async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const sql = `DELETE FROM emp_internal_change WHERE id=?`;
        const result = await query(sql, id);
        return res.json({ Status: true, Result: 'Record Deleted Successfully!' });
    } catch(err){
        console.error('Error Deleting Record:',err);
        return res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
})

router.get('/training_list/', async (req, res) => {
    // const sql = `SELECT * from emp_education`;
    const { pmis } = req.params;
    const sql = `SELECT * FROM trainings 
            `;
    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})


// const exportTableToWord = (tableData, res) => {
//     const content = fs.readFileSync(path.resolve(__dirname, 'template.docx'), 'binary');
//     const zip = new PizZip(content);
//     const doc = new Docxtemplater(zip);

//     const tableRows = tableData.map(row => {
//         return {
//             row: row.map(cell => ({ text: cell }))
//         };
//     });

//     doc.setData({
//         table: tableRows,
//     });

//     try {
//         doc.render();
//     } catch (error) {
//         console.error(error);
//     }

//     const buf = doc.getZip().generate({ type: 'nodebuffer' });
//     fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);
//     res.download('output.docx');
// };


export { router as employeeRouter }