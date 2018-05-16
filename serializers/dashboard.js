const serializeDashboards = (dashboards) => {
  const payload = dashboards.reduce((acc, curr, i) => {
    if (acc.dashboards === undefined) {
      acc.dashboards = [];
    }
    const serialized = {
      id: i,
      'dashboard-assets': curr.dashboardAssets,
    };
    acc.dashboards.push(serialized);
    return acc;
  }, {});
  return JSON.stringify(payload);
};

module.exports = serializeDashboards;
