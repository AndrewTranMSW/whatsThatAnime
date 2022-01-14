//anime-info div that contains info about the anime searched
var synopsisText = document.getElementById("synopsis-text");
var episodeInfoText = document.getElementById("episode-info-text");
var ratingInfoText = document.getElementById("rating-info-text");
var airDateInfoText = document.getElementById("air-date-info-text");
var animeInfoText = document.getElementById("anime-info-text");
var viewMoreText = document.getElementById("view-more-text");
var anime; 
// var requestURL = 'https://api.trace.moe';
// var requestURL = 'https://api.jikan.moe/v3';

function getApi(requestURL) {
    fetch(requestURL)
        .then(function (response) {
            console.log(response);
        });
}

// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible

// var query = `
// query ($id: Int) { # Define which variables will be used in the query (id)
//   Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
//     id
//     title {
//       romaji
//       english
//       native
//     }
//   }
// }
// `;

// // Define our query variables and values that will be used in the query request
// var variables = {
//     id: 15125
// };

// // Define the config we'll need for our Api request
// var url = 'https://graphql.anilist.co',
//     options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//             query: query,
//             variables: variables
//         })
//     };

// // Make the HTTP Api request
// fetch(url, options).then(handleResponse)
//                    .then(handleData)
//                    .catch(handleError);

// function handleResponse(response) {
//     return response.json().then(function (json) {
//         return response.ok ? json : Promise.reject(json);
//     });
// }

// function handleData(data) {
//     console.log(data);
// }

// function handleError(error) {
//     alert('Error, check console');
//     console.error(error);
// }

// fetch requestfor trace moe API for url 
// select each element used for fetch request
// var submitButton = document.querySelector("#submit-button");
// var imageName = document.querySelector("#imageLink");

