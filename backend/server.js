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
  origin: 'http://localhost:5173', // your frontend URL
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
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "/Frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'Frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}


app.listen(PORT, () => {
    console.log("Server is running http://localhost:" + PORT);

    connectDB();
});