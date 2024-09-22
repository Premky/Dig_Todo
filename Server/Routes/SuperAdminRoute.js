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


const router = express.Router()

router.post('/login', (req, res) => {


    // const sql = "SELECT * from users WHERE username=? and password=?";
    const { username, password } = req.body;

    const sql = `SELECT DISTINCT u.*, ut.ut_name AS usertype, o.office_name AS office_name, b.branch_name AS branch_name, emp.*
            FROM users u
            INNER JOIN usertypes ut ON u.usertype = ut.utid
            INNER JOIN office o ON u.office_id = o.o_id
            INNER JOIN branch b ON u.branch_id = b.bid
            LEFT JOIN employee emp ON u.emp_id=emp.emp_id
            INNER JOIN office_branch ob ON u.office_id = ob.office_id AND u.branch_id = ob.branch_id
            WHERE u.username = ?;`;

    con.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("Error executing login query:", err);
            return res.status(500).json({ loginStatus: false, Error: "Database error" });
        }

        if (result.length > 0) {
            const user = result[0];
            const username = result[0].username;
            const usertype = result[0].usertype;
            // console.log(result[0].id)

            const token = jwt.sign({
                role: usertype,
                email: username,
                office: result[0].office_id,
                id: result[0].id
            },
                "jwt_prem_ko_secret_key",
                { expiresIn: '2d' }
            );
            // console.log(result[0].office)

            res.cookie('token', token)
            return res.json({
                loginStatus: true,
                username: username,
                usertype: usertype,
                office: user.name,
                office_id: result[0].office_id,
                uid: user.id
            })
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" })
        }
    })

})

//Search PMIS
router.get('/search_pmis', (req, res) => {
    const pmis = req.query.pmis;

    const handleResponse = (err, result, errorMsg) => {
        if (err) {
            return res.json({ Status: false, Error: errorMsg });
        }
        if (result && result.length > 0) {
            return res.json({ Status: true, Result: result });
        } else {
            return res.json({ Status: false, Error: "No records found" });
        }
    };

    // Check in users table
    const chk_usr_sql = `SELECT * FROM users WHERE username=?`;
    con.query(chk_usr_sql, [pmis], (err, result) => {
        if (err) {
            return handleResponse(err, null, "chk usr Query Error");
        }

        if (result && result.length > 0) {
            return handleResponse(null, result, "");
        } else {
            // Check in employee table if not found in users table
            const sql = `SELECT * FROM employee WHERE pmis = ?`;
            con.query(sql, [pmis], (err, result) => {
                if (err || (result && result.length > 0)) {
                    return handleResponse(err, result, "Query Error");
                } else {
                    // Check in emp_leave table if not found in employee table
                    const leave_sql = `SELECT * FROM emp_leave WHERE pmis = ?`
                    con.query(leave_sql, [pmis], (err, leave_result) => {
                        return handleResponse(err, leave_result, "Query Error");
                    });
                }
            });
        }
    });
});


//For usertypes
router.get('/usertypes', (req, res) => {
    // console.log("Usertype")
    const sql = "SELECT * FROM usertypes";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Qeury Error" })
        return res.json({ Status: true, Result: result })
    })
})

