let drawing = []
let currentId = undefined
const canvases = document.querySelectorAll("#board canvas")
const ctxes = Array(canvases.length)

const nav = document.querySelector("nav")
const cancelDrawingBtn = document.querySelector("nav #cancel-button")
const submitDrawingBtn = document.querySelector("nav #submit-button")

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

    ctx.lineWidth = 4
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

function submitDrawing(){
    alert("ala")
    buttonDeactivation()
}

function cancelDrawing(){
    ctxes[currentId].clearRect(0,0,canvases[currentId].width,canvases[currentId].height)
    currentId = undefined
    nav.style.opacity = 0
    buttonDeactivation()
}

canvases.forEach((canvas,ind)=>{
    ctx = canvas.getContext('2d')
    ctxes[ind] = ctx
    addEventListenersToCanvas(canvas,ctx,ind,false)
})

cancelDrawingBtn.addEventListener("click",cancelDrawing)
submitDrawingBtn.addEventListener("click",submitDrawing)
buttonDeactivation()