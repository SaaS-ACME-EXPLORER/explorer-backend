
module.exports = {
    url: process.env.DB_URL || "mongodb://localhost:27017/acme-explorer",
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost:3000"
}