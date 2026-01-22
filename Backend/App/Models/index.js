const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI

const client = new MongoClient(uri);
const db_GET_VIEW = client.db(process.env.DB_NAME);



module.exports = {

    Users: require("./Users"),
    BasicSetting: require("./BasicSetting"),
    Mailtemplate: require("./Mailtemplate"),
    Smstemplate: require("./Smstemplate"),
    Smsprovider: require("./Smsprovider"),
    Role: require("./Role"),
    Clients: require("./Clients"),
    Adminnotification: require("./Adminnotification"),
    Logs: require("./Logs"),
    Whatsappchat: require("./Whatsappchat"),
    Whatstemplate: require("./Whatstemplate")


}