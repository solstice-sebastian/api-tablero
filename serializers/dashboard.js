const serializeDashboards = (dashboards) => {
  const payload = dashboards.reduce((acc, curr, i) => {
    if (acc.dashboards === undefined) {
      acc.dashboards = [];
    }
    const serialized = {
      id: i,
      'dashboard-assets': curr.dashboardAssets,
      'total-value':
        Number.isNaN(parseFloat(curr.totalValue)) === false ? curr.totalValue.toFixed(8) : 0,
    };
    acc.dashboards.push(serialized);
    return acc;
  }, {});
  return JSON.stringify(payload);
};

module.exports = serializeDashboards;
