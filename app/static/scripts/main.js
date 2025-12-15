//     document.querySelectorAll(".cell").forEach(el => {
//     el.onclick =async (e) => {
//         fetch("/move", {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify({
//                 "player":true,
//                 "pos":el.dataset.index,   
//             })
//         })
//         .then(r => r.json())
//         .then(data => {
//             updateBoard(data.board);
//         });
//         await new Promise(r => setTimeout(r, 2000));
//         fetch("/move", {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify({
//                 "player":false,
//                 "pos":el.dataset.index,   
//             })
//         })
//         .then(r => r.json())
//         .then(data => {
//             updateBoard(data.board);
//         });
//     };
// });

function updateBoard(board){
    document.querySelectorAll(".cell").forEach((c, idx) => {
        const i = Math.floor(idx / 3);
        const j = idx % 3;

        c.classList.remove("x", "o");

        if (board[i][j] === 1) c.classList.add("x");
        if (board[i][j] === -1) c.classList.add("o");
    });
}