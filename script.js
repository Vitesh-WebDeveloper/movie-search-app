const loading = document.getElementById("loading");
const error = document.getElementById("error");
const noResults = document.getElementById("noResults");
const container = document.getElementById("moviesContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const API_KEY = "acd3541e";

// Clears all screen states and old movie elements
function clearStates() {
  error.textContent = "";
  noResults.textContent = "";
  container.innerHTML = "";
  loading.textContent = "";
}

function renderMovies(movieList) {
  clearStates();

  if (!movieList || movieList.length === 0) {
    noResults.textContent = "No movies found";
    return;
  }

  movieList.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://placeholder.com"}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    container.appendChild(card);
  });
}

async function fetchMovies(query) {
  clearStates();
  loading.textContent = "Loading...";
  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);

    if (!res.ok) {
      throw new Error("Network error");
    }

    const data = await res.json();

    loading.textContent = "";
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";

    if (data.Response === "False") {
      noResults.textContent = data.Error;
      return;
    }

    renderMovies(data.Search);

  } catch (err) {
    loading.textContent = "";
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
    error.textContent = "Something went wrong. Please try again.";
  }
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (!query) {
    // FIX: Clear out the previous results before showing error
    clearStates(); 
    error.textContent = "Please enter a movie name";
    return;
  }

  fetchMovies(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
