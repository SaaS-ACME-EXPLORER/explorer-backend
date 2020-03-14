
module.exports = {
    url: process.env.DB_URL || "mongodb://mongo",
    port: process.env.PORT  || 3000,
    dbPort: process.env.DBPORT || 27017,
    host: process.env.HOST || "localhost:3000",
    collectionName: "acme-explorer"
}