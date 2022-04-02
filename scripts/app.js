const eventApp = {};

//consumer key: fhu2YqTVmuailwGncJP1AepG4JgCzgk9

eventApp.rootUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
eventApp.apikey = "fhu2YqTVmuailwGncJP1AepG4JgCzgk9";

eventApp.init = function(){

    eventApp.displayEvents();

    // eventApp.getEvents("Toronto", "Sports", "2022-04-03T07:00:00Z","2022-12-06T00:00:00Z");
};


// function to get the data from the API using user selected city, category and date
eventApp.getEvents = function(city,category,startDate,endDate){
    const url = new URL(eventApp.rootUrl);
    url.search = new URLSearchParams({
        apikey: eventApp.apikey,
        city: city, //will get from user - drop down
        classificationName: category, //will get from user - drop down
        startDateTime: startDate,  
        endDateTime: endDate,
        sort: "date,asc",
    });

    fetch(url).then(response=>response.json())
    .then(jsonResponse => {
        console.log(jsonResponse);
        // console.log(jsonResponse["_embedded"]["events"]);
    });
}


//function to retrieve user selections upon form submission, and retrieve events from API
eventApp.displayEvents = function(){
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event){
        event.preventDefault();
        const selectedCity = document.querySelector("select[name=cityName]");
        console.log(selectedCity);
    });
}


eventApp.init();