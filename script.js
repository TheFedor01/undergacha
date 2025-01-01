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
const roll10Btn = document.getElementById("roll-10-btn"); // Новая кнопка
const backBtn = document.getElementById("back-btn");
const rollsLeftDisplay = document.getElementById("rolls-left");

let counter = 0; // Счётчик круток для гарантии

// Привязываем события
rollBtn.addEventListener("click", () => startGacha(1)); // Одна крутка
roll10Btn.addEventListener("click", () => startGacha(10)); // 10 круток

async function startGacha(spins) {
  menu.classList.add("hidden");
  gachaAnimation.classList.remove("hidden");

  menuMusic.pause();
  menuMusic.currentTime = 0;

  for (let i = 0; i < spins; i++) {
    const { img, audio } = rollItem(); // Рассчитываем редкость сразу
    await playGachaMusic(audio); // Ждём, пока музыка сыграет перед следующей круткой

    // Запускаем анимацию экранов
    const screens = document.querySelectorAll(".screen");
    gsap.fromTo(
      screens,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        stagger: 0.5,
        repeat: 6,
        onComplete: () => revealItem(img), // Показать результат
      }
    );
  }

  // Обновляем счётчик до гарантии
  rollsLeftDisplay.textContent = 90 - (counter % 90);
}

// Асинхронная функция для воспроизведения музыки
function playGachaMusic(audioSrc) {
  return new Promise((resolve) => {
    gachaMusic.src = audioSrc;
    gachaMusic.play();

    gachaMusic.onended = () => resolve(); // Разрешаем промис, когда музыка закончила играть
  });
}

function revealItem(img) {
  itemDisplay.classList.remove("hidden");
  itemImage.src = img;
}

function rollItem() {
  counter++;
  let random = Math.random() * 100;

  if (counter % 90 === 0) {
    return { img: randomItem(S_ITEMS), audio: "assets/gachaS.mp3" };
  } else if (counter % 10 === 0 || random <= 1.2) {
    return { img: randomItem(A_ITEMS), audio: "assets/gacha.mp3" };
  } else {
    return { img: randomItem(B_ITEMS), audio: "assets/gacha.mp3" };
  }
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function backToMenu() {
  itemDisplay.classList.add("hidden");
  gachaAnimation.classList.add("hidden");
  menu.classList.remove("hidden");

  gachaMusic.pause();
  gachaMusic.currentTime = 0;

  menuMusic.play();
}
