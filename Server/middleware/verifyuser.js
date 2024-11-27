import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    let token = null;

    // Check for token in cookies
    if (req.cookies.token) {
        token = req.cookies.token;
        console.log('cookies')
    }

    // Check for token in Authorization header
    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1]; // Extract token from Bearer token
        console.log('header')
    }

    // If no token is provided
    if (!token) {
        console.log('no token')
        return res.status(403).json({ Status: false, Error: "No token provided." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ Status: false, Error: "Failed to authenticate token." });
        }

        // Save user details to request object
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;
        req.userOffice = decoded.office;

        // console.log('USER:', req.userId, 
        //             'ROLE:', req.userRole, 
        //             'USER:', req.userEmail, 
        //             'OFFICE:', req.userOffice
        //         )
        next(); // Proceed to the next middleware or route
    });
};

export default verifyToken;
