const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'devasahayam_shrine',
  password: 'admin123',
  port: 5432,
});

async function approveAllTestimonies() {
  try {
    console.log('Connecting to database...');
    
    // First, let's see what testimonies exist
    const allTestimonies = await pool.query('SELECT id, name, status, created_at FROM testimonies ORDER BY created_at DESC');
    console.log('\nCurrent testimonies in database:');
    console.log('ID | Name | Status | Created At');
    console.log('---|------|--------|------------');
    
    allTestimonies.rows.forEach(row => {
      console.log(`${row.id} | ${row.name} | ${row.status} | ${row.created_at}`);
    });
    
    // Count pending testimonies
    const pendingCount = allTestimonies.rows.filter(row => row.status === 'pending').length;
    console.log(`\nFound ${pendingCount} pending testimonies`);
    
    if (pendingCount > 0) {
      // Approve all pending testimonies
      const result = await pool.query(
        "UPDATE testimonies SET status = 'approved' WHERE status = 'pending' RETURNING id, name"
      );
      
      console.log(`\nApproved ${result.rows.length} testimonies:`);
      result.rows.forEach(row => {
        console.log(`- ${row.name} (ID: ${row.id})`);
      });
    } else {
      console.log('\nNo pending testimonies to approve.');
    }
    
    console.log('\nDone!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

approveAllTestimonies();