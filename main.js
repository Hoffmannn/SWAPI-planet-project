const btn = document.getElementById("btn");
const div = document.getElementById("planet");
const filmsList = document.getElementById("films");
const gif = document.getElementById("gif");

btn.addEventListener("click", () => {
  //Cleans the screen and renders Loading SVG while fetching from API  
  planet.innerHTML = loading;
  filmsList.innerHTML = "";
  gif.innerHTML = "";

  planets().then(response => {
    fillScreen(response.planet, response.climate, response.terrain);
  });
});

async function planets() {
  //Fetch on plantes API
  let fetchPlanets = await fetch("https://swapi.co/api/planets/");
  let resPlanets = await fetchPlanets.json();
  //Genereates a random number limited by the ammount of planets in the API
  let random = Math.ceil(Math.random() * resPlanets.count);
  let fetchPlanet = await fetch("https://swapi.co/api/planets/" + random);
  let resPlanet = await fetchPlanet.json();
  let films = await [];
  //If there are no films in the planet's info, render bellow
  if (resPlanet.films.length == 0) {
    filmsList.innerHTML = `<ul><li>Films: None</li></ul>`;
  }
  //If there are films, iterate through them and fetch the film's title
  resPlanet.films.forEach(async function(currentValue) {
    let fetchFilms = await fetch(currentValue);
    let response = await fetchFilms.json();
    films.push(response.title);
    films.forEach(currentValue => {
      currentValue = " " + currentValue;
    });
    filmsList.innerHTML = `<ul><li>Films: ${films.join(", ")}</li></ul>`;
  });

  //Fetch a GIF with the planet's name
  let gifURL = `https://api.giphy.com/v1/gifs/search?api_key=JnhqLolGWVXQ0AsBreZst71kQZRu1jhF&q=${
    resPlanet.name
  }&limit=25&offset=0&rating=G&lang=en`;
  let fetchGif = await fetch(gifURL);
  let responseGif = await fetchGif.json();
  if (responseGif.data.length != 0) {
    gif.innerHTML = `<img src='${responseGif.data[0].images.original.url}'>`;
  }

  return {
    planet: resPlanet.name,
    climate: resPlanet.climate,
    terrain: resPlanet.terrain
  };
}

function fillScreen(name, climate, terrain) {
  div.innerHTML = `<ul>
     <li><h1>${name}</h1></li>
     <li>Climate: ${climate}</li>
     <li>Terrain: ${terrain}</li>
     </ul>
    `;
}

 
//SVG with a loading animation
const loading = `
  <div class="loader loader--style4" title="3">
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="24px" height="24px" viewBox="0 0 24 24" style="enable-background:new 0 0 50 50;" xml:space="preserve">
    <rect x="0" y="0" width="4" height="7" fill="#333">
      <animateTransform  attributeType="xml"
        attributeName="transform" type="scale"
        values="1,1; 1,3; 1,1"
        begin="0s" dur="0.6s" repeatCount="indefinite" />       
    </rect>

    <rect x="10" y="0" width="4" height="7" fill="#333">
      <animateTransform  attributeType="xml"
        attributeName="transform" type="scale"
        values="1,1; 1,3; 1,1"
        begin="0.2s" dur="0.6s" repeatCount="indefinite" />       
    </rect>
    <rect x="20" y="0" width="4" height="7" fill="#333">
      <animateTransform  attributeType="xml"
        attributeName="transform" type="scale"
        values="1,1; 1,3; 1,1"
        begin="0.4s" dur="0.6s" repeatCount="indefinite" />       
    </rect>
  </svg>
</div>
  `;
  //