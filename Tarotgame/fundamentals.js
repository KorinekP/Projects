function charpos() {
    return ypos + "" + xpos;
}
function setpos(id) {
    xpos = id[1];
    ypos = id[0];
}
function swap(one, two) {
    if (one[0] == two[0]) {
        if (one[1] > two[1]) {
            let temp = one;
            one = two;
            two = temp;
        }
        moveCards(one, two, true, 99, 20);
    }
    else {
        if (one[0] > two[0]) {
            let temp = one;
            one = two;
            two = temp;
        }
        moveCards(one, two, false, 123, 20);
    }
}
function shortcut(event) {
    if (gamestate == "Move") {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                let cell = document.getElementById(i + "" + j);
                if (event.key == "a" || event.key == "ArrowLeft") {
                    if (cell.id[0] == ypos && cell.id[1] - xpos == -1) cell.click();
                } else if (event.key == "s" || event.key == "ArrowDown") {
                    if (cell.id[1] == xpos && cell.id[0] - ypos == 1) cell.click();
                } else if (event.key == "d" || event.key == "ArrowRight") {
                    if (cell.id[0] == ypos && cell.id[1] - xpos == 1) cell.click();
                } else if (event.key == "w" || event.key == "ArrowUp") {
                    if (cell.id[1] == xpos && cell.id[0] - ypos == -1) cell.click();
                }
            }
        }
    }
}
function shuffle(array) {
    let goal = array.length;
    let newArray = new Array();
    for (let index = 0; index < goal; index++) {
        let rand = Math.floor(Math.random() * array.length);
        newArray.push(array[rand]);
        array.splice(rand, 1);
    }
    console.log(newArray);
    return newArray;
}
function adjacent(id1, id2) {
    let decide = false;
    if (Math.abs(id1[0] - id2[0]) == 1 && Math.abs(id1[1] - id2[1]) == 0) decide = true;
    if (Math.abs(id1[0] - id2[0]) == 0 && Math.abs(id1[1] - id2[1]) == 1) decide = true;
    return decide;
}
function moveCards(one, two, horizontal, distance, steps) {
    let imgone = document.getElementById(one).querySelector("img");
    let imgtwo = document.getElementById(two).querySelector("img");
    imgone.style.zIndex = 0;
    imgtwo.style.zIndex = 0;
    if (one == charpos()) imgone.style.zIndex = 999;
    else imgtwo.style.zIndex = 999;
    let stepSize = distance / steps;
    for (let i = 1; i <= steps; i++) {
        setTimeout(() => {
            if (endgame) return;
            let offset = stepSize * i;
            if(document.getElementById(one) == null || document.getElementById(two) == null) return;
            if (horizontal) {
                imgone.style.right = `-${offset}px`;
                imgtwo.style.right = `${offset}px`;
            }
            else {
                imgone.style.top = `${offset}px`;
                imgtwo.style.top = `-${offset}px`;
            }
            let aid = ["Arcana","Fortitude","Confrontation","GreedArcana", "GreedFortitude", "GreedConfrontation"];
            if (i === Math.floor(steps / 2) && (one == charpos() || two == charpos())) {
                handleCard(one, two);
            }
            else if (aid.includes(identify(imgone)) && aid.includes(identify(imgtwo)))
            {
                if(positions.includes(one) && !positions.includes(two)) imgone.src = "./tarot/others/Emptiness.png";
                else if((positions.includes(two) && !positions.includes(one))) imgtwo.src = "./tarot/others/Emptiness.png";
            }
            else if (i === steps) {
                imgone.style.right = "0";
                imgtwo.style.right = "0";
                imgone.style.top = "0";
                imgtwo.style.top = "0";
                temp = imgone.src;
                imgone.src = imgtwo.src;
                imgtwo.src = temp;
                if (charpos() == two) setpos(one);
                else if (charpos() == one) setpos(two);
            }
        }, i * 15);
    }
}
function shift() {
    if (event.key == "e") {
        tarot++;
        progress--;
        generate();
    }
    else if (event.key == "r") {
        progress--;
        generate();
    }
    else if (event.key == "q") {
        generate();
    }
}
function open() {
    if (undrawnhand.findIndex(card => card === "Obstacle") != -1) {
        undrawnhand[undrawnhand.findIndex(card => card === "Obstacle")] = "Conclusion";
    }
    else {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (identify(document.getElementById(i + "" + j).querySelector("img")) == "Obstacle") document.getElementById(i + "" + j).querySelector("img").src = document.getElementById(i + "" + j).querySelector("img").src = "./tarot/others/Conclusion.png";
            }
        }
    }
}
function revelation() {
    for (let i = 0; i < positions.length; i++) {
        if(positions[i] == "") continue;
        else (banish(positions[i],"banishment"));        
    }
    while (undrawnhand.length > 0) {
        reveal(undrawnhand[0]);
    }
}
function identify(img) {
    let filename = img.src.split('/').pop().replace('.png', '');
    if (["0", "10", "15", "20"].includes(filename)) {
        return "Price";
    } else {
        return filename;
    }
}
function refresh() {
    document.getElementById("swords").src = "./tarot/others/" + Confrontation + "Sword.png";
    document.getElementById("shields").src = "./tarot/others/" + Fortitude + "Shield.png";
    document.getElementById("essence").innerHTML=essence;
    for (let i = 1; i < 9; i++) {
        const img = document.getElementById(i);
        if (Arcana >= i) {
            if (identify(img) == "Empty") {
                for (let j = 0; j < 10; j++) {
                    setTimeout(() => {
                        img.style.opacity = ((10 - j) * 10) + "%";
                    }, j * 10);
                }
                setTimeout(() => {
                    img.src = "./tarot/others/Filled.png";
                }, 100);
                for (let j = 1; j < 11; j++) {
                    setTimeout(() => {
                        img.style.opacity = (j * 10) + "%";
                    }, 100 + j * 10);
                }
            }
        } else {
            if (identify(img) == "Filled") {
                for (let j = 0; j < 10; j++) {
                    setTimeout(() => {
                        img.style.opacity = ((10 - j) * 10) + "%";
                    }, j * 10);
                }
                setTimeout(() => {
                    img.src = "./tarot/others/Empty.png";
                }, 100);
                for (let j = 1; j < 11; j++) {
                    setTimeout(() => {
                        img.style.opacity = (j * 10) + "%";
                    }, 100 + j * 10);
                }
            }
        }
    }
    if(life == 0 && tarot == 16 && tower)
    {
        life++;
        document.querySelector("body").classList.add("tower");
        tower = false;
        revelation();
    }
    for (let i = 1; i < 4; i++) {
        if (life >= i) {
            if (identify(document.getElementById("heart" + (i))) == "corrupted") {
                for (let j = 0; j < 10; j++) {
                    setTimeout(() => {
                        document.getElementById("heart" + (i)).style.opacity = ((10 - j) * 10) + "%";
                    }, j * 10);
                }
                setTimeout(() => {
                    document.getElementById("heart" + (i)).src = "./tarot/others/heart.png";
                }, 100);
                for (let j = 1; j < 11; j++) {
                    setTimeout(() => {
                        document.getElementById("heart" + (i)).style.opacity = (j * 10) + "%";
                    }, 100 + j * 10);
                }
            }
            else document.getElementById("heart" + (i)).src = "./tarot/others/heart.png";
        }
        else {
            if (identify(document.getElementById("heart" + (i))) == "heart") {

                for (let j = 0; j < 10; j++) {
                    setTimeout(() => {
                        document.getElementById("heart" + (i)).style.opacity = ((10 - j) * 10) + "%";
                    }, j * 10);
                }
                setTimeout(() => {
                    document.getElementById("heart" + (i)).src = "./tarot/others/corrupted.png";
                }, 100);
                for (let j = 1; j < 11; j++) {
                    setTimeout(() => {
                        document.getElementById("heart" + (i)).style.opacity = (j * 10) + "%";
                    }, 100 + j * 10);
                }
            }
            else document.getElementById("heart" + (i)).src = "./tarot/others/corrupted.png";
        }
    }
}