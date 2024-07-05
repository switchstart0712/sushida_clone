const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("type-display");
const typeInput = document.getElementById("type-Input");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// インプットテキスト入力、合っているかどうかの判定
typeInput.addEventListener("input", () => {
  // タイプ音を着ける
  typeSound.play();
  typeSound.currentTime = 0;

  /* 文字と文字を比較する */
  /* ディスプレイに表示されてるSpanタグを取得 */
  const sentence = typeDisplay.querySelectorAll("span");
  /* 自分で打ち込んだテキストを取得 */
  const arrayValue = typeInput.value.split("");
  let correct = true;
  sentence.forEach((characterspan, index) => {
    if (arrayValue[index] == null) {
      characterspan.classList.remove("correct");
      characterspan.classList.remove("Incorrect");
      correct = false;
    } else if (characterspan.innerText == arrayValue[index]) {
      characterspan.classList.add("correct");
      characterspan.classList.remove("Incorrect");
    } else {
      characterspan.classList.add("Incorrect");
      characterspan.classList.remove("correct");
      correct = false;
      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime = 0;
    }
  });
  
  /* 次の文章へ */
  if (correct) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

// 非同期でランダムな文章を取得する
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

// ランダムな文章を取得して、表示する
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);
  typeDisplay.innerText = "";

  // 文章を1文字ずつ分解して、spanタグを生成する
  let onetext = sentence.split("");
  onetext.forEach((character) => {
    const characterspan = document.createElement("span");
    characterspan.innerText = character;
    // console.log(characterspan);
    typeDisplay.appendChild(characterspan);
    // characterspan.classList.add("correct");
  });

  //テキストボックスの中身を消す
  typeInput.value = null;

  startTimer();
}

let startTime;
let originTime = 30;
function startTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  // console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
  RenderNextSentence();
}

RenderNextSentence();
