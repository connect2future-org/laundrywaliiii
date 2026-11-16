import mongoose from 'mongoose';
import { ALL_MODELS } from '../models/index.js';
import { REQUIRED_DATABASE_NAME } from '../config/constants.js';

/**
 * Safely creates all collections and syncs schema indexes on the LaundryWalii database.
 * Strictly non-destructive: never drops databases, collections, or inserts dummy business records.
 */
export const initializeCollectionsAndIndexes = async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Mongoose connection is not active');
  }

  if (mongoose.connection.name !== REQUIRED_DATABASE_NAME) {
    throw new Error(
      `Safety check failed: active DB is "${mongoose.connection.name}", expected "${REQUIRED_DATABASE_NAME}".`
    );
  }

  const existingCollections = await mongoose.connection.db.listCollections().toArray();
  const existingNames = new Set(existingCollections.map((c) => c.name));

  const results = [];

  for (const Model of ALL_MODELS) {
    const colName = Model.collection.collectionName;
    let status = 'exists';

    if (!existingNames.has(colName)) {
      await Model.createCollection();
      status = 'created';
    }

    await Model.syncIndexes();
    const indexes = await Model.collection.indexes();

    results.push({
      model: Model.modelName,
      collection: colName,
      collectionStatus: status,
      indexCount: indexes.length
    });
  }

  return results;
};

