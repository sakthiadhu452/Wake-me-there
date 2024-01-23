var flagg=0;
const dismeter=document.querySelector(".dismeter");
let script = document.createElement("script");
var gettedplace = "";
var gettedrange,gettedMusic,gettedVibration;
var map, watchId, userPin, directionsManager, routePath, loc;
const loadingIndicator = document.getElementById('loadingIndicator');
const myMapDiv = document.querySelector('.mymapdiv');
const bingKey = "AgEPS9jspIBwBSS-c2SNyiq6jIadG5Kx_MdYlLJAfZl5fnZlp0JzAoWmHSDsjuQs";
const elem = document.body;
const fullscreendiv=document.querySelector(".fullscreenbox");
var alertInterval;
var audio=decodeURIComponent(getQueryParam("music"));
var vibratelevel=decodeURIComponent(getQueryParam("vibrate"));




// for opening ullscreen
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}



// styles
document.querySelector(".skipbtn").addEventListener("click",()=>{
    fullscreendiv.style.display="none";
})

document.querySelector(".setfullscn").addEventListener("click",()=>{
    openFullscreen();
    
    fullscreendiv.style.display="none";
})










// When actual API loads remove the loading effect
script.onload = function () {
    loadingIndicator.style.display = 'none'; // Hide loading indicator on successful script load
    myMapDiv.style.display = 'block'; // Show the map content after script is loaded
    GetMa(); // Call your function after the script is loaded
};
script.setAttribute("src", `https://www.bing.com/api/maps/mapcontrol?callback=GetMa&key=${bingKey}`);
document.body.appendChild(script);











// append map to body


function GetMa() {
    document.querySelector(".alert_on").querySelector("audio").src="../Src/"+audio+".wap";
    map = new Microsoft.Maps.Map('#myMap', {});
    map.setView({
        heading:45,
        zoom: 10,
        
    });
    
    Microsoft.Maps.loadModule(['Microsoft.Maps.Directions', 'Microsoft.Maps.SpatialMath'], function () {
        //Create an instance of the directions manager.
        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        directionsManager.setRequestOptions({
            routeMode: Microsoft.Maps.Directions.RouteMode.driving,
            routeDraggable: false
        })
        //Define direciton options that you want to use, that won't be reset the next time a route is calculated.

        //Set the request options that avoid highways and uses kilometers.
        directionsManager.setRequestOptions({
            distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
            routeAvoidance: [Microsoft.Maps.Directions.RouteAvoidance.avoidLimitedAccessHighway]
        });

        //Make the route line thick and green.
        directionsManager.setRenderOptions({
            drivingPolylineOptions: {
                strokeColor: 'blue',
                strokeThickness: 6
            }
        });

        Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (e) {
            directionsUpdated(e);
        });
    
        

    });
    GetMap();
}




function directionsUpdated(e) {
    //When the directions are updated, get a polyline for the route path to perform calculations against in the future.
    var route = directionsManager.getCurrentRoute();
    
    if (route && route.routePath && route.routePath.length > 0) {
        document.querySelector(".mymapdiv").style.display = "block";
        document.querySelector(".loader").style.display = "none";
        routePath = new Microsoft.Maps.Polyline(route.routePath);
        changeDismeter();
    }
    if(flagg==0){
        fullscreendiv.style.display="flex";
        flagg=1;
    }
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function GetMap() {
    document.querySelector(".mymapdiv").style.display = "none";

    

    // Function to get the value of a query parameter by its name

    // Get the decoded value of the "place" parameter
    const decodedPlace = decodeURIComponent(getQueryParam("place"));
    const decodedRange = decodeURIComponent(getQueryParam("range"));

    // Now you can use the decodedPlace and decodedRange variables as needed
    gettedplace = decodedPlace;
    gettedrange = decodedRange;
    // alert(decodedRange);
    startTracking();


}






function startTracking() {
    navigator.geolocation.clearWatch(watchId);
    map.entities.clear();
    clearDirections();
    userPin = new Microsoft.Maps.Pushpin(map.getCenter(), { visible: false });
    map.entities.push(userPin);

    
    // Set up a watchPosition to continuously monitor the user's location
    var watchId = navigator.geolocation.watchPosition(usersLocationUpdated,error => console.error("Error:", error));
    var watchId = navigator.geolocation.watchPosition(changeDismeter);
}




var flagcenter = 0;
var updateDismeterPromise;

function usersLocationUpdated(position) {
    loc = new Microsoft.Maps.Location(
        position.coords.latitude,
        position.coords.longitude);
        userPin.setLocation(loc);
        userPin.setOptions({ visible: true });
    if (flagcenter === 0) {
        flagcenter = 1;
        map.setView({
            center: loc
        });
    }

    // If there is an existing updateDismeterPromise, cancel it
    if (updateDismeterPromise) {
        clearTimeout(updateDismeterPromise);
    }

    // Use a setTimeout to simulate an asynchronous update
    updateDismeterPromise = setTimeout(() => {
        if (!routePath || Microsoft.Maps.SpatialMath.distance(loc, routePath) > 50) {
            calculateRoute(loc, gettedplace);
        }
        changeDismeter();
    }, 500); // Adjust the timeout duration as needed
}






function calculateRoute(userLocation, destination) {
    // Create waypoints to route between.
    directionsManager.clearAll();
    directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({
        location: userLocation
    }));
    directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({
        address: destination
    }));

    // Calculate directions.
    Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function (arg) {
        // Handle error here, for example, display an error message.
        setTimeout(redirect, 3000);
        alert("error finding route we are redirecting...");

        function redirect() {
            window.location.href = "index.html";
        }
    });
    directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });
    directionsManager.calculateDirections({
        errorCallback: function (e) {
            // Handle error here, for example, display an error message.
            alert('Error calculating directions. Please try again.');
        }
    });
}




async function changeDismeter() {
    var selectedRoutes = document.querySelector(".drTitle.selected");
    dismeter.innerHTML = selectedRoutes.querySelector('[data-tag="descriptionDistance"]').innerHTML;

    // Simulate an asynchronous update
    await new Promise(resolve => setTimeout(resolve, 500));

    checkForAlert();
}

function checkForAlert() {
    // The rest of the code remains unchanged
    var dismeterContent = dismeter.innerHTML;
    var dismeterValue = parseInt(dismeterContent.split(" ")[0]);

    if (!isNaN(dismeterValue) && dismeterValue < gettedrange) {
        makeALert();
    }
}


function clearDirections() {
    if (directionsManager) {
        // Clear directions waypoints and display without clearing its options.
        directionsManager.clearDisplay();

        var wp = directionsManager.getAllWaypoints();
        if (wp && wp.length > 0) {
            for (var i = wp.length - 1; i >= 0; i--) {
                this.directionsManager.removeWaypoint(wp[i]);
            }
        }

        routePath = null;
    }
}








    function makeALert() {
        document.querySelector(".alert_on").style.display="flex";
        document.querySelector(".alert_on").querySelector("audio").play();
        
        clearInterval(alertInterval);
        makeVibrate();
    }
  

    function makeVibrate(){
      navigator.vibrate(vibratelevel)
    }








document.querySelector(".startbtncl").addEventListener("click", () => {
    window.location.href = "../IndexPage/index.html";
})

window.onload(()=>{
    
    document.querySelector(".alert_on").querySelector("audio").src="../Src/"+audio+".wap";
    document.querySelector(".alert_on").querySelector("audio").pause();

})




function StopSiren(){
    window.location.href="../index.html";
}