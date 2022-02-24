const admin = require('firebase-admin');
const express = require('express');
const app = express();
app.use(express.json());
var serviceAccount = require('./nativeapp-95360-firebase-adminsdk-26qnv-26fdc86401.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/sendNotifications', (req, res) => {
  console.log(req.body);
  const message = {
    notification: {
      title: 'New Ad',
      body: 'New Ad Posted, click to open',
    },
    tokens: req.body.tokens,
  };
  admin
    .messaging()
    .sendMulticast(message)
    .then(response => {
      console.log('Sent Successfully');
    })
    .catch(e => {
      console.log(e);
    });
});

app.listen(3000, () => {
  console.log('Server Running!');
});
