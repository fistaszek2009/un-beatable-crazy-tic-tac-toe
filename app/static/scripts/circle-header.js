const text = "Unbeatable crazy tic-tac-toe" + " "
const fontSize = 28
const r = 140 + fontSize
const speed = -0.4

let chars = text.split("")
// while(chars.length < 20) chars += text.split("")

const ring = document.querySelector("#ring")
const n = chars.length
const angleStep = 360 / n
const arc = ( 2 * Math.PI * r) / n

chars.forEach((item)=>{
  const char = document.createElement('span')
  char.className = "char"
  char.textContent = item
  char.style.fontSize = fontSize + "px"
  ring.appendChild(char)
})

function layoutChars() {
  const domChars = Array.from(ring.children);
  const n = domChars.length;
  const angleStep = 360 / n;
  const arc = (2 * Math.PI * r) / n;

  domChars.forEach((el, idx) => {
    
    const char = document.createElement('span')
    char.className = "char2"
    char.textContent = el.textContent
    char.style.fontSize = fontSize + "px"
    ring.appendChild(char)

    const angle = idx * angleStep;

    el.style.width = char.style.width = arc + 1 + "px";
    el.style.minHeight = char.style.minHeight = fontSize * 1.75 + "px";

    el.style.transform =
      `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${r}px)`;
    
    char.style.transform =
      `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${r-2}px)`;
  
    });
}

let rotateY = parseInt(localStorage.getItem('rotateY')) || 0
function rotate(){
  rotateY = (rotateY + speed) % 360
  localStorage.setItem('rotateY', rotateY)

  ring.style.transform = `rotateY(${rotateY}deg) rotateX(5deg)`
  requestAnimationFrame(rotate)
}

layoutChars()
requestAnimationFrame(rotate)

// window.addEventListener('resize', () => {
//   layoutChars();
// });


