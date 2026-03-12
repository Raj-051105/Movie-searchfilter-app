const apiKey = "2b6927646477fdcf77a1032e1791fdc1";

const imgPath = "https://image.tmdb.org/t/p/w500";

const movieContainer = document.getElementById("movies");
const searchInput = document.getElementById("search");
const languageSelect = document.getElementById("language");

// Load trending movies
window.onload = () => {
  fetchTrending();
};

// Fetch trending movies
function fetchTrending() {
  fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
    .then((res) => res.json())
    .then((data) => showMovies(data.results))
    .catch((err) => console.log(err));
}

// Display movies
function showMovies(movies) {
  movieContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    const poster = movie.poster_path
      ? imgPath + movie.poster_path
      : "https://via.placeholder.com/200x300";

    movieEl.innerHTML = `
        <img src="${poster}">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p class="rating">⭐ ${movie.vote_average}</p>
            <button onclick="openTrailer(${movie.id})">▶ Watch Trailer</button>
        </div>
    `;

    movieContainer.appendChild(movieEl);
  });
}

// Search movie
searchInput.addEventListener("keyup", () => {
  const query = searchInput.value;

  if (query.length < 3) {
    fetchTrending();
    return;
  }

  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
  )
    .then((res) => res.json())
    .then((data) => showMovies(data.results));
});

// Filter by language
languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;

  if (lang === "") {
    fetchTrending();
    return;
  }

  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=${lang}`,
  )
    .then((res) => res.json())
    .then((data) => showMovies(data.results));
});

// Open trailer
function openTrailer(id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
      let video = data.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer",
      );

      let modal = document.getElementById("trailerModal");
      let frame = document.getElementById("trailerFrame");

      if (video) {
        frame.src = `https://www.youtube.com/embed/${video.key}?autoplay=1`;
        modal.style.display = "flex";
      } else {
        alert("No trailer available.");
      }
    });
}

// Close modal
function closeModal() {
  let modal = document.getElementById("trailerModal");
  let frame = document.getElementById("trailerFrame");

  frame.src = "";
  modal.style.display = "none";
}
