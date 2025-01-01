const B_ITEMS = ["assets/BItem1.png", "assets/BItem2.png", "assets/BItem3.png", "assets/BItem4.png", "assets/BItem5.png"];
const A_ITEMS = ["assets/AItem1.png", "assets/AItem2.png", "assets/AItem3.png", "assets/AItem4.png", "assets/AItem5.png"];
const S_ITEMS = ["assets/SItem1.png", "assets/SItem1.png", "assets/SItem1.png", "assets/SItem1.png", "assets/SItem1.png"];

const menu = document.getElementById("menu");
const gachaAnimation = document.getElementById("gacha-animation");
const itemDisplay = document.querySelector(".item-display");
const itemsContainer = document.createElement('div'); // Контейнер для нескольких предметов

const menuMusic = document.getElementById("menu-music");
const gachaMusic = document.getElementById("gacha-music");
const rollBtn = document.getElementById("roll-btn");
const roll10Btn = document.getElementById("roll-10-btn");
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

  // Очистим контейнер для предметов перед новыми крутками
  itemsContainer.innerHTML = '';
  itemsContainer.classList.add('items-container');
  itemDisplay.appendChild(itemsContainer);

  for (let i = 0; i < spins; i++) {
    const { img, audio } = rollItem(); // Рассчитываем редкость сразу

    await playGachaMusic(audio); // Ждём, пока музыка сыграет перед следующей круткой

    // Запускаем анимацию экранов
    await playScreenAnimation(); // Ждём окончания анимации экранов

    revealItem(img); // Показать результат после завершения анимации
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

// Асинхронная функция для анимации экранов
function playScreenAnimation() {
  return new Promise((resolve) => {
    const screens = document.querySelectorAll(".screen");
    gsap.fromTo(
      screens,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        stagger: 0.5,
        repeat: 6, // Повторяем анимацию 6 раз
        yoyo: true, // Возврат к исходному состоянию после каждого мигания
        onComplete: resolve // Завершаем промис после завершения анимации
      }
    );
  });
}

function revealItem(img) {
  itemDisplay.classList.remove("hidden");

  // Если несколько круток, добавляем новый элемент в контейнер
  const newItem = document.createElement('img');
  newItem.src = img;
  newItem.classList.add('item-image');
  itemsContainer.appendChild(newItem); // Добавляем картинку в контейнер
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
