var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function loadCanteenInfo() {
    readDataFromFile();
}

function readDataFromFile() {
    var filePath = "assets/resources/";
    var filename = "data.json";
    var file = filePath + filename;

    $.ajax({
        dataType: "json",
        url: file,
        success: function(jdata) {
            var json = $.parseJSON(jdata);
            processData(json);
        },
        error: function(err) {
            console.error("error reading from file: " + file);
        }
    });
}

function processData(obj) {
    var pattern = /(\d{2})\/(\d{1,2})\/(\d{4})/;
    var dates = [];

    resetInfo();

    $.each(obj, function(index, element) {
        var day = element.day
        var dateArr = day.split('/');

        var dayOfMonth = dateArr[0];
        if (dayOfMonth.length < 2) {
            dayOfMonth = "0" + dayOfMonth
        }

        var month = dateArr[1];
        if (month.length < 2) {
            month = "0" + month
        }

        var year = dateArr[2];
        var date = new Date(year + "-" + month + "-" + dayOfMonth);
        var weekday = weekdays[date.getDay()];
        weekday = weekday.toLowerCase();
        $('#' + weekday).html(formatDateString(date))

        if(isToday(date)) {
            window.location = '#' + weekday;
        }

        dates.push(date);

        var meals = element.meal
        $.each(meals, function(index, element) {
            var meal_type = element.type.toLowerCase()

            var info = element.info
            $.each(info, function(index, element) {
                var name = element.name
                var dish_type = element.type.toLowerCase()

                if (meal_type === "jantar") {
                    if ($('#' + weekday + '-' + meal_type).length != 0) {
                        $('#' + weekday + '-' + meal_type).html(name);
                    } else {
                        $('#alert').show();
                        $('#alert').append('<p>' + 'Weird value! Day: ' + day + ', Meal: ' + meal_type + ', Dish: ' + dish_type + ', with name: ' + name + '</p>');
                        console.error("Weird value! Day: " + day + ", Meal: " + meal_type + ", Dish: " + dish_type + ", with name: " + name);
                    }
                } else {
                    if ($('#' + weekday + '-' + dish_type).length != 0) {
                        $('#' + weekday + '-' + dish_type).html(name);
                    } else {
                        $('#alert').show();
                        $('#alert').append('<p>' + 'Weird value! Day: ' + day + ', Meal: ' + meal_type + ', Dish: ' + dish_type + ', with name: ' + name + '</p>');
                        console.error("Weird value! Day: " + day + ", Meal: " + meal_type + ", Dish: " + dish_type + ", with name: " + name);
                    }
                }
            });
        });
    });

    var maxDate = new Date(Math.max.apply(null, dates));
    var minDate = new Date(Math.min.apply(null, dates));

    $('#week-info').html(formatDateString(minDate) + " to " + formatDateString(maxDate))
}

function isToday(date) {
    var today = new Date();
    return date.toDateString() === today.toDateString();
}

function formatDateString(date) {
    return date.getDate() + "/" + months[date.getMonth()] + "/" + date.getFullYear();
}

function resetInfo() {
    $('#week-info').html('');
    $('td');
    $('#alert').html('-');
    $('#alert').hide();
}