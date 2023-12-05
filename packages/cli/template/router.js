module.exports = () => {
  return [
    {
      "server_name": "api"
    },
    {
      "path": "/backend/engine/(.*)",
      "proxy": {
        "instance": `engine:9000`,
        "path": "/$1"
      }
    }
  ];
};
