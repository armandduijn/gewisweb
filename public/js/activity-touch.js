Activity= {};

Activity.Touch = {};
Activity.Touch.activities = [];

Activity.Touch.init = function () {
    $('.btn-keypad').each(function (index) {
        $(this).click(function() {
            var number = $(this).val();
            var lidnr = $('#lidnrInput').val();
            var pincode = $('#pinInput').val();
            if(number < 0) {
                //backspace
                if(pincode.length > 0) {
                    $('#pinInput').val(pincode.substr(0, pincode.length - 1));
                } else if(lidnr.length > 0) {
                    $('#lidnrInput').val(lidnr.substr(0, lidnr.length - 1));
                }
            } else {
                if(lidnr.length < 4 || (lidnr.length < 5 && lidnr.charAt(0) == '1')) {
                    $('#lidnrInput').val( lidnr + number);
                } else if (pincode.length < 4) {
                    $('#pinInput').val(pincode + number);
                }

                if (pincode.length == 3) {
                    Activity.Touch.Login(lidnr, pincode + number);
                }
            }
        });
    });

    $('#loginModal').on('hidden.bs.modal', function () {
        $('#lidnrInput').val('');
        $('#pinInput').val('');
    });
    Activity.Touch.fetchActivities();
    $('#activityList').on( 'tap', 'tr', function() {
        Activity.Touch.showActivity($( this ).data('activity-index'));
    });
};

Activity.Touch.Login = function(lidnr, pincode) {
    console.log(lidnr, pincode);
    $("#loginFailed").hide();
    $.post(URLHelper.url('user/pinlogin'), {'lidnr': lidnr, 'pincode': pincode}, function (data) {
        if(data.login) {
            $('#loginModal').modal('hide');
        } else {
            $("#loginFailed").show();
        }
    });
};


Activity.Touch.fetchActivities = function () {
    $.getJSON(URLHelper.url('activity_api/list'), function (data) {
       Activity.Touch.activities = data;
        $.each(data, function(index, activity) {
            $('#activityList').append(
                '<tr data-activity-index="' + index + '">'
                + '<td>' + activity.beginTime.date.replace(':00.000000', '') + '</td>'
                + '<td>' + activity.endTime.date.replace(':00.000000', '') + '</td>'
                + '<td>' + activity.name + '</td>'
                + '<td>' + activity.costs + '</td>'
                + '</tr>'
            );
        });
        });
};

Activity.Touch.showActivity = function (index) {
    var activity = Activity.Touch.activities[index];
    $('#activityModal').modal('show');
    $('#activityModalLabel').html(activity.name);
    $('#activityDescription').html(activity.description);
    $('#activityDateTime').html(activity.beginTime.date.replace(':00.000000', ''));
    $('#activityLocation').html(activity.location);
    $('#activityCosts').html(activity.costs);
    $('#activityAttendeeCount').html(activity.attendees.length);

};