/**
 * Created by Kayvon Rahimi on 9-4-2018.
 */
const neo = require('neo4j-driver').v1;
const config = require('./env/env');

const driver = neo.driver("bolt://localhost:7687", neo.auth.basic(config.env.dbDatabase, config.env.neo4jPassword));

module.exports = driver;