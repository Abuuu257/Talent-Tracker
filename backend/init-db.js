const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function init() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        const dbName = process.env.DB_NAME || 'talent_tracker';
        console.log(`Connecting to MySQL...`);

        // Ensure database exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.query(`USE \`${dbName}\`;`);

        console.log(`Reading schema.sql...`);
        const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

        console.log(`Executing schema...`);
        // We filter out any existing CREATE DATABASE/USE commands in the file for safety
        const sqlCleaned = sql.replace(/CREATE DATABASE.*?;/gi, '').replace(/USE.*?;/gi, '');

        await connection.query(sqlCleaned);
        console.log('Database schema created.');

        // Create default admin if not exists
        const [existingAdmin] = await connection.query('SELECT * FROM users WHERE role = "federation"');
        if (existingAdmin.length === 0) {
            console.log('Creating default federation admin...');
            const bcrypt = require('bcrypt');
            const hashedPw = await bcrypt.hash('admin123', 10);
            await connection.query(
                'INSERT INTO users (email, password_hash, username, role) VALUES (?, ?, ?, ?)',
                ['federation@talenttracker.com', hashedPw, 'admin', 'federation']
            );
            console.log('Admin account created: admin / admin123');
        }

        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await connection.end();
    }
}

init();
