#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');

async function setupDatabase() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('🔧 Setting up database schema...');
    
    // Create metrics table
    await sql`
      CREATE TABLE IF NOT EXISTS axiom_metrics (
        id VARCHAR(50) PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        value DECIMAL(12,4) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        detail VARCHAR(200) NOT NULL,
        recorded_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    // Insert sample metrics
    await sql`
      INSERT INTO axiom_metrics (id, label, value, unit, detail) VALUES
      ('commits', 'Total Commits', 1247, '', 'Across all repositories'),
      ('projects', 'Active Projects', 12, '', 'Currently maintained'),
      ('languages', 'Languages', 8, '', 'Proficient in'),
      ('experience', 'Years Experience', 5, 'years', 'Professional development')
      ON CONFLICT (id) DO UPDATE SET
        value = EXCLUDED.value,
        recorded_at = NOW()
    `;
    
    console.log('✅ Database schema created successfully!');
    console.log('📊 Sample metrics inserted');
    
    // Test query
    const metrics = await sql`SELECT * FROM axiom_metrics ORDER BY recorded_at DESC`;
    console.log(`🎯 Found ${metrics.length} metrics in database`);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
