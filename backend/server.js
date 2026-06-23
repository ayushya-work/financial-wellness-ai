const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const payslipRoutes = require('./routes/payslip');
const payrollRoutes = require('./routes/payroll');
const aiRoutes = require('./routes/ai');
const checklistRoutes = require('./routes/checklist');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/payslip', payslipRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/checklist', checklistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

