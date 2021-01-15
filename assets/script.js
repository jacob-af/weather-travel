const apiKey = "9a0309c7af4ea96821317cd0a1f455e1";

$(document).ready(function () {
  let savedSearches = JSON.parse(localStorage.getItem("savedsearches")) || [];

  const addButton = (search) => {
    let saveDiv = $("<div>").addClass("btn-holder");
    let saveButton = $("<button>")
      .addClass("btn saveBtn")
      .attr("id", search.toLowerCase())
      .html(search);
    $(saveDiv).append(saveButton);
    $(".search-btns").prepend(saveDiv);
  };

  const getWeatherData = (searchTerm) => {
    $("#five-day").empty();
    $.ajax({
      url: `https://api.opencagedata.com/geocode/v1/json?q=${searchTerm}&key=002e3e542cd346bd8896826266e41685`,
      method: "GET",
    }).then(function (data) {
      let lat = data.results[0].geometry.lat;
      let long = data.results[0].geometry.lng;
      $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=${apiKey}`,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        $(".city").html(searchTerm);
        updateList(searchTerm);
        renderSingleDay(response.current);
        response.daily.splice(5);

        response.daily.map((day) => renderDays(day));
        savedSearches.splice(10);
        localStorage.setItem("savedsearches", JSON.stringify(savedSearches));
      });
    });
  };

  const updateList = (searchTerm) => {
    let listIndex = savedSearches.findIndex((search) => search === searchTerm);
    if (listIndex === -1) {
      savedSearches.push(searchTerm);
      addButton(searchTerm);
    } else {
      savedSearches.splice(listIndex, 1);
      savedSearches.push(searchTerm);
      $(".search-btns").empty();
      savedSearches.map((search) => addButton(search));
    }
  };

  const renderSingleDay = (data) => {
    $(".temp").text(Math.floor((data.temp - 273) * 1.8 + 33));
    $(".date").text(dayjs.unix(data.dt).format("dddd, MMMM D, YYYY h A"));
    $(".icon").attr(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    $(".humidity").text(data.humidity);
    $(".uv-index").text(data.uvi);
    setUV(data.uvi);
  };

  const renderDays = (day) => {
    let dayColumn = $("<card>").addClass("card singleDay");
    let iconDiv = $("<div>").addClass("five-day-icon");
    let icon = $("<img>").attr(
      "src",
      `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
    );
    $(iconDiv).html(icon);
    let dateDiv = $("<div>")
      .addClass("five-day-date")
      .text(dayjs.unix(day.dt).format("ddd, MMM D"));
    let tempDiv = $("<div>")
      .addClass("five-day-temp")
      .text(Math.floor((day.temp.day - 273) * 1.8 + 33));
    let degree = $("<span>").html("&#x2109;");
    $(tempDiv).append(degree);
    let humidityDiv = $("<div>")
      .addClass("five-day-humiditiy")
      .text(day.humidity);
    $(dayColumn).append(iconDiv, dateDiv, tempDiv, humidityDiv);
    $("#five-day").append(dayColumn);
  };

  const setUV = (uvIndex) => {
    if (uvIndex < 2) {
      $(".badge").css("background-color", " #29cc91");
    } else if (uvIndex < 8) {
      $(".badge").css("background-color", "#FEFF38");
    } else {
      $(".badge").css("background-color", "#D14E53");
    }
  };

  $("#search-btn").on("click", (e) => {
    e.preventDefault();
    let searchTerm = $("#searchField").val().trim().toUpperCase();
    getWeatherData(searchTerm);
  });

  $(".search-btns").on("click", (e) => {
    e.preventDefault();
    getWeatherData(e.target.id.toUpperCase());
  });

  savedSearches.map((search) => addButton(search));
  getWeatherData(savedSearches[savedSearches.length - 1]);

  // function getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showPosition);
  //   } else {
  //     $(".location").html("Geolocation is not supported by this browser.");
  //   }
  // }

  //   function showPosition(position) {
  //     $("#location").html(
  //       "Latitude: " +
  //         position.coords.latitude +
  //         "<br>Longitude: " +
  //         position.coords.longitude
  //     );
});
