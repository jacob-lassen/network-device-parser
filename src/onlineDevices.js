const http =  require('http');
const Device = require('./Device');
module.exports = async function ({host, port, user, password}) {
    if (!host) {
        throw new Error('Missing option: host');
    }
    if (!port) {
        throw new Error('Missing option: port');
    }
    if (!user) {
        throw new Error('Missing option: user');
    }
    if (!password) {
        throw new Error('Missing option: password');
    }

    const html = await fetchHtmlMarkUp({host, port, user, password});
    return parseDevices(html);
}

function parseDevices (html) {
    singleLineHtml = html.replace(/(\r\n|\n|\r)/gm, '');
    const deviceReqex = /<center>(.*?)<\/center>/igm;
    const deviceMatches = singleLineHtml.match(deviceReqex) || [];
    return deviceMatches.map(parseDevice);
}

function parseDevice (deviceMarkup) {
    const spaceLess = deviceMarkup.replace(/\s/g, '');;
    const name = spaceLess.match(/<a>(.*)<\/a>/)[1];
    const mac = spaceLess.match(/<br>(.*)<br>/)[1];
    const ip = spaceLess.match(/<br>(.*)<\/center>/)[1];
    return Device({
        name: name,
        mac: mac,
        ip: ip,
    });
}

function fetchHtmlMarkUp ({host, port, user, password}) {
    var auth = "Basic " + new Buffer(user + ":" + password).toString("base64");
    const params = {
        method: 'GET',
        hostname: host,
        port: port,
        path: '/landiscover.html',
        headers : {
            "Authorization" : auth
        }
    }
    return new Promise(function(resolve, reject) {
        const req = http.request(params, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error(`Received status:  ${res.statusCode}`));
            }
            const body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                resolve(body.toString());
            });
        });
        req.on('error', reject);
        req.end();
    });
}