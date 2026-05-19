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
      pokemonItem.classList.add("card", "w-28", "h-40", "cursor-pointer");
      pokemonItem.innerHTML = `
        <img 
          class="card-back w-full h-full rounded-xl border-4 border-red-500" 
          src="/images/PokeBall.webp"
          alt="card back"
        />
        <img 
          class="card-front w-full h-full rounded-xl border-4 border-blue-400 bg-white" 
          src="${pokemon.sprites.other["official-artwork"].front_default}"
          alt="${pokemon.name}"
        />
      `;
      gameSpace.appendChild(pokemonItem);
    }
  } catch (error) {
    console.log("Error fetching Pokemon", error);
  }
};

fetchPokemons();
