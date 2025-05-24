const { testConnection } = require("./configs/dbConfig");
(async function () {
  const dbConnected = await testConnection().then((a) => {
    console.log(a);
    return a;
  });
  console.log(dbConnected ? "Connected" : "Disconnected");
})();
