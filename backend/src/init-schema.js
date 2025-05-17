import { initializeDatabase } from './config/schema.js';

const initSchema = async () => {
  try {
    const success = await initializeDatabase();
    if (success) {
      console.log('Database schema initialization completed successfully!');
      process.exit(0);
    } else {
      console.error('Database schema initialization failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during schema initialization:', error);
    process.exit(1);
  }
};

initSchema(); 