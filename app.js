var express = require('express');
var app = express();
var controller = require('./controller');
var bodyParser = require('body-parser');
var allowCrossDomain = function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,userId,x-onehop-token,businessId,corporateId');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        console.log("------------------Req URL-----------------");
        console.log("Req.URL :: ", req.path);
        console.log("------------------Req method-----------------");
        console.log("Req.params :: ", req.method);
        console.log("--------------------------------------------");
        next();
    }
    // next();
};
app.use(allowCrossDomain);
app.use(bodyParser.json({
    limit: '50mb'
}));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 100000000
}));
var server = app.listen(6001, function() {
    controller.indentify_node_process.start();
    console.log('Server listening on port 6001');
});


