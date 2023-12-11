const express = require('express')
const app = express()
const cors = require('cors');
const fetch = require('node-fetch');
const port = process.env.PORT || 3001

app.use(cors())
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // * means allow All
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With , Content-Type ,Accept , Authorization");
    response.setHeader("Acces-Control-Allow-Methods", "GET , POST , PATCH , DELETE ,PUT, OPTIONS");
    next();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/autocomplete', (req, res) => {
    const symbol = req.query["symbol"]
    var url = `https://finnhub.io/api/v1/search?q=${symbol}&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data_json => {
            let data = []

            for (let i = 0; i < data_json["result"].length; i++) {
                if (data_json["result"][i]["type"] !== "Common Stock")
                    continue

                if (data_json["result"][i]["symbol"].indexOf(".") !== -1)
                    continue

                data.push(data_json["result"][i]);
            }

            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

// app.get('/top-news', (req, res) => {
//   var url = 'https://finnhub.io/api/v1/company-news?symbol=MSFT&from=2021-09-01&to=2021-09-09&token=c7rdajiad3iel5ub6cjg';
//   fetch(url)
//   .then(res => res.json())
//   .then(data => {
//       res.send({ data });
//   })
//   .catch(err => {
//       res.send(err);
//   });
// })




app.get('/top-news', (req, res) => {
    const symbol = req.query["symbol"]
    let current_date = new Date()
    let previous_date_delta = new Date()
    previous_date_delta.setDate(previous_date_delta.getDate() - 6)

    const from = formatDate(previous_date_delta)
    const to = formatDate(current_date)
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data_json => {
            let cnt = 0
            let data = []

            for (let i = 0; i < data_json.length; i++) {
                if (data_json[i]["image"] === "" || data_json[i]["url"] === "" || data_json[i]["headline"] === "" || data_json[i]["summary"] === "")
                    continue;

                data.push(data_json[i]);
                cnt++
                if (cnt === 20)
                    break;
            }

            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function getUnixDate(date) {
    return parseInt(date.getTime() / 1000)
}

app.get('/getdata-latest-price', (req, res) => {
    const symbol = req.query["symbol"]
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            data["ct"] = new Date().getTime();
            data["c"] = Math.round(data["c"] * 100) / 100;
            data["d"] = Math.round(data["d"] * 100) / 100;
            data["dp"] = Math.round(data["dp"] * 100) / 100;
            data["h"] = Math.round(data["h"] * 100) / 100;
            data["l"] = Math.round(data["l"] * 100) / 100;
            data["o"] = Math.round(data["o"] * 100) / 100;
            data["pc"] = Math.round(data["pc"] * 100) / 100;

            // data["c"] = Math.random();
            // data["d"] = Math.random();
            // data["dp"] = Math.random();
            // data["h"] = Math.random();
            // data["l"] = Math.random();
            // data["o"] = Math.random();
            // data["pc"] = Math.random();
            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/getdata-description', (req, res) => {
    const symbol = req.query["symbol"]
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/getdata-peers', (req, res) => {
    const symbol = req.query["symbol"]
    const url = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/getdata-historical-summary-tab', (req, res) => {
    const symbol = req.query["symbol"]
    const to = req.query["to"]  // unix timestamp
    const from = to - 21600 // to - 6 hours in s
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=5&from=${from}&to=${to}&token=c7rdajiad3iel5ub6cjg`
    fetch(url)
        .then(res => res.json())
        .then(data_json => {
            let data = []
            for (let i = 0; i < data_json["c"].length; i++) {
                data.push([data_json["t"][i] * 1000, data_json["c"][i]])
            }

            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/getdata-historical-charts-tab', (req, res) => {
    const symbol = req.query["symbol"]
    let current_date = new Date()
    let previous_date_delta = new Date()
    previous_date_delta.setDate(previous_date_delta.getDate() - 730)

    const from = getUnixDate(previous_date_delta)
    const to = getUnixDate(current_date)

    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=c7rdajiad3iel5ub6cjg`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/earnings', (req, res) => {
    const symbol = req.query["symbol"]
    // NOTE: If any of the response values are null values for response keys,
    // replace null values to 0. Sample null response received from Finnhub API (Figure 4.9.1)
    // which should be handled and replaced with 0.
    const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/social-sentiment', (req, res) => {
    const symbol = req.query["symbol"]
    // NOTE: ‘from=2022-01-01’ should be used as a default parameter while
    // using company’s social sentiment API calls, if not used can sometime return empty response.
    const url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${symbol}&from=2022-01-01&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.get('/recommendations', (req, res) => {
    const symbol = req.query["symbol"]
    const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=c7rdajiad3iel5ub6cjg`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            res.send({ data });
        })
        .catch(err => {
            res.send(err);
        });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})