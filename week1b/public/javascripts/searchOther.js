let birdListing = [{}];

$("#searchByDateForm").on("submit", function( event ) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let date1 = new Date(formData.get('start_date'));
    let date2 = new Date(formData.get('end_date'));

    getDates()
    orderDates(birdListing)
    let datesInSelection = selectDates(birdListing, date1, date2)
    selectBirds(datesInSelection)


});

$('#resetDateBtn').on("click", function() {
    //make it reset all?
    for (let i = 0; i < $('.bird-info').length; i++) {
        $('#bird-info-'+i).show();
    }
})
$('#searchByNameInput').on('input change paste keyup', function() {
    var searchValue = $(this).val().toLowerCase();
    $('.name .list-value').each(function() {
        var name = $(this).text().toLowerCase();
        var parentElement = $(this).closest('.bird-info');
        if (name.includes(searchValue)) {
            parentElement.show();
        } else {
            parentElement.hide();
        }
    });
});

//$('[name=toggleUnknown]').on('change', function() {
//    var knownFilter = $('[name=toggleUnknown]:checked').val();
//    if (knownFilter == 'hideUnknown') {
//        console.log('hidden')
//        $('.name .list-value').each(function() {
//          var name = $(this).text().trim().toLowerCase();
//          console.log(name)
//          var parentElement = $(this).closest('.bird-info');
//          if (name == 'unknown') {
//              console.log('hide parent')
//              parentElement.hide();
//          } else {
//              parentElement.show();
//          }
//        })
//        } else if (knownFilter == 'onlyUnknown') {
//             $('.name .list-value').each(function() {
//                 var name = $(this).text().trim().toLowerCase();
//
//                 var parentElement = $(this).closest('.bird-info');
//                 if (name == 'unknown') {
//                     parentElement.show()
//                 } else {
//                     parentElement.hide();
//                 }
//             })
//            //$('#searchByNameInput').val("Unknown");
//        }
//    else { //both
//
//    }
//})

function getDates() {
    for (let i = 0; i < $('.bird-info').length; i++) {
        let dateTimeString = $('#bird-info-' + i + ' .date .list-value').text().trim();
        let dateTime = new Date(dateTimeString);
        birdListing[i] = {iterator: i, date: dateTime};
    }
}

function orderDates(birdListingObj) {
    birdListingObj.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
}

function selectDates(birdListingObj, date1, date2){
    return birdListingObj.filter(function (obj) {
        let date = new Date(obj.date);
        return obj.date >= date1 && date <= date2;
    })
}

function selectBirds(birdListingObj) {
    for (let i=0; i<$('.bird-info').length; i++) {
        let dateInRange = birdListingObj.some(function(obj) {
            return obj.iterator === i;
        });
        console.log(dateInRange)
        if (!dateInRange) {
            $('#bird-info-'+i).hide();
        } else {
            $('#bird-info-'+i).show();
        }
    }
}