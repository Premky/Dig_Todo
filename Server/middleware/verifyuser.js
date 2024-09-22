import jwt from 'jsonwebtoken'
const secret = 'jwt_prem_ko_secret_key'

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];

    if (!token) return res.status(403).json({ Status: false, Error: "No token provided." });

    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(500).json({ Status: false, Error: "Failed to authenticate token." });
        
        // Save user ID and other details to request for use in other routes
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;
        req.userOffice = decoded.office;
        // console.log("office",req.userOffice)
        next();
    });
};

export default verifyToken;
