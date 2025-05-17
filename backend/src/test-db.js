import { testConnection } from './config/database.js';

const testDbConnection = async () => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('Database connection test passed!');
      process.exit(0);
    } else {
      console.error('Database connection test failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error testing database connection:', error);
    process.exit(1);
  }
};

testDbConnection(); 