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