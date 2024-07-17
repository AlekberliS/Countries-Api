  
document.addEventListener("DOMContentLoaded", function () {
  const detailContainer = document.querySelector(".detail-container");
  const themeIcon = document.querySelector(".light-theme--moon");
  const leftIcon = document.querySelector(".left-image img");

  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("active", savedTheme === "dark");

  if (savedTheme === "dark") {
    themeIcon.src = "./assets/image/dark-moon.svg";
    leftIcon.src = "../assets/image/left-light.svg";
  } else {
    themeIcon.src = "./assets/image/light-moon.svg";
    leftIcon.src = "./assets/image/left-dark.svg";
  }

  const toggleTheme = () => {
    document.body.classList.toggle("active");

    if (document.body.classList.contains("active")) {
      themeIcon.src = "./assets/image/dark-moon.svg";
      leftIcon.src = "../assets/image/left-light.svg";
      localStorage.setItem("theme", "dark");
    } else {
      themeIcon.src = "./assets/image/light-moon.svg";
      leftIcon.src = "./assets/image/left-dark.svg";
      localStorage.setItem("theme", "light");
    }
  };

  if (themeIcon) {
    themeIcon.addEventListener("click", toggleTheme);
  }

  function getCountry() {
    let query = window.location.search;
    let countryName = new URLSearchParams(query).get("name");
    console.log("Country Name:", countryName);

    fetch("https://restcountries.com/v3.1/name/" + countryName)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((country) => {
        console.log("Country Details:", country);

        if (country && Array.isArray(country) && country[0].borders) {
          console.log("Borders:", country[0].borders);
          clearDetailContainer();
          repeatDetailCountry(country[0]);
        } else {
          console.error("Borders not found for", country);
          repeatDetailCountry(country[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching country:", error);
      });
  }

  detailContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("detail-footer--button")) {
      event.preventDefault();
      let selectedCountry = event.target.textContent;
      window.location.href = `./detail.html?name=${selectedCountry}`;
    }
  });

  function clearDetailContainer() {
    detailContainer.innerHTML = "";
  }

  function repeatDetailCountry({ flags, population, region, capital, name, subregion, demonyms, currencies, languages, borders }) {
    console.log("Country Details:", name.common, borders);
    detailContainer.innerHTML += `
      <div class="detail-box--image">
        <img class="detail-image" src="${flags.png}" alt="Country Flag" />
      </div>
      <div class="box-detail">
        <strong class="box-detail--title">${name.common}</strong>
        <div class="detail-box--about">
          <div class="detail-about--header">
            <p class="detail-about-paragrfh">Native Name: <span>${name.common}</span></p>
            <p class="detail-about-paragrfh">Population: <span>${population.toLocaleString()}</span></p>
            <p class="detail-about-paragrfh">Region: <span>${region}</span></p>
            <p class="detail-about-paragrfh">Sub Region: <span>${subregion}</span></p>
            <p class="detail-about-paragrfh">Capital: <span>${capital}</span></p>
          </div>
          <div class="detail-about--body">
            <p class="detail-about-paragrfh">Top Level Domain: <span>${demonyms && demonyms.eng ? demonyms.eng.f : 'N/A'}</span></p>
            <p class="detail-about-paragrfh">
               Currencies:
               <span>
                 ${
                   currencies
                     ? Object.values(currencies)[0]
                       ? `${Object.values(currencies)[0].name} (${Object.values(currencies)[0].symbol})`
                       : ''
                     : ''
                 }
               </span>
             </p>
            <p class="detail-about-paragrfh">Languages: <span>${languages ? Object.values(languages).join(', ') : 'N/A'}</span></p>
          </div>
        </div>
        <div class="detail-about--footer">
          <p class="detail-footer--title">Border Countries:</p>
          <div id="border-countries">
            ${borders ? borders.map((border) => `<a href="#" target="_blank" class="detail-footer--button" data-cca3="${border}">${border}</a>`).join('') : `<span>No bordering countries</span>`}
          </div>
        </div>
      </div>
    `;

    if (borders) {
      borders.forEach(border => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then(res => res.json())
          .then(data => {
            document.querySelectorAll('.detail-footer--button').forEach(button => {
              if (button.dataset.cca3 === border) {
                button.textContent = data[0].name.common;
                button.href = `./detail.html?name=${data[0].name.common}`;
              }
            });
          })
          .catch(error => console.error('Error fetching border country:', error));
      });
    }
  }

  getCountry();

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("left-content")) {
      window.history.back();
    }
  });
});
