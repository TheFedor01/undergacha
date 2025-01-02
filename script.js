const B_ITEMS = ["assets/BItem1.png", "assets/BItem2.png", "assets/BItem3.png", "assets/BItem4.png", "assets/BItem5.png"];
const A_ITEMS = ["assets/AItem1.png", "assets/AItem2.png", "assets/AItem3.png", "assets/AItem4.png", "assets/AItem5.png"];
const S_ITEMS = ["assets/SItem1.png", "assets/SItem2.png", "assets/SItem3.png", "assets/SItem4.png", "assets/SItem5.png", "assets/SItem6.png", "assets/SItem7.png", "assets/SItem8.png"];

const menu = document.getElementById("menu");
const gachaAnimation = document.getElementById("gacha-animation");
const itemDisplay = document.querySelector(".item-display");
const itemImage = document.getElementById("item-image");

const menuMusic = document.getElementById("menu-music");
const gachaMusic = document.getElementById("gacha-music");
const rollBtn = document.getElementById("roll-btn");
const backBtn = document.getElementById("back-btn");

// Добавляем счетчик до гарантированной S-редкости
const guaranteeCounterText = document.createElement("p");
guaranteeCounterText.id = "guarantee-counter";
guaranteeCounterText.style.marginTop = "20px";
guaranteeCounterText.style.fontSize = "1.2rem";
guaranteeCounterText.style.color = "#fff";
menu.appendChild(guaranteeCounterText);

let counter = 0; // Счётчик круток для гарантии
updateGuaranteeCounter();

rollBtn.addEventListener("click", startGacha);
backBtn.addEventListener("click", backToMenu);

function startGacha() {
  // Скрыть меню
  menu.classList.add("hidden");

  // Остановить музыку из меню
  menuMusic.pause();
  menuMusic.currentTime = 0;

  // Рассчитать редкость и получить предмет
  const { rarity, img, audio } = rollItem();

  // Включить соответствующую музыку
  gachaMusic.src = audio;
  gachaMusic.play();

  // Показать гача-анимацию и результат
  gachaAnimation.classList.remove("hidden");
  const screens = document.querySelectorAll(".screen");

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

function rollItem() {
  counter++;
  updateGuaranteeCounter();

  let random = Math.random() * 100;
  let rarity, img, audio;

  if (counter % 40 === 0) {
    // Гарантированная S-редкость
    rarity = "S";
    img = randomItem(S_ITEMS);
    audio = "assets/gachaS.mp3";
  } else if (counter % 10 === 0 || random <= 1.2) {
    // A-редкость
    rarity = "A";
    img = randomItem(A_ITEMS);
    audio = "assets/gacha.mp3";
  } else {
    // B-редкость
    rarity = "B";
    img = randomItem(B_ITEMS);
    audio = "assets/gacha.mp3";
  }

  return { rarity, img, audio };
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
  itemDisplay.classList.add("hidden");
  gachaAnimation.classList.add("hidden");
  menu.classList.remove("hidden");

  // Остановить гача-музыку
  gachaMusic.pause();
  gachaMusic.currentTime = 0;

  // Включить музыку меню
  menuMusic.play();
}

function updateGuaranteeCounter() {
  const remaining = 40 - (counter % 40);
  guaranteeCounterText.textContent = `До гарантированной S-редкости: ${remaining}`;
}
