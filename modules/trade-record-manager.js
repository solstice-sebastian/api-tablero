const { getClient } = require('@solstice.sebastian/db-client');
const { msToDatetime } = require('@solstice.sebastian/helpers')();
const TradeStats = require('@solstice.sebastian/trade-stats');

const {
  DB_NAME,
  ENTRIES_COLLECTION_NAME,
  RECORD_COLLECTION_NAME,
  STATS_COLLECTION_NAME,
} = process.env;

class TradeRecordManager {
  constructor({
    dbName = DB_NAME,
    entriesCollectionName = ENTRIES_COLLECTION_NAME,
    recordCollectionName = RECORD_COLLECTION_NAME,
    statsCollectionName = STATS_COLLECTION_NAME,
  } = {}) {
    this.dbName = dbName;
    this.entriesCollectionName = entriesCollectionName;
    this.recordCollectionName = recordCollectionName;
    this.statsCollectionName = statsCollectionName;
  }

  async getDb({ dbName = this.dbName } = {}) {
    const client = await getClient();
    const db = client.db(dbName);
    return db;
  }

  async getCollection({ collectionName = this.entriesCollectionName } = {}) {
    const db = await this.getDb();
    const collection = await db.collection(collectionName);
    return collection;
  }

  /**
   * determine if trade order is an entry or exit
   *
   * @param {Ticker} ticker
   * @param {Strategy} strategy
   * @param {Trader} trader
   */
  async process({ ticker, strategy, trader }) {
    this.record({ ticker, strategy, trader });
    const { exitOrder } = trader;
    if (exitOrder === null) {
      return this.add({ ticker, strategy, trader });
    }
    const statsRecord = await this.buildStats({ ticker, strategy, trader });
    await this.remove({ ticker });
    return statsRecord;
  }

  async add({ ticker, strategy, trader }) {
    const { symbol } = ticker;
    const dbTimestamp = Date.now();
    const dbDatetime = msToDatetime(dbTimestamp);
    const collection = await this.getCollection({ collectionName: this.entriesCollectionName });
    const existing = await collection.find({ symbol }).toArray();
    if (existing.length > 0) {
      return new Error(`Attempting to add record ${symbol} but it already exists`);
    }
    const result = await collection.insertOne({
      symbol,
      ticker,
      strategy,
      trader,
      dbTimestamp,
      dbDatetime,
    });
    console.log(`success entering ${symbol}`);
    return result.ops[0];
  }

  async update({ ticker, strategy }) {
    const { symbol } = ticker;
    const collection = await this.getCollection({ collectionName: this.entriesCollectionName });
    try {
      await collection.updateOne(
        { symbol },
        {
          $set: {
            strategy,
          },
        }
      );
      const updated = await collection.find({ symbol }).toArray();
      console.log(`success updating ${symbol}`);
      return updated[0];
    } catch (error) {
      return console.log(`Error updating strategy for ${symbol}`, error);
    }
  }

  async remove({ ticker }) {
    const { symbol } = ticker;
    const collection = await this.getCollection({ collectionName: this.entriesCollectionName });
    try {
      const recordToRemove = await collection.find({ symbol }).toArray();
      await collection.deleteOne({ symbol });
      console.log(`success removing ${symbol}`);
      return recordToRemove[0];
    } catch (error) {
      return console.log(`TradeRecordManager#remove: error deleting ${symbol}`, error);
    }
  }

  async clear() {
    const db = await this.getDb();
    const collections = await db.collections();
    const collectionNames = collections.map((collection) => collection.collectionName);
    if (collectionNames.includes(this.entriesCollectionName)) {
      const entriesCollection = await this.getCollection({
        collectionName: this.entriesCollectionName,
      });
      await entriesCollection.drop();
    }

    if (collectionNames.includes(this.recordCollectionName)) {
      const recordCollection = await this.getCollection({
        collectionName: this.recordCollectionName,
      });
      await recordCollection.drop();
    }

    if (collectionNames.includes(this.statsCollectionName)) {
      const statsCollection = await this.getCollection({
        collectionName: this.statsCollectionName,
      });
      await statsCollection.drop();
    }
    return Promise.resolve(this);
  }

  async find(query) {
    const collection = await this.getCollection({ collectionName: this.entriesCollectionName });
    const result = await collection.find(query).toArray();
    return result;
  }

  async record({ ticker, strategy, trader }) {
    const { symbol } = ticker;
    const collection = await this.getCollection({ collectionName: this.recordCollectionName });
    return collection.insertOne({ symbol, ticker, strategy, trader });
  }

  async buildStats({ ticker }) {
    const { symbol } = ticker;
    // get entryModel
    const entriesCollection = await this.getCollection({
      collectionName: this.entriesCollectionName,
    });
    const entryRecords = await entriesCollection.find({ symbol }).toArray();
    const tradeStats = new TradeStats({ entryModel: entryRecords[0], ticker });
    const statsCollection = await this.getCollection({ collectionName: this.statsCollectionName });
    const insertResult = await statsCollection.insertOne(tradeStats.toRecord());
    const statsRecord = insertResult.ops[0];
    return statsRecord;
  }
}

module.exports = TradeRecordManager;
