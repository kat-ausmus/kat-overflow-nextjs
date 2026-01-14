import mongoose, { Mongoose } from 'mongoose';

import logger from './logger';

let MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  logger.info('Mongo DB URI not found. Connecting to local mongoDB');
  MONGODB_URI = 'mongodb://localhost:27017';
}

const DB_NAME = process.env.MONGODB_DBNAME || 'kat_overflow';
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info('Using existing mongoose connection');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: DB_NAME,
      })
      .then((result) => {
        logger.info('Connected to MongoDB');
        return result;
      })
      .catch((error) => {
        logger.error('Error connecting to MongoDB', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;
