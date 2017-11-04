module.exports = {
  server: {
    host: '127.0.0.1',
    port: 9199,
  },
  // Google Cloud Datastore
  // See https://github.com/GoogleCloudPlatform/google-cloud-node
  datastore: {
    projectId: 'YOUR_PROJECT_ID',
    keyFilename: '/path/to/keyfile.json',
  },
};
