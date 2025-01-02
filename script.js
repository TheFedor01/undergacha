const B_ITEMS = ["assets/BItem1.png", "assets/BItem2.png", "assets/BItem3.png", "assets/BItem4.png", "assets/BItem5.png"];
const A_ITEMS = ["assets/AItem1.png", "assets/AItem2.png", "assets/AItem3.png", "assets/AItem4.png", "assets/AItem5.png"];
const S_ITEMS = ["assets/SItem1.png", "assets/SItem2.png", "assets/SItem3.png", "assets/SItem4.png", "assets/SItem5.png", "assets/SItem6.png", "assets/SItem7.png", "assets/SItem8.png"];

const menu = document.getElementById("menu");
const gachaAnimation = document.getElementById("gacha-animation");
const itemDisplay = document.querySelector(".item-display");
const itemImage = document.getElementById("item-image");
const heartContainer = document.getElementById("heart-container");

const menuMusic = document.getElementById("menu-music");
const gachaMusic = document.getElementById("gacha-music");
const rollBtn = document.getElementById("roll-btn");
const backBtn = document.getElementById("back-btn");

let counter = 0; // Счётчик круток для гарантии

rollBtn.addEventListener("click", startGacha);
backBtn.addEventListener("click", backToMenu);

function startGacha() {
  menu.classList.add("hidden");
  menuMusic.pause();
  menuMusic.currentTime = 0;

  const { rarity, img, audio } = rollItem();
  gachaMusic.src = audio;
  gachaMusic.play();

  gachaAnimation.classList.remove("hidden");
  playHeartAnimation(img);
}

function playHeartAnimation(itemImg) {
  const hearts = [
    createHeart("yellow", 200, 50),
    createHeart("orange", 150, 150),
    createHeart("green", -150, 150),
    createHeart("blue", -200, 50),
    createHeart("purple", 0, -200)
  ];

  const delays = [0, 2, 4, 6, 7]; // Время появления сердечек (секунды)

  hearts.forEach((heart, index) => {
    setTimeout(() => {
      heart.style.opacity = 1;
    }, delays[index] * 1000);
  });

  setTimeout(() => {
    hearts.forEach((heart) => {
      gsap.to(heart, {
        x: 0,
        y: 0,
        duration: 1,
        onComplete: () => heart.remove()
      });
    });

    setTimeout(() => {
      revealItem(itemImg);
    }, 1000);
  }, 9000);
}

function createHeart(color, offsetX, offsetY) {
  const heart = document.createElement("div");
  heart.className = `heart heart-${color}`;
  heart.style.left = `50%`;
  heart.style.top = `50%`;
  heart.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  heartContainer.appendChild(heart);
  return heart;
}

function revealItem(img) {
  itemImage.src = img;
  itemDisplay.classList.remove("hidden");
}

function rollItem() {
  counter++;
  updateGuaranteeCounter();

  let random = Math.random() * 100;
  if (counter % 40 === 0) {
    return { rarity: "S", img: randomItem(S_ITEMS), audio: "assets/gachaS.mp3" };
  } else if (random <= 10) {
    return { rarity: "A", img: randomItem(A_ITEMS), audio: "assets/gacha.mp3" };
  } else {
    return { rarity: "B", img: randomItem(B_ITEMS), audio: "assets/gacha.mp3" };
  }
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function updateGuaranteeCounter() {
  const counterDisplay = document.getElementById("guarantee-counter");
  const remaining = 40 - (counter % 40);
  counterDisplay.textContent = `До гарантированной S редкости осталось: ${remaining} круток`;
}

function backToMenu() {
  gachaAnimation.classList.add("hidden");
  itemDisplay.classList.add("hidden");
  menu.classList.remove("hidden");

  gachaMusic.pause();
  gachaMusic.currentTime = 0;

  menuMusic.play();
}
