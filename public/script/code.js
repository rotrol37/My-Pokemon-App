const gameSpace = document.getElementById("game-space");

let firstCardImg = undefined;
let secondCardImg = undefined;
let locked = false;
let clickCount = 0;
let pairsMatched = 0;
let timeLeft = 60;
let timerInterval = undefined;
const totalPairs = 3;

const startTimer = () => {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      locked = true;
      console.log("Game Over!");
    }
  }, 1000);
};

const onCardClick = async function () {
  if (locked) return;
  if (this.id == firstCardImg?.parentNode.id) return;

  this.classList.toggle("flip");
  clickCount++;
  document.getElementById("click-count").innerText = clickCount;

  if (!firstCardImg) {
    firstCardImg = this.querySelector(".card-front-face");
  } else {
    secondCardImg = this.querySelector(".card-front-face");
    locked = true;

    await new Promise((resolve) => {
      if (firstCardImg.src === secondCardImg.src) {
        firstCardImg.parentNode.removeEventListener("click", onCardClick);
        secondCardImg.parentNode.removeEventListener("click", onCardClick);
        firstCardImg.parentNode.style.visibility = "hidden";
        secondCardImg.parentNode.style.visibility = "hidden";
        pairsMatched++;
        document.getElementById("pairs-matched").innerText = pairsMatched;
        document.getElementById("pairs-left").innerText =
          totalPairs - pairsMatched;

        if (pairsMatched === totalPairs) {
          clearInterval(timerInterval);
          console.log("you Win!");
        }

        resolve();
      } else {
        setTimeout(() => {
          firstCardImg.parentNode.classList.remove("flip");
          secondCardImg.parentNode.classList.remove("flip");
          resolve();
        }, 1000);
      }
    });

    locked = false;
    firstCardImg = undefined;
    secondCardImg = undefined;
  }
};

const fetchPokemons = async () => {
  try {
    let cardIndex = 1;
    const pokemonIds = [3, 3, 15, 15, 32, 32];
    const pokemons = await Promise.all(
      pokemonIds.map(async (id) => {
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        return result.json();
      }),
    );
    for (const pokemon of pokemons) {
      const pokemonItem = document.createElement("div");
      pokemonItem.classList.add("card", "cursor-pointer");
      pokemonItem.id = `card${cardIndex}`;
      cardIndex++;
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

const resetGame = async () => {
  clearInterval(timerInterval);
  gameSpace.innerHTML = "";
  firstCardImg = undefined;
  secondCardImg = undefined;
  locked = true;
  clickCount = 0;
  pairsMatched = 0;
  timeLeft = 60;

  document.getElementById("click-count").innerText = 0;
  document.getElementById("pairs-matched").innerText = 0;
  document.getElementById("pairs-left").innerText = totalPairs;
  document.getElementById("timer").innerText = 60;

  await fetchPokemons();
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", onCardClick);
  });
};

const loadPage = async () => {
  await fetchPokemons();
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", onCardClick);
  });
  document.getElementById("start-btn").addEventListener("click", () => {
    locked = false;
    startTimer();
  });
  document.getElementById("reset-btn").addEventListener("click", resetGame);
};

loadPage();
