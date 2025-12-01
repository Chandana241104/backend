const sql = require('mssql');

console.log('Testing SQL Server Authentication...\n');

const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'master',
  user: 'sa',
  password: 'Innoviii123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 15000
  }
};

async function testConnection() {
  try {
    console.log('Testing SA account connection...');
    await sql.connect(config);
    console.log('✅ SA AUTHENTICATION SUCCESSFUL!');
    
    // Create database and user
    console.log('Creating database and user...');
    
    // Create database
    await sql.query`IF NOT EXISTS(SELECT name FROM sys.databases WHERE name = 'innoviii') CREATE DATABASE innoviii`;
    console.log('✅ Database innoviii ready');
    
    // Switch to database
    await sql.query`USE innoviii`;
    
    // Create user
    await sql.query`
      IF NOT EXISTS(SELECT name FROM sys.sql_logins WHERE name = 'innoviii_user')
      CREATE LOGIN innoviii_user WITH PASSWORD = 'InnoviiiProd123!'
    `;
    
    await sql.query`
      IF NOT EXISTS(SELECT name FROM sys.database_principals WHERE name = 'innoviii_user')
      CREATE USER innoviii_user FOR LOGIN innoviii_user
    `;
    
    await sql.query`ALTER ROLE db_owner ADD MEMBER innoviii_user`;
    console.log('✅ User innoviii_user created with permissions');
    
    await sql.close();
    console.log('\n🎉 DATABASE SETUP COMPLETE!');
    
  } catch (error) {
    console.log('❌ SA Authentication failed:', error.message);
    
    if (error.message.includes('Login failed')) {
      console.log('\n🔧 SOLUTION:');
      console.log('1. Connect to SSMS with Windows Authentication');
      console.log('2. Run the SQL commands to enable SA account');
      console.log('3. Restart SQL Server (SQLEXPRESS)');
    }
  }
}

testConnection();