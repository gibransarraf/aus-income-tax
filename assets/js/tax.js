// ---------------------------
//  CALCULATE TAXES FUNCTION
// ---------------------------

function calculateTax(income, display = true) {
    const taxType = $('#TaxCondition').val();
    const taxPeriod = $('#TaxPeriod').val();
    const total_income = $('#total_income').val();
    const taxRates = taxCondition
        .find(condition => condition.hasOwnProperty(taxType))[taxType]
        .find(period => period.hasOwnProperty(taxPeriod))[taxPeriod];

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

        // Anually
        $('#anually_gross .val') .html( dollarize( ( total_income - tax ) ) )
        $('#anually_super .val') .html( dollarize( ( total_income * 0.11 ) ) )
        $('#anually_tax .val')   .html( dollarize( ( tax ) ) )
        $('#anually_net .val')   .html( dollarize( ( total_income ) ) )

        // Monthly
        $('#monthly_gross .val') .html( dollarize( ( ( total_income - tax ) / 12 ) ) )
        $('#monthly_super .val') .html( dollarize( ( total_income * 0.11 / 12 ) ) )
        $('#monthly_tax .val')   .html( dollarize( ( tax / 12 ) ) )
        $('#monthly_net .val')   .html( dollarize( ( total_income / 12) ) )

        // Weekly
        $('#weekly_gross .val')  .html( dollarize( ( ( total_income - tax ) / 52 ) ) )
        $('#weekly_super .val')  .html( dollarize( ( total_income * 0.11 / 52 ) ) )
        $('#weekly_tax .val')    .html( dollarize( ( tax / 52 ) ) )
        $('#weekly_net .val')    .html( dollarize( ( total_income / 52 ) ) )

        // Hourly
        $('#hourly_gross .val')  .html( dollarize( ( ( total_income - tax ) / 52 / 38 ) ) )
        $('#hourly_super .val')  .html( dollarize( ( total_income * 0.11 / 52 / 38 ) ) )
        $('#hourly_tax .val')    .html( dollarize( ( tax / 52 / 38 ) ) )
        $('#hourly_net .val')    .html( dollarize( ( total_income / 52 / 38 ) ) )


        let percentage = Math.floor( tax * 100 / income * 100 ) / 100;
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
        $('#taxReturn').html( dollarize(taxReturn) + ' <small>(' + ( percentage ? percentage : 0) + '%)</small>');

    }

    return tax;
}