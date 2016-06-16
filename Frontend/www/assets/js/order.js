function initialize()  {
    function checkName(){
        var r = /^[А-Яа-я]+$/;
        if (r.test($('#inputName').val())) {
            $(".name-help-block").hide();  
            $(".name-group").removeClass("has-error");  
            $(".name-group").addClass("has-success");  
            return true;
        } else {
            $(".name-help-block").show();
            $(".name-group").addClass("has-error");
            $(".name-group").removeClass("has-success");
            return false;  
        }
    }

	$('#inputName').on('input', checkName);

    function checkPhone(){
        //+380994010999
        var r = /^(\+38)?0\d{9}$/;
        if (r.test($('#inputPhone').val())) {
            $(".phone-help-block").hide();
            $(".phone-group").removeClass("has-error");  
            $(".phone-group").addClass("has-success");  
            return true;           
        } else {
            $(".phone-help-block").show();
            $(".phone-group").removeClass("has-error");  
            $(".phone-group").addClass("has-success"); 
            return false;
        }
    }

    $('#inputPhone').on('input', checkPhone);

    var request;

    // Bind to the submit event of our form
    $("#foo").submit(function(event){

        // Abort any pending request
        if (request) {
            request.abort();
        }
        // setup some local variables
        var $form = $(this);

        $("#priceInput").val($("#priceFinalle").html());
        
        // Let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");

        // Serialize the data in the form
        var serializedData = $form.serialize();

        // Let's disable the inputs for the duration of the Ajax request.
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop("disabled", true);

        // Fire off the request to /form.php
        request = $.ajax({
            url: "/api/create-order/",
            type: "post",
            data: serializedData
        });

        // Callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR){
            // Log a message to the console
            console.log("Hooray, it worked!");
            console.log(response);
            if (response.success){
                window.location = response.link;
            }
        });

        // Callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown){
            // Log the error to the console
            console.error(
                "The following error occurred: "+
                textStatus, errorThrown
            );
        });

        // Callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            // Reenable the inputs
            $inputs.prop("disabled", false);
        });

        // Prevent default posting of form
        event.preventDefault();
    });

    $('.next-step-button').click(function(){
        if ($(".address-group").hasClass("has-success") && $(".phone-group").hasClass("has-success") && $(".name-group").hasClass("has-success")){ 
            $("#foo").submit();
        } else {
            checkAdress();
            checkPhone();
            checkName();
        }
    });

    function checkAdress(){
        var a = $('#inputAdress').val();
        geocodeAddress(a, function(err, latLng){
            if (err){
                $(".address-help-block").hide();
                $(".address-group").addClass("has-error");  
                $(".address-group").removeClass("has-success");
                return false;
            } else {
                geocodeLatLng(latLng, function(err, adress){
                    $('#addressFinale').html(adress);
                    $(".address-help-block").hide();
                    $(".address-group").removeClass("has-error");  
                    $(".address-group").addClass("has-success");
                });
                calculateRoute(point, latLng, function(err, res){
                    if (err){
                        console.log("oshibka");
                        console.log(err);
                        //TODO handle error
                        return;
                    }
                    $("#timeFinale").html(Math.round(res.duration.value / 60) + " хв.");
                });
                return true;
            }
        });
    }

    $('#inputAdress').on('input', checkAdress);
    
    var mapProp = {
        center : new google.maps.LatLng(50.464379, 30.519131),
        zoom : 12
    };
    var html_element = document.getElementById("googleMap");
    var map = new google.maps.Map(html_element, mapProp);
    

    var point = new google.maps.LatLng(50.464379, 30.519131);

    function geocodeLatLng(latlng, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'location': latlng
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[1]) {
                var adress = results[1].
                formatted_address;
                callback(null, adress);
            } else {
                callback(new Error("Can't find adress "));
            }
        });
    }

    function geocodeAddress(address, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                var coordinates = results[0].geometry.location;
                callback(null, coordinates);
            } else {
                callback(new Error("Can not find the adress "));
            }
        });
    }

    var dro = {suppressMarkers: true};

    var directionsDisplay = new google.maps.DirectionsRenderer(dro);

    function calculateRoute(A_latlng, B_latlng, callback) {
        var directionService = new google.maps.DirectionsService();
        directionService.route({
            origin: A_latlng,
            destination: B_latlng,
            travelMode: google.maps.TravelMode["DRIVING"]
        }, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var leg = response.routes[0].legs[0];
                callback(null, {
                    duration: leg.duration
                });
                if (directionsDisplay){
                    directionsDisplay.setMap(null);
                    directionsDisplay = null;
                    directionsDisplay = new google.maps.DirectionsRenderer(dro);
                }
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
                callback(new Error("Cannot find direction"));
            }
        });
    }

    google.maps.event.addListener(map, 'click',function(me){
        geocodeLatLng(me.latLng, function(err, adress){
            if (err){
                $(".address-group").addClass("has-error");  
                $(".address-group").removeClass("has-success");
            } else {
                //var homePoint = new google.maps.LatLng(me.latLng.lat, me.latLng.lng);
                console.log(point);
                calculateRoute(point, me.latLng, function(err, res){
                    if (err){
                        console.log("oshibka");
                        console.log(err);
                        //TODO handle error
                        return;
                    }
                    //console.log(res.duration);
                    $("#timeFinale").html(Math.round(res.duration.value / 60)  + " хв.");
                });
                $('#inputAdress').val(adress);
                $('#addressFinale').html(adress);
                $(".address-group").removeClass("has-error");  
                $(".address-group").addClass("has-success");
            }
        });
    });

}

google.maps.event.addDomListener(window, 'load', initialize);