const db = require('./db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('Running migration to add admin_notes column...');

        // Read the SQL file
        const sqlFile = path.join(__dirname, 'add-admin-notes.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            console.log('Executing:', statement.trim().substring(0, 50) + '...');
            await db.query(statement);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
