
// var a = "hello";
// console.log(a);
// This Works!
// var requestURL = 'https://api.trace.moe';
// var requestURL = 'https://api.jikan.moe/v3';
var anime; 


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
var submitButton = document.querySelector("#submit-button");
var imageName = document.querySelector("#imageLink");

// event occurs when submit button is pressed
submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    var url = imageName.value.trim()
    fetchTraceAPI(url);
})

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
                console.log(res);
                Aniname.innerHTML = res.result[0].anilist.title.romaji;
                anime = res.result[0].anilist.title.romaji;
                console.log(anime);
                pic.appendChild(uploaded_pic);
                getGiphyApi(anime);
            })
}

// fetch request for downloaded file
var pic = document.getElementById("theAnimePic");
var Aniname = document.getElementById("theAnimeName");
var uploaded_pic = document.createElement("img");

const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", (event) => {
    // event occurs when the value of an element has been changed.

    const fileList = event.target.files;
    // It's part of the File API, which is available in all modern browsers except IE9 and earlier. files is a FileList of the file(s) selected by the user in the input[type=file] element you're referencing via the id in your id variable.
    // Each entry in the FileList is a File, which gives you the name of the file (without path information) and which can be used for accessing the files.

    // loading text for display to show call is working
    Aniname.innerHTML = "LOADING";
    console.log(fileList);

    // followed steps on api doc
    const formData = new FormData();
    formData.append("image", fileList[0]);

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
        fetchTraceAPI(url);
    })
})