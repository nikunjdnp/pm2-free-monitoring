let express = require('express');
let app = express();
let controller = require('./controller');
let bodyParser = require('body-parser');
let allowCrossDomain = function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,userId,x-onehop-token,businessId,corporateId');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
};
app.use(allowCrossDomain);
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 100000000
}));

app.get('/', (req, res) => {
    res.send('welcome to node scheduler');
  });

let server = app.listen(6001, function() {
    controller.indentify_node_process.start();
    console.log('Server listening on port 6001');
});

module.exports = server;
