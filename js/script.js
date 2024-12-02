var positionLeft = 0;
var positionUp = document.querySelector('h1').offsetHeight;
var movement = 1;
var previousPositionLeft = positionLeft;
var previousPositionUp = positionUp;
var bags = [];
var plates = [];
var imagesTouched = 0;
var touchedImagesSet = new Set();

window.onload = function () {
    var cat = document.getElementById("cat");
    cat.style.left = positionLeft + "px";
    cat.style.top = positionUp + "px";

    bags = distributeImages('bag', 5);
    plates = distributeImages('plate', 5);

    cat.style.zIndex = 10;
};

function distributeImages(type, count) {
    const background = document.getElementById("background");
    const headerHeight = document.querySelector('h1').offsetHeight;
    const occupiedPositions = [];
    const imagesArray = [];

    for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        img.src = `./assets/img/${type}.png`;
        img.alt = type;

        let x, y;
        let isPositionValid;

        do {
            const col = Math.floor(Math.random() * (15));
            const row = Math.floor(Math.random() * (10 - Math.floor(headerHeight / (50))));

            x = col * (60);
            y = row * (50) + headerHeight;

            isPositionValid = true;

            for (const pos of occupiedPositions) {
                if (isOverlapping(x, y, pos.x, pos.y)) {
                    isPositionValid = false;
                    break;
                }
            }

            if (isOverlapping(x, y, positionLeft, positionUp)) {
                isPositionValid = false;
            }
        } while (!isPositionValid);

        img.style.position = 'absolute';
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        background.appendChild(img);
        occupiedPositions.push({ x: x, y: y });
        imagesArray.push(img);
    }

    return imagesArray;
}

function isOverlapping(x1, y1, x2, y2) {
    const size = (60);
    return !(x1 > x2 + size ||
        x1 + size < x2 ||
        y1 > y2 + size ||
        y1 + size < y2);
}

document.onkeydown = function (e) {
    const headerHeight = document.querySelector('h1').offsetHeight;
    movement = (movement == (1)) ? (2) : (1);

    previousPositionLeft = positionLeft;
    previousPositionUp = positionUp;

    let newPositionLeft = positionLeft;
    let newPositionUp = positionUp;

    if (e.keyCode == (37)) {
        newPositionLeft -= (60);
        newPositionLeft = Math.max(newPositionLeft, (0));

    } else if (e.keyCode == (39)) {
        newPositionLeft += (60);
        newPositionLeft = Math.min(newPositionLeft, document.getElementById("background").clientWidth - document.getElementById("cat").clientWidth);

    } else if (e.keyCode == (38)) {
        newPositionUp -= (50);
        newPositionUp = Math.max(newPositionUp, headerHeight);

    } else if (e.keyCode == (40)) {
        newPositionUp += (50);
        newPositionUp = Math.min(newPositionUp, document.getElementById("background").clientHeight - document.getElementById("cat").clientHeight);
    }

    if ((newPositionLeft !== positionLeft) || (newPositionUp !== positionUp)) {
        positionLeft = newPositionLeft;
        positionUp = newPositionUp;
        moveCat();
    }
}

function moveCat() {
    const cat = document.getElementById("cat");
    cat.style.left = positionLeft + "px";
    cat.style.top = positionUp + "px";

    cat.src = `./assets/img/${getDirection()}` + movement + ".png";

    checkCollision();
}

function getDirection() {
    if (positionLeft < previousPositionLeft) return 'left';
    if (positionLeft > previousPositionLeft) return 'right';
    if (positionUp < previousPositionUp) return 'up';
    if (positionUp > previousPositionUp) return 'down';
}

function checkCollision() {
    const catRectX1 = positionLeft;
    const catRectY1 = positionUp;

    const catRectX2 = catRectX1 + (60);
    const catRectY2 = catRectY1 + (50);

    [...bags, ...plates].forEach((img) => {
        const imgRectX1 = parseInt(img.style.left);
        const imgRectY1 = parseInt(img.style.top);

        const imgRectX2 = imgRectX1 + (60);
        const imgRectY2 = imgRectY1 + (50);

        if (
            catRectX1 < imgRectX2 &&
            catRectX2 > imgRectX1 &&
            catRectY1 < imgRectY2 &&
            catRectY2 > imgRectY1
        ) {
            if (!touchedImagesSet.has(img)) {
                touchedImagesSet.add(img);
                img.remove();

                imagesTouched++;

                if (imagesTouched === 10) {
                    document.getElementById("congratulations").style.display = "block";
                }
            }
        }
    });
}

document.getElementById("start-button").onclick = function () {
    document.getElementById("welcome").style.display = "none";
};

document.getElementById("restart-button").onclick = function () {

    positionLeft = 0;
    positionUp = document.querySelector('h1').offsetHeight;

    imagesTouched = 0;
    touchedImagesSet.clear();

    document.getElementById("congratulations").style.display = "none";

    const cat = document.getElementById("cat");
    cat.src = './assets/img/down1.png';
    cat.style.left = '0px';
    cat.style.top = positionUp + 'px';

    bags.forEach(bag => bag.remove());
    plates.forEach(plate => plate.remove());
    bags = distributeImages('bag', 5);
    plates = distributeImages('plate', 5);

    document.getElementById("welcome").style.display = "block";
};