/**
 * Created by Jibin_ism on 13-Jan-16.
 */
module.exports = {
	var dbHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
	var dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT;
  db:{
       // host: 'mongodb://127.0.0.1/remedyShare'
      // host: 'mongodb://jibin19596:jazzy_architects@ds061354.mongolab.com:61354/heroku_mrwqgl13'
      host: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://127.0.0.1/remedyShare'
  }
};