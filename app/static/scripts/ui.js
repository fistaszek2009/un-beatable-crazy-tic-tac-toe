const main = document.querySelector("main")
const board = document.getElementById('grid-svg')

const backgroundDescriptionTitle = document.querySelector(".background-description .title")
const backgroundDescriptionAuthor = document.querySelector(".background-description .author")
const backgroundDescriptionOrigin = document.querySelector(".background-description .origin")

const descriptions = [
    {
        title:"Krajobraz zimowy z rzeką",
        author:"Julian Fałat",
        origin: "Downloaded form MUZA system, National Museum in Warsaw"
    },
    {
        title:"Rodzina artysty",
        author:"Włodzimierz Tetmajer",
        origin: "Photography studio MNK, National Museum in Cracow"
    },
    {
        title:"Stare jabłonie",
        author:"Ferdynand Ruszczyc",
        origin: "Downloaded form MUZA system, National Museum in Warsaw"
    },
    {
        title:"Targ na konie w Bałcie",
        author:"Józef Chełmoński",
        origin: "Downloaded form MUZA system, National Museum in Warsaw"
    },
    {
        title:"Ziemia",
        author:"Ferdynand Ruszczyc",
        origin: "Downloaded form MUZA system, National Museum in Warsaw"
    }
]

function makeBoard(){
    let rc = rough.svg(board, {options: {seed: viewData.grid[0].seed}});
    let node = rc.line(10, 120, 350, 120, { strokeWidth: 6, roughness: viewData.grid[0].roughness,  bowing: viewData.grid[0].bowing, stroke: '#de1a1aff' });
    board.appendChild(node);1

    rc = rough.svg(board, {options: {seed: viewData.grid[1].seed}});
    node = rc.line(10, 240, 350, 240, { strokeWidth: 6, roughness: viewData.grid[1].roughness,  bowing: viewData.grid[1].bowing, stroke: '#de1a1aff' });
    board.appendChild(node);

    rc = rough.svg(board, {options: {seed: viewData.grid[2].seed}});
    node = rc.line(120, 10, 120, 350, { strokeWidth: 6, roughness: viewData.grid[2].roughness,  bowing: viewData.grid[2].bowing,stroke: '#de1a1aff' });
    board.appendChild(node);

    rc = rough.svg(board, {options: {seed: viewData.grid[3].seed}});
    node = rc.line(240, 10, 240, 350, { strokeWidth: 6, roughness: viewData.grid[3].roughness,  bowing: viewData.grid[3].bowing, stroke: '#de1a1aff' });
    board.appendChild(node);
}

function loadViewData(){
    const data = localStorage.getItem("viewData") ? JSON.parse(localStorage.getItem("viewData")):null;
  
    let processedData = {}
    if(data) processedData = data
    else{
        processedData.background = Math.floor(Math.random()*5)
        processedData.grid = []
        for(let i=0; i<4; i++){
            processedData.grid.push({
                seed:Math.floor(Math.random()*999999)+1,
                roughness:(Math.random()*4)+0.4,
                bowing:(Math.random()*3)+0.1
            })
        }
        saveViewData(processedData)
    }
    main.style.backgroundImage = `url(static/images/${processedData.background}.jpg)`
    return processedData
}

function saveViewData(viewData){
    localStorage.setItem("viewData",JSON.stringify(viewData))
}

function loadBackgroundInfo(viewData){
    backgroundDescriptionTitle.innerText = descriptions[viewData.background].title
    backgroundDescriptionAuthor.innerText = descriptions[viewData.background].author
    backgroundDescriptionOrigin.innerText = descriptions[viewData.background].origin
}

let viewData = loadViewData()
loadBackgroundInfo(viewData)
makeBoard()