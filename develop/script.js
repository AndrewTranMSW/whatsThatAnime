
// var a = "hello";
// console.log(a);
// This Works!
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
var anime; 
function fetchTraceAPI(url) {
    fetch(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(`${url}`)}`)
            .then(function(response) {
                return response.json();
            })
            .then((res) => {  
                Aniname.innerHTML = res.result[0].anilist.title.romaji;
                anime = res.result[0].anilist.title.romaji;
                pic.appendChild(uploaded_pic);
                getGiphyApi(anime);
                return anime;
            })   
            .then((anime) => {
                if (storedSearches.length === 0) {
                    // works
                    console.log("stop1");
                    var obj = {};
                    obj["name"] = anime;
                    obj["url"] = url;
                    storedSearches.push(obj);
                    localStorage.setItem('Animes', JSON.stringify(storedSearches));
                    storage();
                } else {
                    // not working
                    console.log("array has 1 item");
                    
                    objValues = Object.values(storedSearches);
                    console.log(objValues);

                    if(!objValues.includes(anime)){
                        console.log("work if the anime is new");
                        // store searched anime name and url
                        // issue, anime name is not being transferred over
                        var obj = {};
                        obj["name"] = anime;
                        obj["url"] = url;
                        console.log(obj);
                        storedSearches.push(obj);
                        localStorage.setItem('Animes', JSON.stringify(storedSearches));
                        storage();
                    } 
                }
                
            })      
}
// fetch request for downloaded file
var pic = document.getElementById("theAnimePic");
var Aniname = document.getElementById("theAnimeName");
var uploaded_pic = document.createElement("img");

// if want to do file need to incorporate this function somehow
const fileInput = document.getElementById("fileInput");

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
        // at this point, we have the data but to get any aditional information about the anime, we need a url
        // this first fetch allows us to grab a url to then run another fetch request. 
        let url = data.result[0].image;
        uploaded_pic.src = url;
        // second fetch gets extra data 
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
  

var prevSearched = document.querySelector("#list");
function storage() {
    prevSearched.innerHTML = '';
    storedSearches = JSON.parse(localStorage.getItem('Animes')) || [];
    storedSearches.map( item => {
        let li = document.createElement('button')
        li.setAttribute('class', 'previous button');
        li.setAttribute("data-value", item["url"]);
        li.textContent = item["name"];
        prevSearched.append(li);
        objValues = Object.values(storedSearches);
    })
}

prevSearched.addEventListener('click', function(event) {
    if(event.target.matches('.previous')){
        fetchTraceAPI(event.target.getAttribute("data-value"));
    }
});

storage();
