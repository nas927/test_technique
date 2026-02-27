const express = require('express');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const invoicesRoutes = require('./routes/invoices');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);

app.listen(3000, () => {
  console.log('Lynoria API running on port 3000');
});
