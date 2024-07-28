//  TAX CONDITION TABLE

function ShowTaxCondition(taxCondition) {
    tableData = '';
    const TaxPeriod = $('#TaxPeriod').val();
    const TaxValues = $('#TaxCondition').val();

    const entries = taxCondition[0][TaxValues][0][TaxPeriod];

    let tax = 0;

    entries.forEach((entry, index) => {
        const prevEntry = entries[index - 1];
        const nextEntry = entries[index + 1];
        const nextX = nextEntry ? dollarize(nextEntry.income - 1) : 'and over';

        let taxTable = '';

        if (prevEntry !== undefined && prevEntry.tax > 0) {
            tax += (entry.income - prevEntry.income) * prevEntry.tax;
            taxTable = dollarize(tax);
        }

        tableData += `
            <tr>
                <td>${dollarize(entry.income)}</td>
                <td>${nextX}</td>
                <td>${taxTable}</td>
                <td>+ ${entry.tax * 100}%</td>
            </tr>
        `;
    });
    $('#TaxConditionTable tbody').html(tableData);
    renderChart();
}

// TAXABLE INCOME

function taxableIncome(){
    let total_income = $('#total_income').val();
    let deductions = $('#deductions').val();
    $('#taxable_income').val( total_income - deductions ).change();
}
taxableIncome();