import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.route.js'; 
import { connectDB } from './lib/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import noteRoutes from './routes/note.route.js';
import tenantsRouter from './routes/tenant.route.js';

dotenv.config();



const app = express();
app.use(cors({
      origin: 'https://notease-7ou9.vercel.app',
        
      credentials: true
}));
app.use(bodyParser.json());




const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); //middleware to parse JSON request bodies
app.use(cookieParser()); //middleware to parse cookies
// app.get('/', (req, res) => {
//   res.send('Welcome to the Tenant backend!');
// });
app.use("/api/auth", authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tenants', tenantsRouter);


// Global error handling middleware


app.listen(PORT, () => {
    console.log("Server is running http://localhost:" + PORT);

    connectDB();
});