const express = require("express");
const fs = require('fs');
const cors = require("cors");
// const express_ui5 = require("express-sapui5");
const sapui5 = require("sapui5-runtime");
const httpProxy = require('http-proxy');
const key = fs.readFileSync('SelfSignedZertifkate/key.pem', 'utf8');
const cert = fs.readFileSync('SelfSignedZertifkate/cert.pem', 'utf8');
const credentials = { key: key, cert: cert };
const odataProxy = httpProxy.createProxyServer({
    //target: 'http://sapi01ptx01:8000',44300
    target: 'https://sap-d19.team-con.de:44300',
    //target: 'http://SAP1I01ETX01:8000',

    secure: false
});
let oConfig = {
    // // neoApp: require("./neo-app.json"),
    // // destinations: require("./neo-dest.json")
    // // here you can choose the exact UI5 version
    version: "1.65.6"
};
// initialize environment variables
require("dotenv").config();
// proxy initializtion
if (process.env.HTTP_PROXY) {
    const HttpsProxyAgent = require("https-proxy-agent");
    oConfig.agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
}
let app = express();
let server = require('http').Server(app)
const liveReload = require('express-live-reloading')(server);

liveReload.static('apps');

liveReload.toolbar(true); // active toolbar status live reload

app.use(liveReload);
app.use('/apps', (req, res, next) => {
    if (req.path.endsWith("index.html")) {
        res
            .liveReload(`apps/${req.path}`)
            .sendFile(`${__dirname}/apps/${req.path}`);
    } else {
        next();
    }


});

["appconfig", "apps"].forEach(function (sPath) {
    app.use("/" + sPath, express.static(sPath));
});
app.use('/resources', express.static(sapui5));
app.use('/resources', express.static('libs'));
app.use('/apps/resources', express.static(sapui5));
app.use('/apps/resources', express.static('libs'));
app.use('/test-resources', express.static('test-resources'));
app.use(cors());
app.get("/", async (req, res) => {
    res.redirect('/test-resources/fioriSandbox.html');
});
app.route("/sap/opu/odata/*$").all(function (req, res) {
    odataProxy.web(req, res);
});
app.route("/sap/public/*$").all(function (req, res) {
    odataProxy.web(req, res);
});

app.listen(process.env.PORT || 3000);
var https = require('https');
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(4000);
