// ----------------------
//  CHART
// ----------------------

// OPTIONS
const options = {
    maintainAspectRatio: false,
    animation: false,
    elements: {
        point: {
            radius: 0,
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Taxable Income'
            },
            min: 0,
            type: 'linear',
            position: 'bottom',
            max: inputMaxIncome,
            ticks: {
                stepSize: 20000,
                callback: function (value, index, values) {
                    return '$ ' + value.toLocaleString();
                }
            },
            grid: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)'
            },
        },
        y: {
            title: {
                display: true,
                text: 'Tax Percentage'
            },
            grid: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                callback: function (value, index, values) {
                    return value.toLocaleString(undefined, {
                        style: 'percent',
                        minimumFractionDigits: 0
                    });
                }
            },
        }
    },
};

// CHART DATA
let taxData = [];
let taxtoPay = [];
let incomeData = [];
let chartData = {
    labels: incomeData,
    datasets: [{
        label: 'Taxable Income vs. Tax',
        fill: true,
        borderColor: 'rgba(220, 53, 69, 0.4)',
        backgroundColor: 'rgba(220, 53, 69, 0.15)',
    }, {
        label: 'Percentage Taxed',
        fill: true,
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.25)',
    }]
};

function getChartData() {
    let localIncome;
    if (taxable_income > inputMaxIncome) {
        localIncome = inputMaxIncome;
    } else {
        localIncome = taxable_income;
    }

    taxData = [];
    for (let income = 0; income <= inputMaxIncome; income += 1000) {
        incomeData.push(income);
        let percentage = calculateTax(income, false) / income;
        taxData.push(percentage);
    }
    chartData.datasets[0].data = taxData;

    taxtoPay = [];
    for (let income = 0; income <= localIncome; income += 1000) {
        let percentageToPay = calculateTax(income, false) / income;
        taxtoPay.push(percentageToPay);
    }
    chartData.datasets[1].data = taxtoPay;
}

let taxChart;
let ctx = document.getElementById('taxChart').getContext('2d');
Chart.defaults.font.family = "Geologica";
function renderChart() {
    getChartData();
    if (taxChart) {
        chartData.datasets[0].data = taxData;
        chartData.datasets[1].data = taxtoPay;
        taxChart.update();
    } else {
        taxChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: options,
        });
    }
}