//Fetch Offices
router.get('/offices', (req, res) => {
    // console.log("Office")
    const sql = `SELECT DISTINCT o.*,s.*,d.*,c.*, ho.office_name AS headoffice_name
    FROM 
    office o
    JOIN state s ON o.state_id = s.state_id
    JOIN district d ON o.district_id = d.did
    JOIN city c ON o.city_id = c.cid
    LEFT JOIN office ho ON o.headoffice = ho.o_id
    `;

    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//Add Offices
router.post('/add_office', (req, res) => {
    const sql = `INSERT INTO office(office_name, state_id, district_id, city_id, email, contact, headoffice, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        req.body.name,
        req.body.state_id,
        req.body.district,
        req.body.city,
        req.body.email,
        req.body.contact,
        req.body.headoffice,
        req.body.created_by
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding office:", err);
            return res.json({ Status: false, Error: err });
        }
        console.log("Office added successfully.");
        return res.json({ Status: true });
    });
});


//update_office
router.put('/update_offices/:id', (req, res) => {
    const id = req.params.id;

    const sql = `UPDATE office set office_name=?, state_id=?, district_id=?, city_id=?, 
                email=?, contact=?, headoffice=?, created_by=? WHERE o_id=? `;
    const values = [
        req.body.name,
        req.body.state_id,
        req.body.district,
        req.body.city,
        req.body.email,
        req.body.contact,
        req.body.headoffice,
        req.body.created_by,
        id
    ]
    console.log(values)
    con.query(sql, [...values, req.params.id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

//Add Office_Branch
router.post('/add_officebranch', (req, res) => {
    const sql = `INSERT INTO office_branch(branch_id, office_id, branch_contact, branch_email, created_by) VALUES(?,?,?,?,?)`;
    console.log(req.body)
    const values = [
        req.body.branch_id,
        req.body.office_id,
        req.body.contact,
        req.body.email,        
        req.body.created_by
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding office:", err);
            return res.json({ Status: false, Error: err });
        }
        console.log("Office Branch Link added successfully.");
        return res.json({ Status: true });
    });
});

//Fetch office_branch
router.get('/officebranch', (req, res) => {
    // console.log("Office")
    const sql = `SELECT DISTINCT ob.*, o.office_name, b.branch_name
                FROM 
                office_branch ob
                JOIN branch b ON ob.branch_id = b.bid
                JOIN office o ON ob.office_id = o.o_id                
                `;

    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/officebranch/:id', (req, res) => {
    // console.log(req.params.id)
    const obid=req.params.id
    const sql = `SELECT DISTINCT ob.*, o.office_name, b.branch_name
                FROM 
                office_branch ob
                JOIN branch b ON ob.branch_id = b.bid
                JOIN office o ON ob.office_id = o.o_id
                WHERE office_id=?
                `;

    con.query(sql,[obid], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//update_office_branch
router.put('/update_officebranch/:id', (req, res) => {
    const id = req.params.id;

    const sql = `UPDATE office_branch SET branch_id=?,office_id=?,branch_contact=?,branch_email=?,created_by=? WHERE bid=?; `;
    const values = [
        req.body.branch_id,
        req.body.office_id,
        req.body.contact,
        req.body.email,        
        req.body.created_by,
        id
    ]
    console.log(req.body)
    con.query(sql, [...values, req.params.id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

//Fetch Provinces, Districts, Cities
router.get('/states', (req, res) => {
    const sql = "SELECT * FROM state";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/districts/:id', (req, res) => {
    const id = req.params.id;    
    const sql = "SELECT * FROM district WHERE state_id=?";
    con.query(sql, id, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/local_level/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM city WHERE district_id=?"
    con.query(sql, id, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})



//Add Branch
router.post('/add_branches',  (req, res) => {
    const sql = "INSERT INTO branch(branch_name, created_by) VALUES(?)";
    const values = [
        req.body.branch_name,
        req.body.created_by,
    ]

    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error",err })
        return res.json({ Status: true })
    })
})

//Update Branch
router.put('/update_branches/:id', (req, res) => {
    const id = req.params.id;

    const sql = `UPDATE branch set branch_name=?, created_by=? WHERE bid=?`;
    const values = [
        req.body.branch_name,
        req.body.created_by,
        id
    ]
    con.query(sql, [...values, req.params.id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

//Fetch Branches
router.get('/branches', (req, res) => {
    // console.log("Branches")
    const sql = "SELECT * FROM branch";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//Fetch Users
router.get('/users', (req, res) => {
    // "SELECT * FROM users";
    // const uid=localStorage.getItem(uid)
    const sql =
        `SELECT u.*, ut.ut_name AS usertype, o.office_name AS office_name, b.branch_name, o.o_id as office_id
        FROM users u
        JOIN usertypes ut ON u.usertype = ut.utid
        INNER JOIN office o ON u.office_id = o.o_id
        INNER JOIN branch b ON u.branch_id = b.bid
        `;
    // INNER JOIN office_branch ob ON u.branch=ob.bid
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

// Fetch Users
router.get('/employees', (req, res) => {
    const sql =
        `SELECT * FROM employee`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})



// POST route to add or update a user
router.post('/add_user', async (req, res) => {
    const { name, username, password, usertype, office, branch, created_by, emp_id } = req.body;
    console.log(req.body);
    try {
        // Check if the user already exists by username
        const existingUser = await getUserByUsername(username);

        if (existingUser) {
            // User exists, update their details            
            const hashedPassword = await bcrypt.hash(password.toString(), 11);
            const updateValues = [name, username, hashedPassword, usertype, office, branch, username];
            console.log('update', updateValues)
            const updateSql = `UPDATE users SET user_name=?, username=?, password=?, usertype=?, office_id=?, branch_id=? WHERE username=?`;

            con.query(updateSql, updateValues, (err, result) => {
                if (err) {
                    console.error("Error updating user:", err);
                    return res.status(500).json({ Status: false, Error: "Database error" });
                }
                return res.json({ Status: true, Message: "User updated successfully" });
            });
        } else {
            // User does not exist, insert a new user
            const hashedPassword = await bcrypt.hash(password.toString(), 11);
            const insertValues = [name, username, hashedPassword, usertype, office, branch];
            const insertSql = `INSERT INTO users (user_name, username, password, usertype, office_id, branch_id) VALUES (?)`;

            con.query(insertSql, [insertValues], (err, result) => {
                if (err) {
                    console.error("Error adding user:", err);
                    return res.status(500).json({ Status: false, Error: "Database error" });
                }
                return res.json({ Status: true, Message: "User added successfully" });
            });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ Status: false, Error: "Internal server error" });
    }
});

// Helper function to fetch user by username
const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const selectSql = `SELECT * FROM users WHERE username=?`;
        con.query(selectSql, [username], (err, rows) => {
            if (err) {
                console.error("Error fetching user:", err);
                return reject(err);
            }
            if (rows.length > 0) {
                return resolve(rows[0]);
            }
            return resolve(null);
        });
    });
};


//Edit User:
router.get('/edit_user/:id', (req, res) => {
    // "SELECT * FROM users";
    const uid = req.params.id;

    const sql =
        `SELECT u.user_name, username, usertype, office, branch_id, created_by, ut.name AS usertype, o.name AS office_name, b.branch_name, o.id as office_id
        FROM users u
        JOIN usertypes ut ON u.usertype = ut.id
        INNER JOIN office o ON u.office = o.id
        INNER JOIN branch b ON u.branch_id = b.bid
        WHERE u.id=?
        `;
    con.query(sql, uid, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, EditResult: result })
    })
})

router.put('/edit_user/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee SET user_name=?, username=?, password=?, usertype=?, office=?, branch_id=?, created_by=? WHERE id=?`;

    bcrypt.hash(req.body.password.toString(), 11, (err, hash) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });

        const values = [
            req.body.name,
            req.body.username,
            hash,
            req.body.usertype,
            req.body.office,
            req.body.branch,
            req.body.created_by
        ];

        console.log(values);

        con.query(sql, values, (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query Error" });
            return res.json({ Status: true });
        });
    });
});


//delete user
router.delete('/delete_user:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    const sql = "DELETE FROM users WHERE id=?"
    con.query(sql, id, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})



export { router as superAdminRouter }