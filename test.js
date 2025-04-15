import bcrypt from 'bcryptjs';

const password = 'admin123'; // Example password to hash
bcrypt.hash(password, 10).then(console.log);
