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
const fy_date = fy + '-4-1'
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

router.get('/currentofficerleave', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    const sql = `SELECT el.*, r.rank_en, r.rank_np, e.name_en, e.name_np
                FROM emp_leave el
                JOIN ranks r ON el.emp_rank = r.rank_id 
                JOIN employee e ON el.emp_id = e.emp_id
    
                WHERE el.office_id=? AND el.present_day >= '' AND el.is_chief=1 ORDER BY leave_end_date `
    con.query(sql, [officeid, currentdate], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/ranks', (req, res) => {
    const sql = `SELECT * from ranks`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})


router.get('/employee', async (req, res) => {
    const sql = `SELECT * from employee`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/employee/:pmis', async (req, res) => {
    const pmis = req.params.pmis;

    const sql = `SELECT * from employee WHERE pmis=?  `;
    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/blood', async (req, res) => {
    const sql = `SELECT * from bloodgroups`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})


//Qualification Page Start
router.get('/edu_level', async (req, res) => {
    const sql = `SELECT * from edu_level`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/edu_faculty', async (req, res) => {
    const sql = `SELECT * from edu_faculty`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/qualification/:pmis', async (req, res) => {
    // const sql = `SELECT * from emp_education`;
    const { pmis } = req.params;

    const sql = `SELECT q.*, l.*, f.*
       	FROM 
           emp_education q
        LEFT JOIN
            edu_level l ON q.level = l.edu_lvl_id
        LEFT JOIN
        	edu_faculty f ON q.faculty = f.edu_fac_id
        WHERE q.pmis = ?
            `;

    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/training/:pmis', async (req, res) => {
    // const sql = `SELECT * from emp_education`;
    const { pmis } = req.params;
    const sql = `SELECT * FROM emp_training WHERE pmis=?
            `;
    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/award/:pmis', async (req, res) => {
    // const sql = `SELECT * from emp_education`;
    const { pmis } = req.params;
    const sql = `SELECT a.*, o.office_name
       	FROM 
           emp_award a
        LEFT JOIN
            office o ON a.office_id = o.o_id
        WHERE a.pmis = ?`;

    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/decoration/:pmis', async (req, res) => {
    // const sql = `SELECT * from emp_education`;
    const { pmis } = req.params;
    const sql = `SELECT a.*, o.office_name
       	FROM 
           emp_decoration a
        LEFT JOIN
            office o ON a.office_id = o.o_id
        WHERE a.pmis = ?`;

    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/punishment/:pmis', async (req, res) => {
    // const sql = `SELECT * from emp_education`;
    const { pmis } = req.params;
    const sql = `SELECT a.*, o.office_name
       	FROM 
           emp_punishment a
        LEFT JOIN
            office o ON a.office_id = o.o_id
        WHERE a.pmis = ?`;

    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/jd/:pmis', async (req, res) => {
    // const sql = `SELECT * from emp_education`;
    const { pmis } = req.params;
    const sql = `
    SELECT 
        jd.*, 
        o.office_name, 
        o2.office_name AS deputation,
        r.rank_en, 
        r.rank_np, 
        g.name AS group_name, 
        g.name_en AS group_name_en,
        j.name AS job_name, 
        j.name_en AS job_name_en
    FROM 
        emp_jd jd        
    LEFT JOIN 
        ranks r ON jd.rank_id = r.rank_id
    LEFT JOIN 
        emp_group g ON jd.group_id = g.id
    LEFT JOIN 
        emp_jd_jobs j ON jd.id = j.id 
    LEFT JOIN 
        office o ON jd.office_id = o.o_id
    LEFT JOIN 
        office o2 ON jd.deputation_id = o2.o_id
    WHERE 
        jd.pmis = ?;
`;



    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})
//Qualification Page End
//Support for JD Page 
router.get('/jobs', async (req, res) => {
    const sql = `SELECT * from emp_jd_jobs`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/emp_groups', async (req, res) => {
    const sql = `SELECT * from emp_group`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/in_change/:pmis', async (req, res) => {
    const { pmis } = req.params;
    const sql = `SELECT a.*, o.office_name
       	FROM 
           emp_internal_change a
        LEFT JOIN
            office o ON a.office_id = o.o_id
        WHERE a.pmis = ?`;

    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/fetch_emp/:pmis', async (req, res) => {
    const { pmis } = req.params;    
    const sql = `SELECT e.*, jd.*, r.*
                FROM 
                    employee e     
                LEFT JOIN (
                        SELECT jd.* FROM emp_jd jd
                        INNER JOIN(
                        SELECT pmis, MAX(date) AS max_date
                            FROM emp_jd
                            GROUP BY pmis
                        ) AS latest ON jd.pmis = latest.pmis AND jd.date = latest.max_date
                    ) AS jd ON e.pmis = jd.pmis 
                LEFT JOIN 
                    ranks r ON jd.rank_id = r.rank_id                   
                WHERE e.pmis = ?`;
                // SELECT e.*, r.rank_np AS rank
                // FROM employee e
                // JOIN ranks r ON e.rank = r.rank_id                
                // WHERE pmis = ?

    con.query(sql, pmis, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})
//Support for JD Page End


//Tango Support Start
router.get('/vehicles', async (req, res) => {
    const sql = `SELECT * FROM tango_vehicles`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/punishments', async (req, res) => {
    const sql = `SELECT * FROM tango_punishment`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})
//Tango Support END

export { router as displayRouter }