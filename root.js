const http = require('http')
const fs = require('fs')
const requests = require('requests')

const homeFile = fs.readFileSync('home.html', 'utf-8')
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%tempVal%}', (orgVal.main.temp - 273).toFixed(2))
    temperature = temperature.replace('{%tempMin%}', (orgVal.main.temp_min - 273).toFixed(2))
    temperature = temperature.replace('{%tempMax%}', (orgVal.main.temp_max - 273).toFixed(2))
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace('{%tempStatus%}', orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=hyderabad&appid=b81d1235add18150329af82740e85f64')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realData = arrData.map((da) => replaceVal(homeFile, da)).join('')
                res.write(realData)
            })
            .on('end', (e) => {
                // if (err) return console.log('connection closed due to errors', err);
                console.log('end')
                res.end()
            })
        // const chunk=fs.readFileSync('val.json','utf-8')
        // const objData=JSON.parse(chunk);
        //     const arrData=[objData];
        //     const realData=arrData.map((da)=>{
        //         replaceVal(homeFile,da)
        //     }).join('')
        //     res.write(realData)
    }
})

server.listen(8000, '127.0.0.1')