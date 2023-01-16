const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
    let handlers = {};
    handlers.sample = (data, callback) => {
        callback(406, { 'name': 'sample handle' });
    }
    handlers.notFound = (data, callback) => {
        callback(404, "Not found");
    }
    handlers.home = (data, callback) => {
        callback(200, 'homepage');
    }
    let router = {
        'sample': handlers.sample,
        'home': handlers.home,
    }
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    console.log(trimPath);
    req.on('data', (data) => {

    })
    router['home'] = router.home
    req.on('end', () => {
        console.log(111, typeof router[trimPath]);
        let choosenHandler = ((typeof router[trimPath] !== 'undefined') ? router[trimPath] : handlers.notFound);
        console.log(choosenHandler);
        let data = {
            'trimPath': trimPath,
        };
        choosenHandler(data, function(statusCode, payload){
            console.log("Status code", statusCode);
            statusCode = typeof statusCode == 'number' ? statusCode : 200;
            console.log(statusCode, "after");
            payload = typeof (payload) == 'string' ? payload : {};
            let payloadString = JSON.stringify(payload);
            console.log(payloadString);
            res.writeHead(statusCode, { 'Content-Type': 'text/html' });
            res.end(payloadString);
        })
    })
})
server.listen(8080, () => {
    console.log('Server is running at localhost:8080')
})