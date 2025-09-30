const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create a new Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {}
  }
);

// Import models
const User = require('./user')(sequelize, Sequelize);
const VerificationToken = require('./verificationToken')(sequelize, Sequelize);

// Set up model associations
if (VerificationToken.associate) {
  VerificationToken.associate({ User });
}

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // This will create tables if they don't exist
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit with error
  }
};

// Initialize models
const db = {
  sequelize,
  Sequelize,
  User,
  VerificationToken
};

// Test connection on startup
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = db;
