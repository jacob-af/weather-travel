const apiKey = "9a0309c7af4ea96821317cd0a1f455e1";

$(document).ready(function () {
  let savedSearches = JSON.parse(localStorage.getItem("savedsearches")) || [];
  $("#search-btn").on("click", (e) => {
    e.preventDefault();
    let searchTerm = $("#searchField").val().trim();
    $(".city").html(searchTerm.toUpperCase());
    let saveButton = $("<div>")
      .addClass("col-2 saveBtn")
      .attr("save", searchTerm)
      .html(searchTerm.toUpperCase());
    $(".search-btns").prepend(saveButton);
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
        savedSearches.unshift(searchTerm);
        $(".temp").text(response.current.temp);
        $(".date").text(
          dayjs.unix(response.current.dt).format("dddd, MMMM D, YYYY h A")
        );
        $(".icon").attr(
          "src",
          `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`
        );
        $(".humidity").text(response.current.humidity);
        $(".uv-index").text(response.current.uvi);

        response.daily.splice(5);
        localStorage.setItem("savedsearches", JSON.stringify(savedSearches));
      });

      a;
    });
  });

  //   function getLocation() {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(showPosition);
  //     } else {
  //       $(".location").html("Geolocation is not supported by this browser.");
  //     }
  //   }

  //   function showPosition(position) {
  //     $("#location").html(
  //       "Latitude: " +
  //         position.coords.latitude +
  //         "<br>Longitude: " +
  //         position.coords.longitude
  //     );

  //     $.ajax({
  //       url: `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}`,
  //       method: "GET",
  //     }).then(function (response) {
  //       //console.log(response);
  //       //$("#city").text(response.city.name);
  //       //$(".temp").text(response.main.temp);
  //     });
  //   }
});
