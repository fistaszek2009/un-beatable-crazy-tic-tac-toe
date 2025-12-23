let drawing = []
let currentId = undefined

const canvases = document.querySelectorAll("#board canvas")
const ctxes = Array(canvases.length)

const nav = document.querySelector("nav")
const cancelDrawingBtn = document.querySelector("nav #cancel-button")
const submitDrawingBtn = document.querySelector("nav #submit-button")
const wonScreen = document.querySelector(".won-screen")

function getPos(e,canvas) {
    const rect = canvas.getBoundingClientRect()
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}
function endStroke(ctx,ind) {
    if (!drawing[ind]) return
    drawing[ind] = false
    ctx.stroke()
}

function addEventListenersToCanvas(canvas,ctx,ind,fill){
    drawing.push(false)

    ctx.lineWidth = 6; 
    ctx.strokeStyle = "#691d1dff"

    ctx.fillStyle = "white";
    if(fill)ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener("pointerdown", (e) => {
        if(currentId == undefined || currentId == ind){
            currentId = ind
            drawing[ind] = true
            const pos = getPos(e,canvas)
            ctx.beginPath()
            ctx.moveTo(pos.x,pos.y)
            buttonDeactivation(active=true)
        }
    })

    canvas.addEventListener("pointermove", (e) => { 
        if (!drawing[ind]) return
        const pos = getPos(e,canvas)
        ctx.lineTo(pos.x,pos.y)
        ctx.stroke()
    })

    canvas.addEventListener("pointerup", ()=>endStroke(ctx,ind))
    canvas.addEventListener("pointercancel", ()=>endStroke(ctx,ind))
    canvas.addEventListener("pointerleave", ()=>endStroke(ctx,ind))
}

function buttonDeactivation(active=false){
    submitDrawingBtn.style.cursor = cancelDrawingBtn.style.cursor = active ? "pointer":"default"
    submitDrawingBtn.disabled = cancelDrawingBtn.disabled = active ? false : true
    nav.style.opacity = active ? 1 : 0
}

async function submitDrawing(){
    let end = await submitMove(currentId)
    buttonDeactivation()
    lockElement("#board", true);
    if (!end) {
        await sleep(1000);
        end = await botMove();
    }
    if(!end) lockElement("#board", false);
}

function cancelDrawing(){
    if (typeof currentId !== 'undefined'){
        ctxes[currentId].clearRect(0,0,canvases[currentId].width,canvases[currentId].height)
        localStorage.removeItem(`ttt_canvas_${currentId}`)
    }
    currentId = undefined
    buttonDeactivation()
}

function updateBoard(board){
    document.querySelectorAll(".cell").forEach((c, idx) => {
        const i = Math.floor(idx / 3);
        const j = idx % 3;

        c.classList.remove("x", "o");

        if (board[i][j] === 1) c.classList.add("x");
        if (board[i][j] === -1) c.classList.add("o");
    });
}

function canvasToWhitePNG(canvas) {
    const tmp = document.createElement("canvas");
    tmp.width = canvas.width;
    tmp.height = canvas.height;

    const ctx = tmp.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tmp.width, tmp.height);
    ctx.drawImage(canvas, 0, 0);

    return new Promise(resolve => {
        tmp.toBlob(blob => resolve(blob), "image/png");
    });
}

function lockElement(sel,state) {
  document.querySelector(sel).classList.toggle("locked", state);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function saveCanvasToLocal(index){
    try{
        const dataUrl = canvases[index].toDataURL("image/png");
        localStorage.setItem(`ttt_canvas_${index}`, dataUrl);
    }catch(e){
        console.warn("Could not save canvas:", e);
    }
}

function drawImageOnCanvas(index, dataUrl){
    const canvas = canvases[index];
    const ctx = ctxes[index];
    const img = new Image();
    img.onload = () =>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * ratio, h = img.height * ratio;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        saveCanvasToLocal(index);
    }
    img.src = dataUrl;
}

function restoreSavedCanvases(){
    for(let i=0;i<canvases.length;i++){
        const dataUrl = localStorage.getItem(`ttt_canvas_${i}`);
        if(dataUrl) drawImageOnCanvas(i, dataUrl);
    }
}

document.addEventListener('click', (e)=>{
    if(e.target && e.target.matches("a[href='/reset']")){
        for(let i=0;i<canvases.length;i++) localStorage.removeItem(`ttt_canvas_${i}`)
    }
})

async function submitMove(cellIndex) {

    const canvas = document.querySelector(
        `.cell[data-index="${cellIndex}"] canvas`
    );

    const blob = await canvasToWhitePNG(canvas);
    lockElement(`.cell[data-index="${cellIndex}"] canvas`, true)

    const form = new FormData();
    form.append("image", blob);
    form.append("pos", cellIndex);

    const res = await fetch("/move-image", {
        method: "POST",
        body: form
    });

    const state = await res.json();
    if(state.error){
        console.error(state.error)
       return true
    }
    else{
        updateBoard(state.board)
        saveCanvasToLocal(cellIndex)
        currentId = undefined
        handleGameEnd(state.win,state.anyEmpty, state.indexes)
        return state.win !== 0 || !state.anyEmpty
   }

}

async function botMove() {
    const res = await fetch("/move-bot", { method: "POST" });

    const state = await res.json();
    if(state.error){
        console.error(state.error)
        return true
    }
    else{
        updateBoard(state.board)
        if(typeof state.pos !== 'undefined' && state.image){
            drawImageOnCanvas(state.pos, state.image)
        }
        handleGameEnd(state.win,state.anyEmpty, state.indexes)
        return state.win !== 0 || !state.anyEmpty
   }
}

function handleGameEnd(win,anyEmpty,indexes){
    if (win != 0 || !anyEmpty){
            lockElement("#board", true);
            if(indexes !== -1) indexes.forEach(item=>{document.querySelector(`.cell[data-index="${item}"]`).classList.add("win-cell")})
            setTimeout(() => {
                wonScreen.querySelector("h2").innerText = win == 0 ? "It's a draw!" : win == -1 ? "O won!" : "X won!"
                wonScreen.style.display = "flex"
            }, 1500);        }
}

canvases.forEach((canvas,ind)=>{
    ctx = canvas.getContext('2d')
    ctxes[ind] = ctx
    addEventListenersToCanvas(canvas,ctx,ind,false)
})

cancelDrawingBtn.addEventListener("click",cancelDrawing)
submitDrawingBtn.addEventListener("click",async _ => submitDrawing())

restoreSavedCanvases()
buttonDeactivation()


