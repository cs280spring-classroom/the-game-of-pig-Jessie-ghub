const holdBtn = document.getElementById("hold");
const rollBtn = document.getElementById("roll");
const result = document.getElementById("result");

holdBtn.addEventListener("click", hold);
rollBtn.addEventListener("click", roll);

let holdValue = 0;
let p1_score = 0;
let p2_score = 0;

let p1_role = 1;

function hold() {
  if (p1_role) {
    p1_score += holdValue;
    document.getElementById("p1-score").style.width = p1_score + "%";
    document.getElementById("p1-score").setAttribute("aria-valuenow", p1_score);
    document.getElementById("p1-score").innerText = p1_score;
    holdValue = 0;
    document.getElementById("p1-hold").style.width = holdValue + "%";
    document.getElementById("p1-hold").setAttribute("aria-valuenow", holdValue);
    document.getElementById("p1-hold").innerText = holdValue;
    p1_role = 0;
  } else {
    p2_score += holdValue;
    document.getElementById("p2-score").style.width = p2_score + "%";
    document.getElementById("p2-score").setAttribute("aria-valuenow", p2_score);
    document.getElementById("p2-score").innerText = p2_score;
    holdValue = 0;
    document.getElementById("p2-hold").style.width = holdValue + "%";
    document.getElementById("p2-hold").setAttribute("aria-valuenow", holdValue);
    document.getElementById("p2-hold").innerText = holdValue;
    p1_role = 1;
  }
  if (p1_role) {
    result.innerHTML = "Player-1 turn!"
  } else {
    result.innerHTML = "Player-2 turn!"
  }
}

function roll() {
  const faceValue = Math.floor(Math.random() * 6) + 1;
  const output = "&#x268" + (faceValue  - 1) + "; ";
  const die = document.getElementById("die");
  die.innerHTML = output;
  holdValue += faceValue;
  if (p1_role) {
    if (holdValue + p1_score >= 100){
      document.getElementById("p1-score").style.width = 100 + "%";
      document.getElementById("p1-score").setAttribute("aria-valuenow", 100);
      document.getElementById("p1-score").innerText = '100 🎉';
      document.getElementById("p1-score").className = "progress-bar bg-success";
      holdValue = 0;
      document.getElementById("p1-hold").style.width = holdValue + "%";
      document.getElementById("p1-hold").setAttribute("aria-valuenow", holdValue);
      document.getElementById("p1-hold").innerText = holdValue;
      result.innerHTML = "Player-1 won!"
      holdBtn.disabled = true;
      rollBtn.disabled = true;
    }
  } else {
    if (holdValue + p2_score >= 100){
      document.getElementById("p2-score").style.width = 100 + "%";
      document.getElementById("p2-score").setAttribute("aria-valuenow", 100);
      document.getElementById("p2-score").innerText = '100 🎉';
      document.getElementById("p2-score").className = "progress-bar bg-success";
      holdValue = 0;
      document.getElementById("p2-hold").style.width = holdValue + "%";
      document.getElementById("p2-hold").setAttribute("aria-valuenow", holdValue);
      document.getElementById("p2-hold").innerText = holdValue;
      result.innerHTML = "Player-2 won!"
      holdBtn.disabled = true;
      rollBtn.disabled = true;
    }
  }
  if (p1_role) {
    document.getElementById("p1-hold").style.width = holdValue + "%";
    document.getElementById("p1-hold").setAttribute("aria-valuenow", holdValue);
    document.getElementById("p1-hold").innerText = holdValue;
  } else {
    document.getElementById("p2-hold").style.width = holdValue + "%";
    document.getElementById("p2-hold").setAttribute("aria-valuenow", holdValue);
    document.getElementById("p2-hold").innerText = holdValue;
  }
  if (faceValue == 1) {
    p1_role = 1 - p1_role;
    holdValue = 0;
    if (p1_role) {
      document.getElementById("p2-hold").style.width = holdValue + "%";
      document.getElementById("p2-hold").setAttribute("aria-valuenow", holdValue);
      document.getElementById("p2-hold").innerText = holdValue;
      result.innerHTML = "Player-1 turn!"
    } else {
      document.getElementById("p1-hold").style.width = holdValue + "%";
      document.getElementById("p1-hold").setAttribute("aria-valuenow", holdValue);
      document.getElementById("p1-hold").innerText = holdValue;
      result.innerHTML = "Player-2 turn!"
    }
  }
}
