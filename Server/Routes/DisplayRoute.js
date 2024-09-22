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

const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date= fy+'-4-1'
const currentdate = new NepaliDate().format('YYYY-MM-DD'); //Support for filter
// console.log(fy)


const router = express.Router()


router.get('/leavetypes', (req, res) => {
    const sql = "SELECT * FROM leave_type";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//Search PMIS
router.get('/search_pmis', (req, res) => {
    const pmis = req.query.pmis;
    // console.log(pmis)
    const handleResponse = (err, result, errorMsg) => {
        if (err) {
            return res.json({ Status: false, Error: errorMsg });
        }
        if (result && result.length > 0) {
            return res.json({ Status: true, Result: result });
        } else {
            return res.json({ Status: false, Error: "No records found" });
        }
    }

    // const sql = `SELECT e.*, r.rank_np AS rank, o.office_name 
    //             FROM employee e
    //             JOIN ranks r ON e.rank = r.rank_id
    //             JOIN office o ON e.working = o.o_id
    //             WHERE pmis = ?`;
    const sql = `SELECT e.*, r.rank_np AS rank
                FROM employee e
                JOIN ranks r ON e.rank = r.rank_id                
                WHERE pmis = ?`;
        con.query(sql, [pmis], (err, result) => {
            return handleResponse(err, result, "Query Error");
        });
});



router.get('/news', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    // console.log(officeid, );
    const sql = "SELECT * FROM news WHERE office_id=? ORDER BY date";
    con.query(sql, officeid, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/currentofficerleave', verifyToken, (req,res)=>{
    const officeid = req.userOffice;    
    const sql =`SELECT el.*, r.rank_en, r.rank_np, e.name_en, e.name_np
                FROM emp_leave el
                JOIN ranks r ON el.emp_rank = r.rank_id 
                JOIN employee e ON el.emp_id = e.emp_id
    
                WHERE el.office_id=? AND el.present_day >= '' AND el.is_chief=1 ORDER BY leave_end_date `
    con.query(sql, [officeid, currentdate ], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/ranks',(req,res)=>{
    const sql = `SELECT * from ranks`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})



export { router as displayRouter }