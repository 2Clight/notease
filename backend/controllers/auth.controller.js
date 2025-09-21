import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';
import tenantModel from '../models/tenant.model.js';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "35m"
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })
    return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
}

const setCookies = (res, accessToken, refreshToken) => {
    
console.log("Access token:", accessToken);
console.log("Refresh token:", refreshToken);

    res.cookie('access_token', accessToken, {
        httpOnly: true, //prevent xss attacks
        secure: true, 
        sameSite: 'lax', //prevent CSRF attacks, cross-site request forgery'
        maxAge: 35 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true, //prevent xss attacks
        secure: true, 
        sameSite: 'strict', //prevent CSRF attacks, cross-site request forgery'
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds,
    });
}

export const signup = async (req, res) => {
    const { email, name, password, tenant } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({ email, name, password, tenant }); //create a new user instance
        //pre save middleware will hash the password before saving

        await user.save();
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);
        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenant: user.tenant
            }, message: "User created successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
         console.log("User password hash:", user.password);
console.log("Entered password:", password);
const isMatch = await user.comparePassword(password);
console.log("Password match?", isMatch);

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);
            res.status(200).json({
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }, message: "Login successful"
            });
        } else {
            res.status(401).json({ message: "Invalid email or password", id : user._id });
        }
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ message: error.message });
        
    }
   
}
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); //verify the refresh token to get the user ID
            await redis.del(`refresh_token:${decode.userId}`);
        }

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//used to refresh access token
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" })
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '35m' });
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 35 * 60 * 1000 // 35 minutes
        });
        res.status(200).json({ accessToken, message: "Tokens refreshed successfully" });
    } catch (error) {
        console.log("error in refresh token controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

// export const getProfile = async (req, res) => {
//     try {
//         const userId = req.userId; // Set in auth.middleware.js
//         const user = await User.findById(userId).select('-password'); // Exclude password field
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json({ user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }