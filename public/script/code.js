const gameSpace = document.getElementById("game-space");

const fetchPokemons = async () => {
  try {
    const pokemonIds = [1, 3, 5, 15, 29, 32];
    const pokemons = await Promise.all(
      pokemonIds.map(async (id) => {
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        return result.json();
      }),
    );
    for (const pokemon of pokemons) {
      const pokemonItem = document.createElement("div");
      pokemonItem.classList.add("card", "cursor-pointer");
      pokemonItem.innerHTML = `
        <img 
          class="card-front-face"
          src="${pokemon.sprites.other["official-artwork"].front_default}"
          alt="${pokemon.name}"
        />
        <img 
          class="card-back-face"
          src="/images/PokeBall.webp"
          alt="card back"
        />
      `;
      gameSpace.appendChild(pokemonItem);
    }
  } catch (error) {
    console.log("Error fetching Pokemon", error);
  }
};

const loadPage = async () => {
  await fetchPokemons();
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      this.classList.toggle("flip");
    });
  });
};

loadPage();
