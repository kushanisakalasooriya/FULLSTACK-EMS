import express from 'express';
import cors from 'cors';
import "dotenv/config";
import multer from 'multer';
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js';
import employeesRouter from './routes/employeeRoutes.js';
import profileRouter from './routes/profileRoutes.js';
import attendanceRouter from './routes/attendanceRoutes.js';
import leaveRouter from './routes/leaveRoutes.js';
import payslipsRouter from './routes/payslipRouts.js';
import dashboardRouter from './routes/dashboardRoutes.js';

const app =express();
const PORT = process.env.PORT || 4000;


//Middlweare
app.use(cors());
app.use(express.json());
app.use(multer().none());

//Route
app.get('/', (req, res) => { res.send('server is running')});
app.use('/api/auth', authRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/profile', profileRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/payslips', payslipsRouter);
app.use('/api/dashboard', dashboardRouter);

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});