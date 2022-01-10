demo = {
    initDashboardPageCharts: function () {
        const chartOptions = {
            maintainAspectRatio: false,
            legend: {
                display: false
            },

            tooltips: {
                backgroundColor: '#f5f5f5',
                titleFontColor: '#333',
                bodyFontColor: '#666',
                bodySpacing: 4,
                xPadding: 12,
                mode: "nearest",
                intersect: 0,
                position: "nearest"
            },
            responsive: true,
            scales: {
                yAxes: [{
                    barPercentage: 1.6,
                    gridLines: {
                        drawBorder: false,
                        color: 'rgba(29,140,248,0.0)',
                        zeroLineColor: "transparent",
                    },
                    ticks: {
                        suggestedMin: 60,
                        suggestedMax: 125,
                        padding: 20,
                        fontColor: "#9a9a9a"
                    }
                }],

                xAxes: [{
                    barPercentage: 1.6,
                    gridLines: {
                        drawBorder: false,
                        color: 'rgba(225,78,202,0.1)',
                        zeroLineColor: "transparent",
                    },
                    ticks: {
                        padding: 20,
                        fontColor: "#9a9a9a"
                    }
                }]
            }
        };

        let chart_labels = [];
        let chart_data = [];
        const ctx = document.getElementById("chartBig1").getContext('2d');

        const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
        gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
        gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
        const config = {
            type: 'line',
            data: {
                labels: chart_labels,
                datasets: [{
                    label: "Bitcoin Price",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: '#d346b1',
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    pointBackgroundColor: '#d346b1',
                    pointBorderColor: 'rgba(255,255,255,0)',
                    pointHoverBackgroundColor: '#d346b1',
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: chart_data,
                }]
            },
            options: chartOptions
        };

        const myChartData = new Chart(ctx, config);
        const fetchGraphData = () => {
            const now = new Date();
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            fetch(`https://api.pro.coinbase.com/products/BTC-USD/candles?start=${oneWeekAgo.toISOString()}&end=${now.toISOString()}&granularity=21600`)
                .then(response => response.json())
                .then(data => {
                    const times = data.map(time => {
                        return new Date(time[0] * 1000).toLocaleDateString('ro-RO', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    })
                    const prices = data.map(price => {
                        return price[2]
                    })
                    const chartData = myChartData.config.data;
                    chartData.datasets[0].data = prices.reverse();
                    chartData.labels = times.reverse();
                    myChartData.update();
                })
                .catch(err => console.log(err))
        }

        const fetchUnconfirmedTransactions = () => {
            fetch(`https://blockchain.info/unconfirmed-transactions?format=json`)
                .then(response => response.json())
                .then(data => {
                    const firstSixTransactions = data.txs.slice(0, 7);
                    const id = document.getElementById('latestTransactions').getElementsByTagName('tbody')[0];
                    firstSixTransactions.forEach(transaction => {
                        const newRow = id.insertRow();
                        newRow.innerHTML = `<tr><td><a href="/transaction.html?hash=${transaction.hash}">${transaction.hash}</a></td><td>${transaction.size}</td><td>${transaction.fee}</td></tr>`;
                    })
                })
                .catch(err => console.log(err))
        }

        const fetchLastBlocks = () => {
            fetch(`https://blockchain.info/blocks/${+new Date()}?format=json`)
                .then(response => response.json())
                .then(data => {
                    const firstSixBlocks = data.slice(0,7);
                    const id = document.getElementById('latestBlocks').getElementsByTagName('tbody')[0];
                    firstSixBlocks.forEach(transaction => {
                        const newRow = id.insertRow();
                        newRow.innerHTML = `<tr><td><a href="/blocks.html?hash=${transaction.hash}">${transaction.hash}</a></td><td>${transaction.height}</td><td>${new Date(transaction.time * 1000).toLocaleTimeString('ro-RO')}</td></tr>`;
                    })
                })
                .catch(err => console.log(err.stack))
        }

        const fetchMiscData = () => {
            fetch('https://blockchain.info/q/totalbc')
                .then(response => response.text())
                .then(data => {
                    document.getElementById("btc-circulation").innerHTML = data;
                })
                .catch(err => console.log(err.stack))
            fetch("https://blockchain.info/q/bcperblock")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("reward-per-block").innerHTML = data;
                })
                .catch(err => console.log(err.stack))
            fetch("https://blockchain.info/q/getdifficulty")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("btc-diff").innerHTML = data;
                })
                .catch(err => console.log(err.stack))
            fetch("https://blockchain.info/q/probability")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("avg-hashrate").innerHTML = Number.parseFloat(data).toExponential(2);
                })
                .catch(err => console.log(err.stack))
            fetch("https://blockchain.info/q/hashrate")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("hashrate").innerHTML = data;
                })
                .catch(err => console.log(err.stack))
        }

        fetchGraphData();
        fetchUnconfirmedTransactions();
        fetchLastBlocks();
        fetchMiscData();
    },
};
