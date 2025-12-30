const db = require('./db');

async function checkColumn() {
    try {
        console.log('Checking if admin_notes column exists...');

        // Check athletes table
        const [athleteCols] = await db.query(
            "SHOW COLUMNS FROM athletes LIKE 'admin_notes'"
        );
        console.log('Athletes table admin_notes column:', athleteCols.length > 0 ? 'EXISTS' : 'DOES NOT EXIST');

        // Check coaches table
        const [coachCols] = await db.query(
            "SHOW COLUMNS FROM coaches LIKE 'admin_notes'"
        );
        console.log('Coaches table admin_notes column:', coachCols.length > 0 ? 'EXISTS' : 'DOES NOT EXIST');

        // Try to select from athletes
        const [athletes] = await db.query('SELECT user_id, admin_notes FROM athletes LIMIT 1');
        console.log('Sample athlete:', athletes[0]);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkColumn();
