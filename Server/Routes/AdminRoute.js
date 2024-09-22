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
const fy_date = fy + '-4-1'
// console.log(fy_date)

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT DISTINCT u.*, ut.ut_name AS usertype, o.office_name AS office_name, b.branch_name AS branch_name
                 FROM users u
                 LEFT JOIN usertypes ut ON u.usertype = ut.utid
                 LEFT JOIN office o ON u.office_id = o.o_id
                 LEFT JOIN branch b ON u.branch_id = b.bid
                 LEFT JOIN office_branch ob ON u.office_id = ob.office_id AND u.branch_id = ob.branch_id
                 WHERE u.username = ?;`;

    con.query(sql, [username], (err, result) => {
        if (err) {
            console.error("Error executing login query:", err);
            return res.status(500).json({ loginStatus: false, Error: "Database error" });
        }

        if (result.length > 0) {
            const user = result[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error("Error comparing passwords:", err);
                    return res.status(500).json({ loginStatus: false, Error: "Password comparison error" });
                }

                if (isMatch) {
                    const token = jwt.sign({
                        role: user.usertype,
                        email: user.username,
                        office: user.office_id,
                        id: user.uid
                    }, "jwt_prem_ko_secret_key", { expiresIn: '2d' });

                    res.cookie('token', token);

                    return res.json({
                        loginStatus: true,
                        username: user.username,
                        usertype: user.usertype,
                        office: user.office_name,
                        office_id: user.office_id,
                        branch_id: user.branch_id,
                        uid: user.uid,
                        branch: user.branch_name
                    });
                } else {
                    return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
                }
            });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

router.get('/fetch_user_office/:user', (req, res) => {
    let user = req.params.user;
    // console.log(user)
    // const user_sql = "SELECT * FROM users WHERE username=?";
    const user_sql =
        `SELECT u.*, ut.ut_name AS usertype, o.*, b.*
        FROM users u
        INNER JOIN usertypes ut ON u.usertype = ut.utid
        INNER JOIN office o ON u.office_id = o.o_id
        INNER JOIN branch b ON u.branch_id = b.bid
        WHERE u.username  =? `;

    con.query(user_sql, [user], (usr_err, usr_result) => {
        if (usr_err) return res.json({ Error: "User Query Error" })
        return res.json({ Status: true, Result: usr_result })
        // console.log(usr_result)
    })
})

router.post('/add_programs', (req, res) => {
    // console.log('Request body:', req.body); 
    const sql = `INSERT INTO programs (date, time, program, venue, organizer, remarks, created_by, office_id, branch_id) VALUES(?)`;
    const values = [
        req.body.date,
        req.body.time,
        req.body.program,
        req.body.venue,
        req.body.organizer,
        req.body.remarks,
        req.body.user,
        req.body.office,
        req.body.branch
    ]
    // console.log(values)
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
})

router.put('/update_program/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
UPDATE programs
    SET 
    date=?, time=?, program=?, venue=?, organizer=?, remarks=?, created_by=?, office_id=?, branch_id=?
    WHERE pid=?
    `;
    const values = [
        req.body.date,
        req.body.time,
        req.body.program,
        req.body.venue,
        req.body.organizer,
        req.body.remarks,
        req.body.user,
        req.body.office,
        req.body.branch,
        id
    ];
    // console.log(values)
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
})

// router.get('/programs', (req, res) => {
//     // console.log(req.body)    
//     const sql = "SELECT * FROM programs ";
//     con.query(sql, (err, result) => {
//         if (err) return res.json({ Status: false, Error: "Query Error" })
//         return res.json({ Status: true, Result: result })
//     })
// })

