require('dotenv').config();
const sql = require('mssql');

console.log('Testing Production Database Connection...\n');

const config = {
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 30000
  },
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000
  }
};

async function testProductionConnection() {
  try {
    console.log('Configuration:');
    console.log('- Server:', config.server);
    console.log('- Database:', config.database);
    console.log('- User:', config.user);
    console.log('- Timeout:', config.options.connectTimeout + 'ms');
    
    await sql.connect(config);
    console.log('\n✅ PRODUCTION CONNECTION SUCCESSFUL!');
    
    // Test database operations
    const version = await sql.query`SELECT @@VERSION as version`;
    console.log('✅ SQL Server Version Check: PASSED');
    
    const databases = await sql.query`SELECT name FROM sys.databases WHERE name = 'innoviii_db'`;
    console.log('✅ Database Check: PASSED');
    
    await sql.close();
    console.log('\n🎉 PRODUCTION DATABASE IS READY!');
    
  } catch (error) {
    console.log('\n❌ PRODUCTION CONNECTION FAILED');
    console.log('Error:', error.message);
    console.log('\n🔧 SOLUTION:');
    console.log('1. Run the SQL commands in SSMS to create database and user');
    console.log('2. Make sure SQL Server is running');
    console.log('3. Verify the credentials in .env file');
  }
}

testProductionConnection();