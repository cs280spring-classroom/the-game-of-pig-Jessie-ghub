const holdBtn = document.getElementById("hold");
const rollBtn = document.getElementById("roll");
const result = document.getElementById("result");

holdBtn.addEventListener("click", hold);
rollBtn.addEventListener("click", roll);

let holdValue = 0;
let p1_score = 0;
let p2_score = 0;

// if it's Player-1's role, p1_role = 1; otherwise, p1_role = 0
let p1_role = 1;

function hold() {
  // update player's score
  if (p1_role) {
    p1_score += holdValue;
    setScore(p1_score);
  } else {
    p2_score += holdValue;
    setScore(p2_score);
  }
  // reset player's holdValue to zero
  holdValue = 0;
  setHoldValue();
  // switch players' turn
  p1_role = 1 - p1_role;
  reportTurn(p1_role);
}

function roll() {
  // roll the die, update the UI
  const faceValue = Math.floor(Math.random() * 6) + 1;
  const output = "&#x268" + (faceValue  - 1) + ";";
  const die = document.getElementById("die");
  die.innerHTML = output;

  holdValue += faceValue;
  // do we have a winner yet?
  if (checkWinner()){
    return 0;
  }
  setHoldValue();
  if (faceValue == 1) {
    // reset player's holdValue to zero
    holdValue = 0;
    setHoldValue();
    // switch players' turn
    p1_role = 1 - p1_role;
    reportTurn();
  }
}

// check whether we have a winner (return 1 for yes, 0 for no), and announce the result if we do
function checkWinner(){
  if (p1_role) {
    if (holdValue + p1_score >= 100){    // Player-1 won
      setWinner();
      holdValue = 0;
      setHoldValue();
      result.innerHTML = "Player-1 won!"
      holdBtn.disabled = true;
      rollBtn.disabled = true;
      return 1;
    }
  } else {
    if (holdValue + p2_score >= 100){    // Player-2 won
      setWinner();
      holdValue = 0;
      setHoldValue();
      result.innerHTML = "Player-2 won!"
      holdBtn.disabled = true;
      rollBtn.disabled = true;
      return 1;
    }
  }
  return 0;
}

// show player's score in each turn
function setScore(score) {
  if (p1_role) {
    document.getElementById("p1-score").style.width = score + "%";
    document.getElementById("p1-score").setAttribute("aria-valuenow", score);
    document.getElementById("p1-score").innerText = score;
  } else {
    document.getElementById("p2-score").style.width = score + "%";
    document.getElementById("p2-score").setAttribute("aria-valuenow", score);
    document.getElementById("p2-score").innerText = score;
  }
}

// show player-X's score as "100 🎉" when player-X reached the score of 100
function setWinner(){
  if (p1_role) {
    document.getElementById("p1-score").style.width = 100 + "%";
    document.getElementById("p1-score").setAttribute("aria-valuenow", 100);
    document.getElementById("p1-score").innerText = '100 🎉';
    // document.getElementById("p1-score").className = "progress-bar bg-success";
  } else {
    document.getElementById("p2-score").style.width = 100 + "%";
    document.getElementById("p2-score").setAttribute("aria-valuenow", 100);
    document.getElementById("p2-score").innerText = '100 🎉';
    // document.getElementById("p2-score").className = "progress-bar bg-success";
  }
}

// show player's hold valus in each turn
function setHoldValue() {
  if (p1_role) {
    document.getElementById("p1-hold").style.width = holdValue + "%";
    document.getElementById("p1-hold").setAttribute("aria-valuenow", holdValue);
    document.getElementById("p1-hold").innerText = holdValue;
  } else {
    document.getElementById("p2-hold").style.width = holdValue + "%";
    document.getElementById("p2-hold").setAttribute("aria-valuenow", holdValue);
    document.getElementById("p2-hold").innerText = holdValue;
  }
}

// show whose turn is it on UI
function reportTurn(){
  if (p1_role) {
    result.innerHTML = "Player-1 turn!"
  } else {
    result.innerHTML = "Player-2 turn!"
  }
}