router.get('/programs', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    const sql = "SELECT * FROM programs WHERE office_id=? ORDER BY -is_displayed, date, time";

    con.query(sql, officeid, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/programs/:id', (req, res) => {
    const id = req.params.id;
    // console.log(req.params.id)
    const sql = "SELECT * FROM programs WHERE office_id=? ORDER BY -is_displayed, date, time";
    con.query(sql, id, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.put('/hide_programs/:id', (req, res) => {
    const id = req.params.id;
    // console.log('hide is working')
    // Step 1: Retrieve the current value of is_displayed
    const selectSql = "SELECT is_displayed FROM programs WHERE pid = ?";

    con.query(selectSql, [id], (err, results) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });

        if (results.length === 0) return res.json({ Status: false, Error: "Program not found" });

        const currentStatus = results[0].is_displayed;
        const newStatus = currentStatus ? 0 : 1;  // Toggle between 1 (true) and 0 (false)

        // Step 2: Update the is_displayed value
        const updateSql = "UPDATE programs SET is_displayed = ? WHERE pid = ?";

        con.query(updateSql, [newStatus, id], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Update Error" });

            return res.json({ Status: true, Result: result });
        });
    });
});

router.get('/fetch_delete_program/:id', (req, res) => {
    const id = req.params.id;
    // console.log(req.params.id)
    const sql = "SELECT * FROM programs WHERE pid=?";
    con.query(sql, id, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.delete('/delete_programs/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    const sql = "DELETE FROM programs WHERE pid=?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/news', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    // console.log(officeid, );
    const sql = "SELECT * FROM news WHERE office_id=? ORDER BY date";
    con.query(sql, officeid, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add_news', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    const sql = `INSERT INTO news(date, title, news, created_by, office_id, branch_id) values(?)`;
    const values = [
        req.body.date,
        req.body.title,
        req.body.news,
        req.body.user,
        req.body.office_id,
        req.body.branch_id
    ]
    // console.log(values)
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
})

router.put('/update_news/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
    UPDATE news
    SET 
    date=?, title=?, news=?, created_by=?, office_id=?, branch_id=?
    WHERE news_id=?
    `;
    const values = [
        req.body.date,
        req.body.title,
        req.body.news,
        req.body.user,
        req.body.office_id,
        req.body.branch_id,
        id
    ];
    // console.log(values)
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
})

router.get('/fetch_delete_news/:id', (req, res) => {
    const id = req.params.id;
    // console.log(req.params.id)
    const sql = "SELECT * FROM news WHERE news_id=?";
    con.query(sql, id, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.delete('/delete_news/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    const sql = "DELETE FROM news WHERE news_id=?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/docurrentduty', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    const sql = "SELECT * FROM doduty WHERE office_id=? ORDER BY start_date, start_time, dutytype ASC LIMIT 3 ";
    con.query(sql, officeid, (err, result) => {
        // con.query(sql, (err, result)=>{
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
    // console.log(officeid)
})

router.get('/doduty', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    // console.log(officeid );
    // const sql = "SELECT * FROM doduty";
    const sql = "SELECT * FROM doduty WHERE office_id=? ORDER BY start_date, start_time, dutytype ";
    con.query(sql, officeid, (err, result) => {
        // con.query(sql, (err, result)=>{
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
    // console.log(officeid)
})

router.post('/add_doduty', (req, res) => {

    const sql = `INSERT INTO doduty(start_date, start_time, end_date, end_time,
                do_name, contact, dutytype, remarks, user_id, office_id,branch_id) values(?)`;
    const values = [
        req.body.start_date,
        req.body.start_time,
        req.body.end_date,
        req.body.end_time,
        req.body.name,
        req.body.contact,
        req.body.dutytype,
        req.body.remarks,
        req.body.user_id,
        req.body.office_id,
        req.body.branch_id,
    ]
    // console.log(values)
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
})

router.delete('/delete_doduty/:id', verifyToken, (req, res) => {
    const officeid = req.userOffice;
    const id = req.params.id;
    console.log(officeid, id)
    const sql = "DELETE FROM doduty WHERE doid=? AND office_id=?";
    con.query(sql, [id, officeid], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add_officer_leave', (req, res) => {
    const sql = `INSERT INTO emp_leave(leave_date, emp_id, pmis, emp_rank, emp_office,
    is_chief, leave_type, leave_days, leave_end_date, present_day,
    created_by,office_id, branch_id
    ) values(?)`;
    const values = [
        req.body.leave_date,
        req.body.emp_id,
        req.body.pmis,
        req.body.emp_rank,
        req.body.emp_office,
        req.body.is_chief,
        req.body.leave_type,
        req.body.leave_days,
        req.body.leave_end_date,
        req.body.present_day,
        req.body.created_by,
        req.body.office_id,
        req.body.branch_id,
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return (res.json({ Status: false, Error: "Query Error", err }), console.log("ram", err))
        return res.json({ Status: true })
    })
})

router.put('/update_officer_leave/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        UPDATE emp_leave
        SET leave_date = ?, emp_id = ?, pmis = ?, emp_rank = ?, emp_office = ?, 
            is_chief = ?, leave_type = ?, leave_days = ?, leave_end_date = ?, 
            present_day = ?, created_by = ?, office_id = ?, branch_id = ?
        WHERE l_id = ?
    `;

    const values = [
        req.body.leave_date,
        req.body.emp_id,
        req.body.pmis,
        req.body.emp_rank,
        req.body.emp_office,
        req.body.is_chief,
        req.body.leave_type,
        req.body.leave_days,
        req.body.leave_end_date,
        req.body.present_day,
        req.body.created_by,
        req.body.office_id,
        req.body.branch_id,
        id  // This is the l_id to match the row to be updated
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ Status: false, Error: "Query Error", err });
        }
        return res.json({ Status: true, Result: result });
    });
});


