// This script fetches images from the Flickr API based on user input, and displays them on the page.

// Declaring global variables at the top of the script
const imageContainer = document.getElementById("imageContainer");
const errorMessageContainer = document.getElementById("errorMessageContainer");
let sizeSuffix = "";

// Listen for clicks on the search button, and fetch images when clicked
document.getElementById("searchButton").addEventListener("click", getUserInput);

function getUserInput(event) {
  event.preventDefault();
  const searchTerm = document.getElementById("searchInput").value;
  let numberOfImages = document.getElementById("numberInput").value;
  const selectedFilter = document.getElementById("filters").value;
  const flickrApiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=1cc99964608729cd2c07c89785334a38&tags=${searchTerm}&per_page=${numberOfImages}&page=1&sort=${selectedFilter}&format=json&nojsoncallback=1`;

  // clear the previous error messages
  errorMessageContainer.innerHTML = "";

  // Assigns image `size-suffix` based on selected radio button
  let selectedRadio = document.querySelector('input[name="imageSize"]:checked');
  if (selectedRadio) {
    let id = selectedRadio.id;
    sizeSuffix = id === "radioSmall" ? "_q" : id === "radioLarge" ? "_b" : "";
  }

  // Handle errors such as empty search term or no internet connection
  if (!navigator.onLine) {
    createErrorMessage("Please check your internet connection.");
  } else if (!searchTerm) {
    createErrorMessage("Please type what you want to search for.");
  } else if(numberOfImages < 1 || numberOfImages > 500){
    createErrorMessage("Number must be between 1 and 500.");
  } 
  else {
    // fetch images from the API
    fetch(flickrApiUrl)
      .then((response) => {
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw "not working";
        }
      })
      .then(displayImages)
      .catch((error) => {
        console.log(error);
        if (error === "not working") {
          createErrorMessage("Error occured, please try again later.");
        }
      });
  }
}

// Displays images on the page
function displayImages(images) {
  // clear the previous images
  imageContainer.innerHTML = "";

  if (images.photos.total === 0) {
    createErrorMessage("No images found for your search");
  } else {
    for (let i = 0; i < images.photos.photo.length; i++) {
      const img = document.createElement("img");
      img.src = "https://live.staticflickr.com/" + images.photos.photo[i].server + "/" + images.photos.photo[i].id + "_" + images.photos.photo[i].secret + sizeSuffix + ".jpg";

      const aTag = document.createElement("a");
      aTag.href = img.src;
      aTag.target = "_blank";
      aTag.append(img);

      imageContainer.append(aTag);
    }
  }
}

// Create and display an error message in the errorMessageContainer element
function createErrorMessage(message) {
  const h4 = document.createElement("h4");
  errorMessageContainer.append(h4);
  h4.innerText = message;
}
