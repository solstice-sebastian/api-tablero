const { getClient } = require('@solstice.sebastian/db-client');
const { msToDatetime } = require('@solstice.sebastian/helpers')();

const { DB_NAME, COLLECTION_NAME } = process.env;

class TradeRecordManager {
  constructor({ dbName = DB_NAME, collectionName = COLLECTION_NAME }) {
    this.dbName = dbName;
    this.collectionName = collectionName;
  }

  async getDb({ dbName = this.dbName } = {}) {
    const client = await getClient();
    const db = client.db(dbName);
    return db;
  }

  async getCollection({ collectionName = this.collectionName } = {}) {
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
  receive({ ticker, strategy, trader }) {
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
    const collection = await this.getCollection();
    const existing = await collection.find({ symbol }).toArray();
    if (existing.length > 0) {
      throw new Error(`Attempting to add record ${symbol} but it already exists`);
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
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { symbol },
      {
        $set: {
          strategy,
        },
      }
    );
    return result.connection;
  }

  async remove({ ticker }) {
    const { symbol } = ticker;
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ symbol });
    return result;
  }

  async clear() {
    const collection = await this.getCollection();
    return collection.drop();
  }

  async find(query) {
    const collection = await this.getCollection();
    const result = await collection.find(query).toArray();
    return result;
  }
}

module.exports = TradeRecordManager;
