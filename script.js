const B_ITEMS = ["assets/BItem1.png", "assets/BItem2.png", "assets/BItem3.png", "assets/BItem4.png", "assets/BItem5.png"];
const A_ITEMS = ["assets/AItem1.png", "assets/AItem2.png", "assets/AItem3.png", "assets/AItem4.png", "assets/AItem5.png"];
const S_ITEMS = ["assets/SItem1.png", "assets/SItem1.png", "assets/SItem1.png", "assets/SItem1.png", "assets/SItem1.png"];

const menu = document.getElementById("menu");
const gachaAnimation = document.getElementById("gacha-animation");
const itemDisplay = document.querySelector(".item-display");
const itemImage = document.getElementById("item-image");

const menuMusic = document.getElementById("menu-music");
const gachaMusic = document.getElementById("gacha-music");
const rollBtn = document.getElementById("roll-btn");
const backBtn = document.getElementById("back-btn");

// Создаем кнопку "Крутить 10"
const rollTenBtn = document.createElement("button");
rollTenBtn.id = "roll-ten-btn";
rollTenBtn.className = "btn";
rollTenBtn.textContent = "Крутить 10";
menu.appendChild(rollTenBtn);

let counter = 0; // Счётчик круток для гарантии

// Привязываем события
rollBtn.addEventListener("click", () => startGacha(1));
rollTenBtn.addEventListener("click", () => startGacha(10));
backBtn.addEventListener("click", backToMenu);

function startGacha(times) {
  // Скрыть меню
  menu.classList.add("hidden");

  // Остановить музыку из меню
  menuMusic.pause();
  menuMusic.currentTime = 0;

  // Выдаём предметы по количеству круток
  const results = [];
  for (let i = 0; i < times; i++) {
    results.push(rollItem());
  }

  // Показываем результаты
  if (times === 1) {
    showAnimationAndResult(results[0]);
  } else {
    showMultipleResults(results);
  }
}

function rollItem() {
  counter++;
  let random = Math.random() * 100;
  let rarity, img, audio;

  if (counter % 90 === 0) {
    rarity = "S";
    img = randomItem(S_ITEMS);
    audio = "assets/gachaS.mp3";
  } else if (counter % 10 === 0 || random <= 1.2) {
    rarity = "A";
    img = randomItem(A_ITEMS);
    audio = "assets/gacha.mp3";
  } else {
    rarity = "B";
    img = randomItem(B_ITEMS);
    audio = "assets/gacha.mp3";
  }

  return { rarity, img, audio };
}

function showAnimationAndResult({ img, audio }) {
  // Показать гача-анимацию
  gachaAnimation.classList.remove("hidden");

  // Анимация экранов
  const screens = document.querySelectorAll(".screen");
  gachaMusic.src = audio;
  gachaMusic.play();

  gsap.fromTo(
    screens,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.5,
      stagger: 0.5,
      repeat: 6, // Длительность ~3 секунд
      onComplete: () => revealItem(img),
    }
  );
}

function showMultipleResults(results) {
  // Останавливаем текущую музыку
  gachaMusic.pause();
  gachaMusic.currentTime = 0;

  // Показ всех результатов
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.justifyContent = "center";
  container.style.gap = "10px";

  results.forEach(({ img }) => {
    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.style.width = "100px";
    imgElement.style.height = "auto";
    container.appendChild(imgElement);
  });

  itemDisplay.appendChild(container);
  itemDisplay.classList.remove("hidden");
}

function revealItem(img) {
  itemImage.src = img;
  itemDisplay.classList.remove("hidden");
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function backToMenu() {
  // Скрыть гача-анимацию и вернуть меню
  itemDisplay.innerHTML = ""; // Очищаем предыдущие результаты
  itemDisplay.classList.add("hidden");
  gachaAnimation.classList.add("hidden");
  menu.classList.remove("hidden");

  // Остановить гача-музыку
  gachaMusic.pause();
  gachaMusic.currentTime = 0;

  // Включить музыку меню
  menuMusic.play();
}
