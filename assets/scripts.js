// ----------------------
//  GENERAL
// ----------------------

//  TOOLTIPS
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

//  DOLLARIZE
function dollarize(number) {
    return `$ ${Math.floor(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

//  RANGE FUNCTION
function updateRangeValue(range, parent) {
    let value = range.val();
    $('.range-value', parent).val(value).change();
}

//  ON RANGE CHANGE
$('input[type="range"]').each(function () {
    let range = $(this);
    let parent = range.parent();
    range.on('input change', function () {
        updateRangeValue(range, parent);
    });
    updateRangeValue(range, parent);
});

$('#taxable_income').on('input change', function () {
    let input = $(this);
    let parent = input.parent().parent();
    $('input[type="range"]', parent).val(input.val());
});

// ----------------------
//  TAX TABLES
// ----------------------
const taxCondition = [{
    "resident": [
        { "income": 0, "tax": 0 },
        { "income": 18201, "tax": 0.19 },
        { "income": 45001, "tax": 0.325 },
        { "income": 120001, "tax": 0.37 },
        { "income": 180001, "tax": 0.45 },
    ],
    "whm": [
        { "income": 0, "tax": 0.15 },
        { "income": 45001, "tax": 0.325 },
        { "income": 120001, "tax": 0.37 },
        { "income": 180001, "tax": 0.45 },
    ],
}];

// ----------------------
//  CALCULATE TAXES
// ----------------------

const inputMaxIncome = parseFloat($('#taxable_income').attr('max'));
let taxable_income = parseFloat($('#taxable_income').val());

//  ON INCOME CHANGE
$('#taxable_income').on('input change', function () {
    taxable_income = parseFloat($('#taxable_income').val());
    calculateTax(taxable_income);
    renderChart();
});

//  ON PAYED CHANGE
$('#alreadyPayed').on('input change', function () {
    calculateTax(taxable_income);
});

//  TAX CONDITION TABLE
function ShowTaxCondition(taxCondition) {
    tableData = '';
    const selectedTable = $('#TaxCondition').val();
    const entries = taxCondition[0][selectedTable];

    let tax = 0;

    entries.forEach((entry, index) => {
        const prevEntry = entries[index - 1];
        const nextEntry = entries[index + 1];
        const nextX = nextEntry ? dollarize(nextEntry.income - 1) : 'and over';

        let taxTable = '';

        if (prevEntry !== undefined && prevEntry.tax > 0) {
            tax += (entry.income - prevEntry.income) * prevEntry.tax;

            taxTable = dollarize(tax) + ' + ';
        }

        tableData += `
            <tr>
                <td>${dollarize(entry.income)} - ${nextX}</td>
                <td>
                    ${taxTable}
                    ${entry.tax * 100}%
                </td>
            </tr>
        `;
    });
    $('#TaxConditionTable tbody').html(tableData);
    renderChart();
}

// SHOW TABLE ON CHANGE
$('#TaxCondition').on('change', function () {
    ShowTaxCondition(taxCondition);
    calculateTax(taxable_income);
});

// ----------------------
//  CALCULATE TAXES FUNCTION
// ----------------------
function calculateTax(income, display = true) {
    const taxType = $('#TaxCondition').val();
    const taxTable = taxCondition.find(condition => condition.hasOwnProperty(taxType));
    const taxRates = taxTable[taxType];

    let tax = 0;
    let remainingIncome = income;

    for (let i = taxRates.length - 1; i >= 0; i--) {
        const { income: bracketIncome, tax: bracketTax } = taxRates[i];

        if (remainingIncome > bracketIncome) {
            const taxableIncomeInBracket = remainingIncome - bracketIncome;
            const taxInBracket = taxableIncomeInBracket * bracketTax;

            tax += taxInBracket;
            remainingIncome = bracketIncome;
        }
    }

    if (display) {
        let result = dollarize(tax);
        let percentage = Math.floor(tax * 100 / income * 100) / 100;

        $('#totalTax p:nth-child(2)').html(result)
        $('#totalTax p:last-child').html('<small>(' + (percentage ? percentage : 0) + '% of your total income)</small>')

        let payed = $('#alreadyPayed').val();


        let message;
        let taxReturn = payed - tax;

        if (taxReturn >= 0) {
            taxReturn = payed - tax;
            message = 'You can claim';
            $('#message').parent().parent().attr('class', 'card-footer text-center text-dark bg-success');
        } else {
            taxReturn = (payed - tax) * -1;
            message = 'You have to pay';
            $('#message').parent().parent().attr('class', 'card-footer text-center text-dark bg-danger');
        }
        $('#message').html(message);
        $('#taxReturn').html(dollarize(taxReturn));

    }

    return tax;
}

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
            type: 'linear',
            position: 'bottom',
            min: 0,
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
        fill: false,
        borderColor: 'rgba(255, 0, 0, 0.5)',
    }, {
        label: 'Percentage Taxed',
        fill: true,
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 1)',
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

// ----------------------
//  CALCULATIONS ON LOAD
// ----------------------
$(document).ready(function () {
    ShowTaxCondition(taxCondition);
    calculateTax($('#taxable_income').val());
});