// Database Setup Script for Supabase
// Run this with: node setup_database.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Get service role key from environment or command line
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.argv[2];

if (!serviceRoleKey) {
  console.error('❌ Service role key is required!');
  console.log('Usage: node setup_database.js <service_role_key>');
  console.log('Or set VITE_SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabaseUrl = 'https://wymihmclkarfvjodzcyo.supabase.co';
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');

    // Read the SQL file
    const sqlContent = fs.readFileSync('database_setup.sql', 'utf8');

    console.log('📄 Executing database setup SQL...');

    // Execute the entire SQL file as one statement
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('❌ Error executing SQL:', error);
      
      // Try alternative approach - execute in chunks
      console.log('🔄 Trying alternative approach...');
      await executeInChunks(sqlContent);
    } else {
      console.log('✅ Database setup completed successfully!');
    }

    // Test the setup by checking if tables exist
    console.log('🔍 Testing database setup...');
    await testDatabaseSetup();

  } catch (error) {
    console.error('💥 Setup failed:', error);
    console.log('\n📋 Manual setup instructions:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of database_setup.sql');
    console.log('4. Execute the SQL');
    process.exit(1);
  }
}

async function executeInChunks(sqlContent) {
  // Split into logical chunks
  const chunks = [
    // Extensions and types
    sqlContent.split('-- 3) Tables')[0],
    // Tables
    sqlContent.split('-- 3) Tables')[1].split('-- 4) Trigger')[0],
    // Triggers
    sqlContent.split('-- 4) Trigger')[1].split('-- 5) Indexes')[0],
    // Indexes
    sqlContent.split('-- 5) Indexes')[1].split('-- 6) RLS')[0],
    // RLS and policies
    sqlContent.split('-- 6) RLS')[1].split('-- 7) Grant permissions')[0],
    // Grants and seed data
    sqlContent.split('-- 7) Grant permissions')[1]
  ];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (chunk) {
      console.log(`⚡ Executing chunk ${i + 1}/${chunks.length}...`);
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: chunk });
        if (error) {
          console.error(`❌ Error in chunk ${i + 1}:`, error.message);
        } else {
          console.log(`✅ Chunk ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Failed to execute chunk ${i + 1}:`, err.message);
      }
    }
  }
}

async function testDatabaseSetup() {
  try {
    // Test each table
    const tables = ['portfolios', 'showcases', 'services', 'orders'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: OK (${data?.length || 0} records)`);
      }
    }
  } catch (error) {
    console.log('⚠️ Could not test tables:', error.message);
  }
}

// Alternative: Direct PostgreSQL connection (if you have direct DB access)
async function setupWithDirectConnection() {
  console.log('🔧 For direct PostgreSQL connection, use:');
  console.log('1. Get your database connection string from Supabase Dashboard');
  console.log('2. Use psql or any PostgreSQL client:');
  console.log('   psql "your_connection_string" -f database_setup.sql');
}

setupDatabase();