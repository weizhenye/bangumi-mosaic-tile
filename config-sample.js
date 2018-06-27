module.exports = {
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 9199,
  },
  queue: {
    interval: 30 * 1e3,
    limit: 1000,
  },
  // Google Cloud Datastore
  // See https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga
  datastore: {
    projectId: process.env.DATASTORE_PROJECT_ID || 'YOUR_PROJECT_ID',
    keyFilename: process.env.DATASTORE_KEY_FILENAME || '/path/to/keyfile.json',
    // use `keyFilename` or `credentials`
    // credentials: {
    //   client_email: process.env.DATASTORE_CLIENT_EMAIL,
    //   private_key: process.env.DATASTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    // },
  },
  // Google Analytics Tracking Code
  ga: process.env.GA_TRACKING_CODE || '',
};
