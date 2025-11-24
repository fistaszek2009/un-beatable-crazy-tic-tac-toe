const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

ctx.lineWidth = 4
ctx.strokeStyle = "black"

const saveBtn = document.querySelector("#save")
const type = document.querySelector("#type")

let drawing = false
let last = { x: 0, y: 0 }

function getPos(e) {
    const rect = canvas.getBoundingClientRect()
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

canvas.addEventListener("pointerdown", e => {
    drawing = true
    last = getPos(e)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
})

canvas.addEventListener("pointermove", e => {
    if (!drawing) return
    const pos = getPos(e)
    ctx.lineTo(pos.x,pos.y)
    ctx.stroke()
    last = pos
})

function endStroke(e) {
    if (!drawing) return
    drawing = false
    ctx.stroke()
}

const save = () => {
    const imgUrl = canvas.toDataURL("image/png")
    const kind = type.value.toLowerCase()

    let count = localStorage.getItem("count_" + kind)
    count = count ? parseInt(count) : 0
    count++

    localStorage.setItem("count_" + kind, count)

    const filename = `${kind}${count}.png`

    const a = document.createElement("a")
    a.href = imgUrl
    a.download = filename
    a.click()

    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

canvas.addEventListener("pointerup", endStroke)
canvas.addEventListener("pointercancel", endStroke)
canvas.addEventListener("pointerleave", endStroke)

saveBtn.addEventListener("click", save)
document.addEventListener("keydown", save)

