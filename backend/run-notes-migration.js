const db = require('./db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('Creating coach_notes table...');

        // Read the SQL file
        const sqlFile = path.join(__dirname, 'add-coach-notes-table.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute the SQL
        await db.query(sql);

        console.log('✅ coach_notes table created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
