require('dotenv').config();
const sql = require('mssql');

console.log('Testing Connection to innoviii Database...\n');

const config = {
  server: 'localhost',
  database: 'innoviii',
  user: 'innoviii_user',
  password: 'InnoviiiProd123!',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 15000
  }
};

async function testConnection() {
  try {
    console.log('Testing connection to innoviii database...');
    await sql.connect(config);
    console.log('✅ CONNECTION SUCCESSFUL!');
    
    const result = await sql.query`SELECT DB_NAME() AS database_name`;
    console.log('✅ Connected to database:', result.recordset[0].database_name);
    
    await sql.close();
    console.log('\n🎉 innoviii DATABASE IS READY!');
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Make sure you ran the SQL commands in SSMS!');
  }
}

testConnection();