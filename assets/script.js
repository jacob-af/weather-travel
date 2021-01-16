$(document).ready(function () {
  const apiKey = "9a0309c7af4ea96821317cd0a1f455e1";

  // loads saved searches or defaults to Detroit
  let savedSearches = JSON.parse(localStorage.getItem("savedsearches")) || [
    "DETROIT",
  ];

  // Creates Buttons for Previous saved locations
  const addButton = (search) => {
    let saveDiv = $("<div>").addClass("btn-holder");
    let saveButton = $("<button>")
      .addClass("btn saveBtn")
      .attr("id", search.toLowerCase())
      .html(search);
    $(saveDiv).append(saveButton);
    $(".search-btns").prepend(saveDiv);
  };

  // API calls to Weather Twicw
  const getWeatherData = (searchTerm) => {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${apiKey}`,
      method: "GET",
    })
      .then(function (data) {
        // Convert location data for one call API
        let lat = data.city.coord.lat;
        let long = data.city.coord.lon;
        // Display City and Country
        $(".five-day").empty();
        let city = data.city.name.toUpperCase() + ", " + data.city.country;
        $(".city").html(city);
        $.ajax({
          url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=${apiKey}`,
          method: "GET",
        }).then(function (response) {
          updateList(searchTerm);
          renderSingleDay(response.current);
          //Adjust to only 5 day forecast
          response.daily.splice(5);
          response.daily.map((day) => renderDays(day));
          localStorage.setItem("savedsearches", JSON.stringify(savedSearches));
        });
      })
      .catch(function () {
        $("#searchField").val("TRY AGAIN, DUDE!");
      });
  };

  // Update list of Saved Searches
  const updateList = (searchTerm) => {
    //Check if search is already in list
    let listIndex = savedSearches.findIndex((search) => search === searchTerm);
    if (listIndex === -1) {
      if (savedSearches.length > 9) {
        savedSearches.shift();
      }
    } else {
      savedSearches.splice(listIndex, 1);
    }
    $(".search-btns").empty();
    savedSearches.push(searchTerm);
    savedSearches.map((search) => addButton(search));
    localStorage.setItem("savedsearches", JSON.stringify(savedSearches));
  };

  // Fill in data to main display
  const renderSingleDay = (data) => {
    $(".temp").text(Math.floor((data.temp - 273) * 1.8 + 33));
    $(".date").text(dayjs.unix(data.dt).format("dddd, MMMM D, YYYY h A"));
    $(".icon").attr(
      "src",
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    $(".humidity").text(data.humidity);
    $(".uv-index").text(data.uvi);
    setUV(data.uvi);
  };

  // Construct forecast card
  const renderDays = (day) => {
    let dayColumn = $("<card>").addClass("card singleDay");
    let iconDiv = $("<div>").addClass("five-day-icon");
    let icon = $("<img>").attr(
      "src",
      `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
    );
    $(iconDiv).html(icon);
    let dateDiv = $("<div>")
      .addClass("five-day-text")
      .text(dayjs.unix(day.dt).format("ddd, MMM D"));
    let tempDiv = $("<div>")
      .addClass("five-day-text")
      .text(Math.floor((day.temp.day - 273) * 1.8 + 33));
    let degree = $("<span>").html("&#176;F");
    $(tempDiv).append(degree);
    let humidityDiv = $("<div>").addClass("five-day-text").text("Humidity: ");
    let humiditySpan = $("<span>").html(day.humidity);
    $(humidityDiv).append(humiditySpan);
    $(dayColumn).append(iconDiv, dateDiv, tempDiv, humidityDiv);
    $(".five-day").append(dayColumn);
  };

  // Adjusts color for UV Index
  const setUV = (uvIndex) => {
    if (uvIndex < 2) {
      $(".badge").css("background-color", " #29cc91");
    } else if (uvIndex < 8) {
      $(".badge").css("background-color", "#FEFF38");
    } else {
      $(".badge").css("background-color", "#D14E53");
    }
  };

  // Event Listener for main search button
  $("#search-btn").on("click", (e) => {
    e.preventDefault();
    let searchTerm = $("#searchField").val().trim().toUpperCase();
    getWeatherData(searchTerm);
  });
  // event listeners for saved searches
  $(".search-btns").on("click", (e) => {
    e.preventDefault();
    getWeatherData(e.target.id.toUpperCase());
  });

  // Displays saved searches and makes initial API call
  savedSearches.map((search) => addButton(search));
  getWeatherData(savedSearches[savedSearches.length - 1]);
});
