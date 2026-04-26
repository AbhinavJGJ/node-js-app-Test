const http = require('http');
const https = require('https');

const port = process.env.PORT || 3000;

function fetchAzureFunction(callback) {
  https.get('https://fun-based-on-app-service.azurewebsites.net/health', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => { callback(null, data); });
  }).on("error", (err) => {
    callback(err);
  });
}

const server = http.createServer((req, res) => {
  fetchAzureFunction((err, azureResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    if (err) {
      res.end('Error calling Azure Function: ' + err.message);
    } else {
      res.end('Node JS app working 🚀 Response: ' + azureResponse);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
