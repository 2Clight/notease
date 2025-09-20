import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
   try {
    const accessToken = req.cookies.access_token;

    if(!accessToken){
        return res.status(401).json({message: "Access Denied. No token provided"});
    }
   try {
     const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); // Verify the token
     const user = await User.findById(decoded.userId).select('-password'); // Fetch user details from DB excluding password
     
     if (!user) {
         return res.status(401).json({ message: 'Unauthorized. User not found' });
     }
     req.user = user;
     next();
 
   } catch (error) {
       if (error.name === 'TokenExpiredError') {
           return res.status(401).json({ message: 'unauthorized - Access token expired'});
       }
       throw error;
   }
   } catch (error) {
       console.log("error in ProtectRoute middleware", error.message);
       res.status(500).json({ message: 'Error verifying token', error });
   }
};


export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden - Admins only' });
    }
};