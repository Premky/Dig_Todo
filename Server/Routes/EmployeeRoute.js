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
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router()
const fy = new NepaliDate().format('YYYY'); //Support for filter
const fy_date= fy+'-4-1'
// console.log(fy_date)

router.post('/add_employee', async(req, res)=>{
    // const {employeeData, addressData} = req.body;    
    const employeeData = req.body.employee;
    const addressData = req.body.address;    
    const insertAddress = `INSERT INTO emp_address(province, district, city, ward, is_permanent) VALUES(?)`;
    const addressValues = [
        addressData.state,
        addressData.district, 
        addressData.city, 
        addressData.ward,
        addressData.is_permanent
    ];
    console.log(addressValues)
    con.beginTransaction(err=>{
        if(err) return res.json({Status:false, Error:"Transaction Error"});

        con.query(insertAddress, [addressValues], (err, result)=>{
            if(err){
                return con.rollback(()=>{
                    res.json({Status:false, Error:"Address Insert Error"});
                });
            }

            const addressId = result.insertId; //Get the inserted address id
            console.log("Address:", addressId)
            const employeeValues = [
                employeeData.docr_no, 
                employeeData.personal_no, 
                employeeData.pmis, 
                employeeData.symbol_no, 
                employeeData.rank, 
                employeeData.name_en, 
                employeeData.name_np, 
                employeeData.dob,
                addressId,
                employeeData.recruit_date, 
                employeeData.recruit_rank,
                employeeData.gender,
                employeeData.qualification_id,                
                employeeData.contact_no,
                employeeData.deputation,
                employeeData.working, 
                employeeData.in_working,
                employeeData.family,
                employeeData.created_by
            ]
            
            console.log(employeeValues)
            const inserEmployeeSql = `INSERT INTO employee(docr_no, personal_no, pmis_no, symbol_no, rank, name_en, name_np, dob, address, recruit_date, recruit_rank, gender,
            qualification_id, contact_no, deputation, working, in_working, family, created_by) VALUES(?)`;

            con.query(inserEmployeeSql, [employeeValues], (err, result)=>{
                if(err){
                    return con.rollback(()=>{
                        res.json({Status:false, Error:"Employee Insert Error"});
                    });
                };

                con.commit(err=>{
                    if(err){
                        return con.rollback(()=>{
                            res.json({Status:false, Error:"Commit Error"});
                        });
                    }
                    res.json({Status:true});
                });
            });
        });
    });
});

export {router as employeeRouter}