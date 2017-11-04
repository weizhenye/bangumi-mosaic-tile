module.exports = {
  server: {
    host: '0.0.0.0',
    port: 9199,
  },
  // Google Cloud Datastore
  // See https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga
  datastore: {
    projectId: 'YOUR_PROJECT_ID',
    keyFilename: '/path/to/keyfile.json',
  },
};
