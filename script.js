const apiKey = "38e735db9b600c7da2febc173cb8b1aa";
const searchButton = document.getElementById("search-button");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");

searchButton.addEventListener("click", fetchWeatherData);

function fetchWeatherData() {
  const city = cityInput.value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Clear previous weather info
  weatherInfo.innerHTML = "";

  // Show loading indicator
  weatherInfo.textContent = "Loading...";

  $.ajax({
    url: apiUrl,
    method: "GET",
    success: function (data) {
      if (data.cod === "404") {
        weatherInfo.textContent = "City not found.";
      } else {
        displayWeatherData(data);
      }
    },
    error: function (error) {
      weatherInfo.textContent = "An error occurred. Please try again.";
      console.error(error);
    },
  });
}

function displayWeatherData(data) {
  const cityName = data.name;
  const temperature = data.main.temp;
  const weatherDescription = data.weather[0].description;

  const weatherHTML = `
    <h2>${cityName}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Description: ${weatherDescription}</p>
  `;

  // Clear loading indicator and display weather info
  weatherInfo.innerHTML = weatherHTML;
}

// images  ------------------------------------------------------------------------

const loader = document.querySelector(".loader");
const gridContainer = document.getElementById("grid-container");
const mainImage = document.getElementById("main-image");
const imageHeading = document.getElementById("imageHeading");
const mainImageContainer = document.getElementById("main-image-container");

cityInput.addEventListener("change", fetchCityImages);

async function fetchCityImages() {
  // const city = citySelect.value;
  const city = cityInput.value;
  if (!city) return;

  try {
    showLoader();

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${city}&per_page=10&client_id=YSYE1bp4kaTd532kepkpVLqmLbE6ud1cHX95RcvOjU4`
    );
    const data = await response.json();

    displayImages(data.results);
    if (data.results) {
      imageHeading.style.display = "block";
    }
  } catch (error) {
    showError("Error fetching images.");
  } finally {
    hideLoader();
  }
}

function displayImages(images) {
  gridContainer.innerHTML = "";

  if (images.length === 0) {
    showError("No images found for the selected city.");
    return;
  }

  images.forEach((image, index) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";

    const imgElement = document.createElement("img");
    imgElement.src = image.urls.thumb;
    imgElement.alt = image.alt_description;
    imgElement.dataset.index = index;

    imgElement.addEventListener("click", handleImageClick);

    gridItem.appendChild(imgElement);
    gridContainer.appendChild(gridItem);
  });
}

function handleImageClick(event) {
  const target = event.target;
  const index = target.dataset.index;
  mainImageContainer.style.display = "block";

  setMainImage(index);
}

function setMainImage(index) {
  const thumbnailImages = document.querySelectorAll(".grid-item img");

  thumbnailImages.forEach((image, i) => {
    if (i === parseInt(index)) {
      image.classList.add("active");
    } else {
      image.classList.remove("active");
    }
  });

  mainImage.src = thumbnailImages[index].src;
  mainImage.alt = thumbnailImages[index].alt;
}

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function showError(message) {
  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  gridContainer.innerHTML = "";
  gridContainer.appendChild(errorMessage);
}

// add items and form validation

function addItem(event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";

  let isValid = true;

  if (!nameInput.value) {
    nameError.textContent = "Name is required.";
    isValid = false;
  }

  if (!emailInput.value) {
    emailError.textContent = "Email is required.";
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    emailError.textContent = "Invalid email format.";
    isValid = false;
  }

  if (!messageInput.value) {
    messageError.textContent = "Message is required.";
    isValid = false;
  } else if (
    messageInput.value.length < 10 ||
    messageInput.value.length > 200
  ) {
    messageError.textContent =
      "Message should be between 10 and 200 characters.";
    isValid = false;
  }

  if (isValid) {
    const list = document.getElementById("list");
    const listItem = document.createElement("li");
    const itemContent = document.createElement("span");
    itemContent.textContent = `Name: ${nameInput.value}, Email: ${emailInput.value}, Message: ${messageInput.value}`;
    listItem.appendChild(itemContent);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      listItem.remove();
    };

    listItem.appendChild(deleteButton);
    list.appendChild(listItem);

    nameInput.value = "";
    emailInput.value = "";
    messageInput.value = "";
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
