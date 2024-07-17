document.addEventListener("DOMContentLoaded", function () {
  const countryContainer = document.querySelector(".main-body--container");
  const selectSection = document.querySelector(".select-section");
  const searchInput = document.querySelector(".search-input");
  let allData;

  function getCountries() {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        repeatCountry(data);
        allData = data;
      });
  }
  getCountries();

  function repeatCountry(countries) {
    countryContainer.innerHTML = "";
    countries.forEach(function (country) {
      const { flags, population, region, capital, name } = country;
      countryContainer.innerHTML += `
          <a href="./detail.html?name=${
            name.common
          }" target="_self" class="container-box">
            <div class="container-box--img">
              <img src="${flags.png}" alt="${name.common} flag" />
            </div>
            <div class="container-box--about">
              <strong class="box-title">${name.common}</strong>
              <div class="box-about">
                <p class="box-about--content">Population: <span>${population.toLocaleString()}</span></p>
                <p class="box-about--content">Region: <span>${region}</span></p>
                <p class="box-about--content">Capital: <span>${capital}</span></p>
              </div>
            </div>
          </a>
      `;
    });
  }

  selectSection.addEventListener("change", function (e) {
    const selectedRegion = e.target.value;
    if (selectedRegion !== "") {
      fetch("https://restcountries.com/v3.1/region/" + selectedRegion)
        .then((res) => res.json())
        .then((data) => {
          allData = data;
          repeatCountry(data);
        });
    } else {
      getCountries();
    }
  });

  searchInput.addEventListener("input", function (e) {
    let resultData = allData.filter(function (country) {
      let olkeAdi = country.name.common.toLowerCase();
      let searchCountryName = e.target.value.toLowerCase();
      return olkeAdi.includes(searchCountryName);
    });

    repeatCountry(resultData);
  });

  // Dark Theme
  const backgroundChange = document.querySelector("body");
  const themeIcon = document.querySelector(".light-theme--moon");
  const leftIcon = document.querySelector(".left-image img");
  const root = document.querySelector(":root");

  // Load theme from localStorage
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("active");
    if (themeIcon) themeIcon.src = "./assets/image/dark-moon.svg";
    if (leftIcon) leftIcon.src = "./assets/image/left-light.svg";
  } else {
    if (themeIcon) themeIcon.src = "./assets/image/light-moon.svg";
    if (leftIcon) leftIcon.src = "./assets/image/left-dark.svg";
  }

  if (themeIcon) {
    themeIcon.addEventListener("click", function () {
      document.body.classList.toggle("active");
      if (document.body.classList.contains("active")) {
        themeIcon.src = "./assets/image/dark-moon.svg";
        if (leftIcon) leftIcon.src = "./assets/image/left-light.svg";
        localStorage.setItem("theme", "dark");
      } else {
        themeIcon.src = "./assets/image/light-moon.svg";
        if (leftIcon) leftIcon.src = "./assets/image/left-dark.svg";
        localStorage.setItem("theme", "light");
      }
    });
  }
});
