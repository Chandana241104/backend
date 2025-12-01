const { exec } = require('child_process');
const sql = require('mssql');

console.log('=== SQL Server Express Status Check ===\n');

// Check if SQL Server service is running
exec('sc query MSSQL$SQLEXPRESS', (error, stdout) => {
  if (stdout.includes('RUNNING')) {
    console.log('✅ SQL Server (SQLEXPRESS) service is RUNNING');
  } else {
    console.log('❌ SQL Server (SQLEXPRESS) service is NOT running');
    console.log('Start it in Services.msc or SQL Server Configuration Manager');
  }
});

// Check if port 1433 is listening
exec('netstat -an | findstr :1433', (error, stdout) => {
  if (stdout) {
    console.log('✅ Port 1433 is listening:');
    console.log(stdout);
  } else {
    console.log('❌ Port 1433 is NOT listening - TCP/IP not enabled');
  }
});

// Test connection after a delay
setTimeout(async () => {
  console.log('\n=== Testing Connection ===');
  
  const config = {
    server: 'localhost\\SQLEXPRESS',
    database: 'master',
    options: {
      encrypt: false,
      trustServerCertificate: true,
      connectTimeout: 10000
    }
  };

  try {
    console.log('Trying Windows Authentication...');
    await sql.connect(config);
    console.log('✅ Windows Authentication SUCCESS!');
    
    const result = await sql.query`SELECT @@VERSION as version`;
    console.log('SQL Server:', result.recordset[0].version.split('\n')[0]);
    
    await sql.close();
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Enable TCP/IP in SQL Server Configuration Manager');
  }
}, 2000);