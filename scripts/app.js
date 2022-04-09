const eventApp = {};

eventApp.rootUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
eventApp.apikey = "fhu2YqTVmuailwGncJP1AepG4JgCzgk9";

eventApp.init = function(){

    eventApp.getUserInput();
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
        // console.log(jsonResponse["_embedded"]["events"]);
        eventApp.displayEvents(jsonResponse["_embedded"]["events"]);
    });
}

// added createEventInfo function to minimize code in displayEvents function
eventApp.createEventInfo = function(eventListing){
    const eventInfo = document.createElement("div");
        eventInfo.classList.add("eventInfo");

        // some listings are missing properties (e.g. price, description),
        // added try-catch blocks to catch these errors and display an alternative

        const name = document.createElement("h2");
        try {
            name.innerText = eventListing.name;
        } catch {
            name.innerText = "";
        }

        const venue = document.createElement("p");
        try {
            venue.innerText = `Venue: ${eventListing._embedded.venues[0].name}`;
        } catch {
            venue.innerText = `Venue: N/A`;
        }

        const date = document.createElement("p");
        try {
            date.innerText = `Date: ${eventListing.dates.start.localDate}`;
        } catch {
            date.innerText = `Date: N/A`;
        }

        //API returns military time, code block created to display time in a user friendly format
        const time = document.createElement("p");
        try {

            const timeText = (eventListing.dates.start.localTime).split(":")

            let timeHours = timeText[0]
            let timeMinutes = timeText[1]
            let timeOfDay = "AM"

            if (timeHours >= 12) {
                timeOfDay = "PM"
                if (timeHours > 12) {
                    timeHours -= 12
                }
            }

            time.innerText = `Time: ${timeHours}:${timeMinutes} ${timeOfDay}`;
        } catch {
            time.innerText = `Time: Unknown`;
        }

        const price = document.createElement("p");
        try{
            price.innerText = `Price Range: $${Math.round(eventListing.priceRanges[0].min)} - $${Math.round(eventListing.priceRanges[0].max)}`; //rounded pricing to nearest dollar
        } catch{
            price.innerText=`Price: N/A`;
        }

        const description = document.createElement("p");
        try {
            const fullDescription = eventListing.description;
            const parsedDescription = fullDescription.split(/\r?\n/);
            description.innerText = parsedDescription[0];
        } catch {
            description.innerText = ``;
        }

        eventInfo.append(name, venue,date,time,price,description);

        const buttonDiv = document.createElement("div");
        buttonDiv.innerHTML = `
            <button class="button">Seat Map</button>`
        eventInfo.appendChild(buttonDiv);

        return eventInfo
}

eventApp.displayEvents = function(events) {

    document.querySelector(".resultsContainer").innerHTML = "";

    events.forEach(eventListing => {
        const listItem = document.createElement("li");
        listItem.classList.add("resultsListItem");       

        const eventImage = document.createElement("div");
        eventImage.classList.add("eventImage");

        const image = document.createElement("img");
        image.src = eventListing.images[0].url;
        image.alt = eventListing.name;

        
        eventImage.appendChild(image);
        const eventInfoDiv = eventApp.createEventInfo(eventListing)
        listItem.appendChild(eventImage);
        listItem.appendChild(eventInfoDiv);
        
        document.querySelector(".resultsContainer").appendChild(listItem);
    });
}


//function to retrieve user selections upon form submission, and retrieve events from API
eventApp.getUserInput = function(){
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event){
        event.preventDefault();
        const selectedCity = document.querySelector("select[name=cityName]").value;
        const selectedCategory = document.querySelector(
        "select[name=categoryName]").value;
        const startDate = document.querySelector("input[name=startDate]").value + "T06:00:00Z";
        const endDate =document.querySelector("input[name=endDate]").value + "T07:00:00Z";
        
        if (endDate<startDate){
            alert("error");
        }

        eventApp.getEvents(selectedCity, selectedCategory,startDate,endDate);
    });
};

eventApp.init();