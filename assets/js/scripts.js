// ----------------------
//  GENERAL
// ----------------------

$('#total_income').on('input change', function () {
    let input = $(this);
    let parent = input.parent().parent();
    $('input[type="range"]', parent).val(input.val());
    taxableIncome();
});

$('#deductions').on('input change', function () {
    taxableIncome();
});

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

// SHOW TABLE ON CHANGE
$('#TaxCondition').on('change', function () {
    ShowTaxCondition(taxCondition);
    calculateTax(taxable_income);
});

$('#TaxPeriod').on('change', function () {
    ShowTaxCondition(taxCondition);
    calculateTax(taxable_income);
});

// ----------------------
//  CALCULATIONS ON LOAD
// ----------------------

$(document).ready(function () {
    ShowTaxCondition(taxCondition);
    calculateTax($('#taxable_income').val());
});