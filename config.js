
module.exports = {
    // url: process.env.DB_URL || "mongodb://mongo",
    url: process.env.DB_URL || "mongodb://localhost:27017/acme-explorer",
    port: process.env.PORT  || 3000,
    dbPort: process.env.DBPORT || 27017,
    host: process.env.HOST || "localhost:3000",
    collectionName: "acme-explorer"
}