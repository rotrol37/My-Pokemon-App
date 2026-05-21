const gameSpace = document.getElementById("game-space");

let firstCardImg = undefined;
let secondCardImg = undefined;
let locked = false;
let clickCount = 0;
let pairsMatched = 0;
let timeLeft = 60;
let timerInterval = undefined;

const difficulties = {
  easy: { pairs: 3, time: 30, columns: 3 },
  medium: { pairs: 6, time: 60, columns: 4 },
  hard: { pairs: 10, time: 150, columns: 5 },
};

let currentDifficulty = difficulties.easy;
let totalPairs = currentDifficulty.pairs;

const startTimer = () => {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft === Math.floor(currentDifficulty.time / 2)) {
      powerUp();
    }

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
        firstCardImg.parentNode.dataset.matched = "true";
        secondCardImg.parentNode.dataset.matched = "true";
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

const applyLayout = () => {
  const flexBasis = `${100 / currentDifficulty.columns}%`;
  document.querySelectorAll(".card").forEach((card) => {
    card.style.flexBasis = flexBasis;
  });
};

const randomIds = (total) => {
  const allIds = [];
  while (allIds.length < total) {
    const randomId = Math.floor(Math.random() * 100) + 1;
    if (!allIds.includes(randomId)) {
      allIds.push(randomId);
    }
  }
  return allIds;
};

const randomInsert = (arr) => {
  const result = [];
  for (const item of arr) {
    const randomIndex = Math.floor(Math.random() * (result.length + 1));
    result.splice(randomIndex, 0, item);
  }
  return result;
};

const fetchPokemons = async () => {
  try {
    let cardIndex = 1;
    const allIds = randomIds(totalPairs);
    const pokemonIds = randomInsert(allIds.concat(allIds));

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
  timeLeft = currentDifficulty.time;
  totalPairs = currentDifficulty.pairs;

  document.getElementById("click-count").innerText = 0;
  document.getElementById("pairs-matched").innerText = 0;
  document.getElementById("pairs-left").innerText = totalPairs;
  document.getElementById("timer").innerText = timeLeft;

  await fetchPokemons();
  applyLayout();
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", onCardClick);
  });
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.body.classList.add("dark");
    document.getElementById("theme-btn").innerText = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    document.getElementById("theme-btn").innerText = "Dark Mode";
  }
};

const toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  const targetTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", targetTheme);
  applyTheme(targetTheme);
};

const powerUp = () => {
  if (firstCardImg) {
    firstCardImg.parentNode.classList.remove("flip");
    firstCardImg = undefined;
  }

  locked = true;
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("flip");
  });

  setTimeout(() => {
    document.querySelectorAll(".card").forEach((card) => {
      if (!card.dataset.matched) {
        card.classList.remove("flip");
      }
    });
    locked = false;
  }, 3000);
};

const loadPage = async () => {
  await fetchPokemons();
  applyLayout();
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", onCardClick);
  });

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  document.getElementById("theme-btn").addEventListener("click", toggleTheme);

  document.getElementById("easy-btn").addEventListener("click", async () => {
    currentDifficulty = difficulties.easy;
    await resetGame();
  });
  document.getElementById("medium-btn").addEventListener("click", async () => {
    currentDifficulty = difficulties.medium;
    await resetGame();
  });
  document.getElementById("hard-btn").addEventListener("click", async () => {
    currentDifficulty = difficulties.hard;
    await resetGame();
  });

  locked = true;
  document.getElementById("start-btn").addEventListener("click", () => {
    locked = false;
    startTimer();
  });
  document.getElementById("reset-btn").addEventListener("click", resetGame);
};

loadPage();