// // event occurs when submit button is pressed
// submitButton.addEventListener("click", function(event) {
//     event.preventDefault();
//     var url = imageName.value.trim()
//     fetchTraceAPI(url);
// })
var storedSearches = [];
var objValues = [];
var storedAnime = [];
var container = document.querySelector(".container");
var gifContainer = document.querySelector("#gifs");
// &limit=25&offset=0&rating=pg-13&lang=en
function getGiphyApi(name) {
    gifContainer.innerHTML = '';
    var giphyRequestURL = 'https://api.giphy.com/v1/gifs/search?api_key=n2y3Fcb9H0LUrjbN7SJui121LbMZIq8g&q=' + name;
    fetch(giphyRequestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            data.data.forEach(function(gif) {
                let gifEl = document.createElement('img')
                gifEl.setAttribute('src', gif.images.fixed_height.url)
                gifContainer.append(gifEl)
            })
            container.classList.remove("hide");
        });
}
// function executes api call taking in a url
// only defined once assuming all the data we grab will be the same
function fetchTraceAPI(url) {
    fetch(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(`${url}`)}`)
            .then(function(response) {
                return response.json();
            })
            .then((res) => {
                appendAnime(res);
                // console.log(res);
                var obj = {};
                
                Aniname.innerHTML = res.result[0].anilist.title.romaji;
                anime = res.result[0].anilist.title.romaji;

                pic.appendChild(uploaded_pic);
                getGiphyApi(anime);
                aniSearch(anime);
                return anime;
            })
            .then((anime) => {
              // this array will have every single anime ever u try to find, bad thinking but need for now
              
              console.log(anime + " anime name");
              console.log(typeof anime)
              console.log(!storedSearches.includes(anime) + " if array contains text");
              console.log(typeof storedSearches);
              console.log(storedSearches);

              if(!storedSearches.includes(anime)){
                storedSearches.unshift(anime);
                var obj = {};
                obj["name"] = anime;
                obj["url"] = url;
                console.log(obj);
                storedAnime.push(obj);
                console.log(storedAnime);
                // store searched anime name and url
                // issue, anime name is not being transferred over
                localStorage.setItem('Animes', JSON.stringify(storedAnime));
                localStorage.setItem('Searches', JSON.stringify(storedSearches));
                storage();  
              } 

              
            });
}

// fetch request for downloaded file
var pic = document.getElementById("theAnimePic");
var Aniname = document.getElementById("theAnimeName");
var uploaded_pic = document.createElement("img");

// if want to do file need to incorporate this function somehow
const fileInput = document.getElementById("fileInput");
// fileInput.addEventListener("change", (event) => {
//     // event occurs when the value of an element has been changed.

//     const fileList = event.target.files;
//     // It's part of the File API, which is available in all modern browsers except IE9 and earlier. files is a FileList of the file(s) selected by the user in the input[type=file] element you're referencing via the id in your id variable.
//     // Each entry in the FileList is a File, which gives you the name of the file (without path information) and which can be used for accessing the files.

//     // loading text for display to show call is working
//     Aniname.innerHTML = "LOADING";
//     console.log(fileList);

//     // followed steps on api doc
//     const formData = new FormData();
//     formData.append("image", fileList[0]);

//     //first fetch gets basic guess on the stored file image
//     fetch("https://api.trace.moe/search", {
//         method: "POST",
//         body: formData,
//     }).then(response => response.json())
//     .then((data) => {
//         console.log(data);
//         // at this point, we have the data but to get any aditional information about the anime, we need a url
//         // this first fetch allows us to grab a url to then run another fetch request. 
//         let url = data.result[0].image;
//         uploaded_pic.src = url;
//         // second fetch gets extra data 
//         fetchTraceAPI(url);
//     })
// })

function imageData(image) {
    Aniname.innerHTML = "LOADING";

    // followed steps on api doc
    const formData = new FormData();
    formData.append("image", image);

    //first fetch gets basic guess on the stored file image
    fetch("https://api.trace.moe/search", {
        method: "POST",
        body: formData,
    }).then(response => response.json())
    .then((data) => {
        console.log(data);
        // at this point, we have the data but to get any aditional information about the anime, we need a url
        // this first fetch allows us to grab a url to then run another fetch request. 
        let url = data.result[0].image;
        uploaded_pic.src = url;
        // second fetch gets extra data 
        cardOptions.classList.remove("hide");
        fetchTraceAPI(url);
    })
}
// custom drag and drop section
function readURL(input) {
    if (input.files && input.files[0]) {

      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('.image-upload-wrap').hide();
  
        $('.file-upload-image').attr('src', e.target.result);
        $('.file-upload-content').show();
  
        $('.image-title').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
      imageData(input.files[0]);
    } else {
      removeUpload();
    }
  }
  
  function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
  }
  $('.image-upload-wrap').bind('dragover', function () {
          $('.image-upload-wrap').addClass('image-dropping');
      });
      $('.image-upload-wrap').bind('dragleave', function () {
          $('.image-upload-wrap').removeClass('image-dropping');
  });
  

  //Jikan API. This is called in the fetchTraceAPI
  
  function aniSearch() {
  fetch('https://api.jikan.moe/v3/search/anime?q='+anime)
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    aniStats(myJson);
    //confirms the data is pulled from Jikan API
    console.log(myJson.results[0].synopsis);
    console.log(myJson.results[0].start_date);
    console.log(myJson.results[0].rated);
    console.log(myJson.results[0].synopsis);
    console.log(myJson.results[0].title);
    console.log(myJson.results[0].url);
    //variable to create a link element for viewing more info on myanimelist
    var animeListLink = document.createElement("a")

    animeInfoText.textContent = myJson.results[0].title;
    episodeInfoText.textContent = myJson.results[0].episodes;
    ratingInfoText.textContent = myJson.results[0].rated;
    airDateInfoText.textContent = myJson.results[0].start_date;
    synopsisText.textContent = myJson.results[0].synopsis;
    //new link created and appended to the view-more-text ID.
    animeListLink.textContent = "View more info on MyAnimeList";
    animeListLink.setAttribute("href",myJson.results[0].url);
    animeListLink.setAttribute("target","_blank");
    viewMoreText.append(animeListLink);
  });
};

function aniStats(response) {
    console.log(response)
};

var prevSearched = document.querySelector("#list");
function storage() {
    prevSearched.innerHTML = '';
    storedAnime = JSON.parse(localStorage.getItem('Animes')) || [];
    storedSearches = JSON.parse(localStorage.getItem('Searches')) || [];
    storedAnime.map( item => {
        let li = document.createElement('button')
        li.setAttribute('class', 'previous button');
        li.setAttribute("data-value", item["url"]);
        li.textContent = item["name"];
        prevSearched.append(li);
        // objValues = Object.values(storedSearches);
    }) 
}

prevSearched.addEventListener('click', function(event) {
    if(event.target.matches('.previous')){
        fetchTraceAPI(event.target.getAttribute("data-value"));
    }
});

storage();

var cells = document.querySelectorAll(".options");
var cardOptions = document.querySelector(".grid-container");
var cardButton = document.querySelectorAll(".card-btn");
var aniBtns = document.querySelectorAll(".aniBtn");
var aniImages = document.querySelectorAll(".imageTest");
var animeTitle = document.querySelectorAll("#anime-title");
var similarityText = document.querySelectorAll("similarity%");
function appendAnime(firstGuess) {
  console.log("image data");
  console.log(firstGuess);
  for(let i = 0; i < cells.length; i++) {
    animeTitle[i].textContent = firstGuess.result[i + 1].anilist.title.romaji;
    similarityText[i].textContent = Math.floor((firstGuess.result[i + 1].similarity) * 100);
    console.log(firstGuess["result"][i + 1].image);
    cardButton[i].setAttribute("data-value", firstGuess["result"][i + 1].image )
    aniImages[i].setAttribute("src", firstGuess["result"][i + 1].image);
  }
}

// appendAnime();


console.log(cardButton);
cardOptions.addEventListener("click", (event) => {
  if(event.target.matches('.card-btn')){
    fetch(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(`${event.target.getAttribute("data-value")}`)}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        appendAnime(data);
        fetchTraceAPI(event.target.getAttribute("data-value"));
    })
    
  }
});
