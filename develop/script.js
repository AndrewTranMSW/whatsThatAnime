//Foundation API
$(document).foundation();

//anime-info div that contains info about the anime searched
var synopsisText = document.getElementById("synopsis-text");
var episodeInfoText = document.getElementById("episode-info-text");
var ratingInfoText = document.getElementById("rating-info-text");
var airDateInfoText = document.getElementById("air-date-info-text");
var animeInfoText = document.getElementById("anime-info-text");
var viewMoreText = document.getElementById("view-more-text");
var episodeNumberText = document.getElementById("episode-number-text");
var episodeNumber = document.querySelectorAll("#episode-number");
var anime;

//Variable for the cards that displays similar Anime
var cells = document.querySelectorAll(".options");
var cardOptions = document.querySelector(".grid-container");
var cardButton = document.querySelectorAll(".card-btn");
var aniBtns = document.querySelectorAll(".aniBtn");
var aniImages = document.querySelectorAll(".imageTest");
var animeTitle = document.querySelectorAll("#anime-title");
var similarityText = document.querySelectorAll("#sim");

//Stored searches uses localStorage for previously searched Anime
var storedSearches = [];
var objValues = [];
//Stored values for localStorage of Animes. Used for setItem and getItem
var storedAnime = [];
//Variables for both the anime information section and Gif container section for the HTML where anime info and gifs will be displayed
var container = document.querySelector(".container-anime-info");
var gifContainer = document.querySelector("#gifs");

//Function for Giphy API that utilizes the info gathered from Trace.moe and inputs this data to search for gifs related to the searched Anime. Gifs will be displayed in a container.
function getGiphyApi(name) {
  gifContainer.innerHTML = "";
  var giphyRequestURL =
    "https://api.giphy.com/v1/gifs/search?api_key=n2y3Fcb9H0LUrjbN7SJui121LbMZIq8g&q=" +
    name;
  fetch(giphyRequestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      data.data.forEach(function (gif) {
        let gifEl = document.createElement("img");
        gifEl.setAttribute("src", gif.images.fixed_height.url);
        gifContainer.append(gifEl);
      });
      container.classList.remove("hide");
    });
}

// Function executes api call taking in a url
// Only defined once assuming all the data we grab will be the same
function fetchTraceAPI(url) {
  fetch(
    `https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(
      `${url}`
    )}`
  )
    .then(function (response) {
      return response.json();
    })
    .then((res) => {
      loadingDots.classList.add("hide");
      var obj = {};
      aniName.innerHTML = res.result[0].anilist.title.romaji;
      anime = res.result[0].anilist.title.romaji;
      appendAnime(res);
      pic.appendChild(uploaded_pic);
      getGiphyApi(anime);
      aniSearch(anime);
      return anime;
    })
    .then((anime) => {
      if (!storedSearches.includes(anime)) {
        storedSearches.unshift(anime);
        var obj = {};
        obj["name"] = anime;
        obj["url"] = url;
        storedAnime.push(obj);
        localStorage.setItem("Animes", JSON.stringify(storedAnime));
        localStorage.setItem("Searches", JSON.stringify(storedSearches));
        storage();
      }
    });
}

// fetch request for downloaded file
var pic = document.getElementById("theAnimePic");
var aniName = document.getElementById("theAnimeName");
var uploaded_pic = document.createElement("img");

//This function runs the Trace.moe api to search for the Anime of the image. If it's not an image file, the user will be prompted by an alert window. This function also will provide suggestions of other Anime based on similarity percentage info provided by Trace.Moe.
function imageData(image) {
  aniName.innerHTML = "LOADING";

  // followed steps on api doc
  const formData = new FormData();
  formData.append("image", image);
  loadingDots.classList.remove("hide");
  //first fetch gets basic guess on the stored file image
  fetch("https://api.trace.moe/search", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error != "") {
        return alert(
          "Even we don't know that anime! Double check your URL or make sure an image file was selected and try again!"
        );
      }
      // at this point, we have the data but to get any additional information about the anime, we need a url
      // this first fetch allows us to grab a url to then run another fetch request.
      let url = data.result[0].image;
      uploaded_pic.src = url;
      // second fetch gets extra data
      cardOptions.classList.remove("hide");
      fetchTraceAPI(url);
    });
}

