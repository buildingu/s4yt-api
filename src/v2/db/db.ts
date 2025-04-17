import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.set('strictQuery', false);
  
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB URI is not defined.');
    return;
  }

  mongoose.connect(process.env.MONGODB_URI);

  const connection = mongoose.connection;

  connection.once('open', () => {
    console.log('MongoDB connected');
  });

  connection.on('error', (error) => {
    console.error('Error connecting to MongoDB database: ', error);
  });

  return connection;
};

export default connectDB;