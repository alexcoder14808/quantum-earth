let points = localStorage.getItem("points") || 0;

document.addEventListener("DOMContentLoaded", () => {
    const pointDisplay = document.getElementById("points");

    if(pointDisplay){
        pointDisplay.textContent = points;
    }
});

function addPoints(amount){
    points = Number(points) + amount;
    localStorage.setItem("points", points);
}
