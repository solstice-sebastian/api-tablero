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
  process({ ticker, strategy, trader }) {
    this.record({ ticker, strategy, trader });
    const { exitOrder } = trader;
    if (exitOrder === null) {
      return this.add({ ticker, strategy, trader });
    }
    return this.remove({ ticker });
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
    return result.ops[0];
  }

  async update({ ticker, strategy }) {
    const { symbol } = ticker;
    const collection = await this.getCollection({ collectionName: this.entriesCollectionName });
    const result = await collection.updateOne(
      { symbol },
      {
        $set: {
          strategy,
        },
      }
    );
    if (!result.modifiedCount || result.modifiedCount !== 1) {
      throw new Error('Error updating strategy', result);
    }
    const updated = await collection.find({ symbol }).toArray();
    return updated[0];
  }

  async remove({ ticker, trader, strategy }) {
    const statsEntry = await this.buildStats({ ticker, trader, strategy });
    const { symbol } = ticker;
    const collection = await this.getCollection({ collectionName: this.entriesCollectionName });
    await collection.deleteOne({ symbol });
    return statsEntry;
  }

  async clear() {
    const collection = await this.getCollection({ collectionName: this.entriesCollectionName });
    return collection.drop();
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
    const statsEntry = insertResult.ops[0];
    return statsEntry;
  }
}

module.exports = TradeRecordManager;
