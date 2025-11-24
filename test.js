import bcrypt from 'bcryptjs';

const password = 'admin12345'; // Example password to hash
bcrypt.hash(password, 10).then(console.log);