// Custom drag and drop section for users to upload images on the application
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(".image-upload-wrap").hide();
      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();
      $(".image-title").html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);
    imageData(input.files[0]);
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}
$(".image-upload-wrap").bind("dragover", function () {
  $(".image-upload-wrap").addClass("image-dropping");
});
$(".image-upload-wrap").bind("dragleave", function () {
  $(".image-upload-wrap").removeClass("image-dropping");
});

//Jikan API. This is called in the fetchTraceAPI function. This API will provide additional Anime information to the end-user.
function aniSearch() {
  //We rely on the name of the anime from Trace.Moe to be searched for in the Jikan API.
  fetch("https://api.jikan.moe/v3/search/anime?q=" + anime)
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      //Variable to create a link element for viewing more info on myanimelist
      var animeListLink = document.createElement("a");
      animeInfoText.textContent = myJson.results[0].title;
      episodeInfoText.textContent = myJson.results[0].episodes;
      ratingInfoText.textContent = myJson.results[0].rated;
      airDateInfoText.textContent = myJson.results[0].start_date;
      synopsisText.textContent = myJson.results[0].synopsis;
      //new link created and appended to the view-more-text ID.
      animeListLink.textContent = "View more info on MyAnimeList";
      animeListLink.setAttribute("href", myJson.results[0].url);
      animeListLink.setAttribute("target", "_blank");
      viewMoreText.innerHTML = "";
      viewMoreText.append(animeListLink);
    });
}

//This function utilizes the localStorage from previously searched Anime. The searches will be stored locally and will dislpay on page load in a window for users to quickly refer to. The data will be displayed as buttons that are able to be clicked. An empty array on the innerHTML of prevSearched prevents data replication.
var prevSearched = document.querySelector("#list");
function storage() {
  prevSearched.innerHTML = "";
  storedAnime = JSON.parse(localStorage.getItem("Animes")) || [];
  storedSearches = JSON.parse(localStorage.getItem("Searches")) || [];
  storedAnime.map((item) => {
    let li = document.createElement("button");
    li.setAttribute("class", "previous button");
    li.setAttribute("data-value", item["url"]);
    li.textContent = item["name"];
    prevSearched.append(li);
  });
}

//This eventListener will execute upon a 'click' by the user on the previous searches. Data from the previously searched Anime will then display.
prevSearched.addEventListener("click", function (event) {
  if (event.target.matches(".previous")) {
    loadingDots.classList.remove("hide");
    uploaded_pic.setAttribute("src", event.target.getAttribute("data-value"));
    fetchTraceAPI(event.target.getAttribute("data-value"));
  }
});
//Calls the storage function
storage();

//Function for the data of the first image to be shown based on highest percentage match from Trace.moe data.
function appendAnime(firstGuess) {
  for (let i = 0; i < cells.length; i++) {
    animeTitle[i].textContent = firstGuess.result[i + 1].anilist.title.romaji;
    episodeNumber[i].textContent = firstGuess.result[i + 1].episode;
    episodeNumberText.textContent = firstGuess.result[0].episode;
    const percentage = firstGuess.result[i + 1].similarity;
    similarityText[i].textContent = Math.floor(percentage * 100);
    cardButton[i].setAttribute("data-value", firstGuess["result"][i + 1].image);
    aniImages[i].setAttribute("src", firstGuess["result"][i + 1].image);
  }
}

cardOptions.addEventListener("click", (event) => {
  if (event.target.matches(".card-btn")) {
    uploaded_pic.setAttribute("src", event.target.getAttribute("data-value"));
    fetch(
      `https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(
        `${event.target.getAttribute("data-value")}`
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        loadingDots.classList.remove("hide");
        fetchTraceAPI(event.target.getAttribute("data-value"));
      });
  }
});

//Loading dots that display when an image and it's data are being searched.
//URL entry field added for users to search images by URL as well.
var loadingDots = document.querySelector(".loading");
var inputUrl = document.querySelector(".url-input");

function urlInput() {
  let url = inputUrl.value.trim();
  loadingDots.classList.remove("hide");
  fetchTraceAPI(url);
  cardOptions.classList.remove("hide");
}
