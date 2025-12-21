const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

const runSqlFile = async (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  // Split by semicolon to get individual statements, filtering out empty ones
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      await sequelize.query(statement);
    } catch (error) {
      // Ignore "Unknown database" error for drop database or use statement
      if (!error.message.includes('Unknown database')) {
        console.error(`Error executing statement: ${statement.substring(0, 50)}...`);
        console.error(error.message);
      }
    }
  }
};

const init = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected.');

    const dbDir = path.join(__dirname, '../../database');

    console.log('1. Dropping tables...');
    await runSqlFile(path.join(dbDir, 'drop.sql'));

    console.log('2. Creating schema...');
    await runSqlFile(path.join(dbDir, 'schema.sql'));

    console.log('3. Seeding data...');
    await runSqlFile(path.join(dbDir, 'seed.sql'));

    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
};

init();
