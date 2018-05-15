const GdaxAdapter = require('./adapter');

class GdaxDashboard {
  constructor() {
    this.adapter = new GdaxAdapter();
  }
}

module.exports = GdaxDashboard;
