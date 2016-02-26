/**
 * Created by Jibin_ism on 13-Jan-16.
 */
module.exports = {
  db:{
       // host: 'mongodb://127.0.0.1/remedyShare'
      // host: 'mongodb://jibin19596:jazzy_architects@ds061354.mongolab.com:61354/heroku_mrwqgl13'
      host: 'mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT'
  }
};