router.get('/office_leave/', verifyToken, (req, res) => {
    const office_id = req.userOffice;
    const pmis = req.query.pmis;

    // console.log(office_id)
    const sql = `SELECT * FROM emp_leave WHERE office_id=? AND pmis=? AND leave_date >= ${fy_date} 
                ORDER BY (CASE WHEN present_day IS Null OR present_day='' THEN 1
                    ELSE 2 
                END), leave_end_date `;
    con.query(sql, [office_id, pmis, fy_date], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/get_officer_leave/:id', verifyToken, (req, res) => {
    const office_id = req.userOffice;
    const emp_id = req.params.id;
    const sql = `SELECT * FROM emp_leave WHERE l_id=?`;
    con.query(sql, [emp_id, office_id, fy_date], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/all_officer_leave/', verifyToken, (req, res) => {
    const office_id = req.userOffice;

    const sql = `SELECT emp.*, pmis.name_np FROM 
                emp_leave emp 
                JOIN employee pmis ON emp.emp_id=pmis.emp_id
                WHERE emp.office_id = 1 AND emp.leave_date >= ? 
                ORDER BY (CASE WHEN emp.present_day IS Null OR emp.present_day='' THEN 1
                    ELSE 2 
                END),
                 emp.leave_end_date `;
    con.query(sql, [office_id, fy_date], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add_leave_count', (req, res) => {
    const sql = `INSERT INTO leavecount(igp,    aig,    dig,    ssp,    sp, dsp,    
                insp,   ssi,    si,     asi,    shc,    hc,     ahc,    pc,     poa, 
                date, created_by, 
                office_id, branch_id) values(?)`;
    const values = [
        req.body.igp, req.body.aigp, req.body.digp,
        req.body.ssp, req.body.sp, req.body.dsp,
        req.body.insp, req.body.ssi, req.body.si,
        req.body.asi, req.body.shc, req.body.hc,
        req.body.ahc, req.body.pc, req.body.poa,
        req.body.date, req.body.user_id, req.body.office_id, req.body.branch_id
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
    console.log(values)
})

router.get('/leave_count_self', verifyToken, (req, res) => {
    const office_id = req.userOffice;
    const todayNepaliDate = new NepaliDate().format('YYYY-MM-DD');
    // console.log(office_id, todayNepaliDate)
    const sql = "SELECT * FROM leavecount WHERE office_id=? AND date=? ORDER BY -created_at";
    con.query(sql, [office_id, todayNepaliDate], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/leave_count_office', verifyToken, (req, res) => {
    const office_id = req.userOffice;
    const todayNepaliDate = new NepaliDate().format('YYYY-MM-DD');
    // console.log('offid',office_id, todayNepaliDate)
    const sql =
        `SELECT * FROM 
            leavecount l
            JOIN office o ON l.office_id=o.o_id
            WHERE o.headoffice=? AND l.date=?`;
    con.query(sql, [office_id, todayNepaliDate], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        // console.log(result)
        return res.json({ Status: true, Result: result })
    })
})

router.post('/leave_count_office:date', verifyToken, (req, res) => {
    const office_id = req.userOffice;
    const todayNepaliDate = req.params.date;

    const sql =
        `SELECT l.*, o.office_name 
                    FROM leavecount l 
                    JOIN office o ON l.office_id=o.o_id
                    WHERE o.headoffice=? AND l.date=?`;
    con.query(sql, [office_id, todayNepaliDate], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//image upload (Logic)
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = 'Public/Uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now();
        const sanitizedFilename = sanitizeFilename(file.originalname);
        callback(null, `${uniqueSuffix}_${sanitizedFilename}`);
    }
});

const upload = multer({ storage: storage });

//end image upload



router.post('/add_do_notice', verifyToken, upload.single('image'), (req, res) => {
    try {
        const office_id = req.userOffice;
        const todayNepaliDate = req.body.date;

        const sql = `INSERT INTO do_notice(date, subject, remarks, notice_img, created_by, office_id, branch_id) VALUES(?)`;

        const imageUrl = req.file ? `${req.file.filename}` : null;  // Updated path
        const values = [
            req.body.date,
            req.body.subject,
            req.body.remarks,
            imageUrl,
            req.body.user_id,
            req.body.office_id,
            req.body.branch_id
        ];

        con.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Query Error:', err);
                return res.status(500).json({ Status: false, Error: "Query Error", Details: err.message });
            }
            return res.json({ Status: true, Result: result });
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        return res.status(500).json({ Status: false, Error: "Unexpected Error", Details: error.message });
    }
});

router.get('/uploaded_do_notice', verifyToken, (req, res) => {
    const office_id = req.userOffice;

    const sql = `SELECT do_notice.*, o.office_name 
                    FROM do_notice 
                    JOIN office o ON do_notice.office_id=o.o_id 
                    WHERE do_notice.office_id=?`;

    con.query(sql, [office_id], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error", Details: err.message });
        return res.json({ Status: true, Result: result });
    });
});

router.get('/display_do_notice', verifyToken, (req, res) => {
    const office_id = req.userOffice;
    // console.log(office_id)
    const sql = `SELECT do_notice.*, o.*
                    FROM do_notice 
                    JOIN office o ON do_notice.office_id=o.o_id 
                    WHERE do_notice.office_id=?`;

    con.query(sql, [office_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
});

router.delete('/delete_uploaded_notice/:id', verifyToken, (req, res) => {
    const office_id = req.userOffice;
    const id = req.params.id;

    const getFileSql = 'SELECT notice_img FROM do_notice WHERE donid=? AND office_id=?';
    con.query(getFileSql, [id, office_id], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.status(500).json({ Status: false, Error: "Query Error: " + err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ Status: false, Error: "Notice not found or you do not have permission to delete this notice." });
        }

        const noticeImg = result[0].notice_img;
        // const filePath = path.join(__dirname, '..', 'Public', 'Uploads', noticeImg);
        const filePath = path.join(__dirname, '..', 'Public', 'Uploads', noticeImg);

        const sql = 'DELETE FROM do_notice WHERE donid=? AND office_id=?';
        con.query(sql, [id, office_id], (err, deleteResult) => {
            if (err) {
                console.error('Query Error:', err);
                return res.status(500).json({ Status: false, Error: "Query Error: " + err.message });
            }
            if (deleteResult.affectedRows === 0) {
                return res.status(400).json({ Status: false, Error: "Notice not found or you do not have permission to delete this notice." });
            }
            // Delete the file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('File Deletion Error:', err);
                    return res.status(500).json({ Status: false, Error: "File Deletion Error: " + err.message });
                }
                return res.json({ Status: true, Result: deleteResult });
            });
        });
    });
});

export { router as adminRouter }