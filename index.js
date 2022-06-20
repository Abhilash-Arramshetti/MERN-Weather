const http = require('http');
const fs = require('fs')
var requests = require('requests')

const homeFile = fs.readFileSync('home.html', 'utf-8')
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%tempVal%}', (orgVal.main.temp - 273).toFixed(2));
    temperature = temperature.replace('{%tempMin%}', (orgVal.main.temp_min - 273).toFixed(2));
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace('{%tempStatus%}', orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=munnar&appid=b81d1235add18150329af82740e85f64')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk)
                const arrData = [objData]
                // const temp=arrData[0].main.temp-273.00
                // console.log(temp.toFixed(2))
                const realData = arrData.map((val) => replaceVal(homeFile, val)).join('')
                res.write(realData)
                // console.log(realData)
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                console.log('end');
                res.end()
            });
    }

})
server.listen(8000, '127.0.0.1')