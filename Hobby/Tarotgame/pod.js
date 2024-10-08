window.addEventListener("load", generate);
let undrawnhand = new Array(0);
let gamestate = "beginning";
let xpos = undefined;
let ypos = undefined;
let Arcana = 0;
let Confrontation = 0;
let Fortitude = 0;
let endgame = false;
let enemies = [];
let count = 0;
let meltaway = true;
let tarot = 9;
let positions = [];
let bestiary = ["", "Hunger", "Depression", "Fear", "Hatred", "Paranoia"];
let turn = 0;
let life = 3;
if(tarot == 7 || tarot == 21) life = 1;
let defeated = 0;
let progress = 0;
let lunarphase = 0;
let revealtracker = [];
let hermit = false;
document.addEventListener("keydown",shift)
function shift()
{
    if(event.key == "e")
    {
        tarot++;
        generate();
    }
    else if(event.key == "r")
    {
        progress--;
        generate();
    }
}
function generate() {
    document.getElementById('board').innerHTML = "";
    if (tarot == 0) Arcana = Math.floor(Arcana / 2);
    else Arcana = 0;
    Confrontation = 0;
    Fortitude = 0;
    endgame = false;
    gamestate = "beginning";
    turn = 0;
    hermit = false;
    defeated = 0;
    let temp = "";
    for (let i = 0; i < 7; i++) {
        temp += "<tr>"
        for (let j = 0; j < 7; j++) {
            temp += "<td id=" + i + "" + j + "></td>"
        }
        temp += "</tr>"
    }
    document.getElementById('board').innerHTML += temp;
    document.addEventListener("keydown", shortcut);
    newlevel(++progress);
}

function draw(atk, def, arc) {
    undrawnhand = new Array(0);
    for (let i = 0; i < atk; i++) {
        undrawnhand.push("Confrontation");
    }
    for (let i = 0; i < def; i++) {
        undrawnhand.push("Fortitude");
    }
    for (let i = 0; i < arc; i++) {
        undrawnhand.push("Arcana");
    }
    undrawnhand.push("Obstacle");
    undrawnhand.push("Inspiration");
    if(tarot == 5) undrawnhand.push("Blessing");
    else if(tarot == 18) undrawnhand.push("Luna");
    else if(tarot == 6)
    {
        undrawnhand.push("Orace");
        undrawnhand.push("Dame");
    }
    let check = undrawnhand.length + enemies.length;
    for (let i = 0; i < 48 - check; i++) {
        undrawnhand.push("Emptiness");
    }
    undrawnhand = shuffle(undrawnhand);
}

function newlevel(number) {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            let cell = document.getElementById(i + "" + j);
            cell.innerHTML = "<img src=tarot/others/Cardback.png>";
            cell.addEventListener("click", uncover);
        }
    }
    switch (number) {
        case 1:
            enemies = ["Hunger", "Hunger", "Depression", "Depression", "Paranoia"];
            break;
        case 2:
            enemies = ["Depression", "Depression", "Hatred", "Hatred", "Paranoia"];
            break;
        case 3:
            enemies = ["Hunger", "Fear", "Fear", "Paranoia", "Paranoia"];
            break;
        default:
            enemies = ["Hunger", "Depression", "Fear", "Hatred", "Paranoia"];
            break;
    }
    let count = enemies.length;
    positions = [];
    while (count > 0) {
        pos = Math.floor(Math.random() * 7) + "" + Math.floor(Math.random() * 7);
        if (identify(document.getElementById(pos).querySelector("img")) == "Cardback" && positions.indexOf(pos) == -1) {
            positions.push(pos);
            count--;
        }
    }
    if (tarot == 8) draw(8, 0, 10);
    else if(tarot == 9) draw(0,0,0);
    else if(tarot == 10)
    {
        let a = Math.floor(Math.random()*25);
        let b = Math.floor(Math.random()*a);
        let c = 25-b-a;
        draw(c,b,a);
    }
    else if(tarot == 14) draw(0,8,10);
    else if(tarot == 15) draw(0,0,18);
    else if(tarot == 20) draw(9,9,0);
    else draw(5, 5, 8);
    spawn(positions, enemies);
    refresh();
    if(tarot == 19) 
    {
        reveal("Inspiration");
        reveal("Obstacle");
    }
    else if(tarot == 17)
    {
        for (let i = 0; i < 21; i++) {
            reveal("Arcana");            
        }
    }
}

function spawn(positions, enemies) {
    for (let index = 0; index < positions.length; index++) {
        if (enemies[index] == "Fear") continue;
        let pos = positions[index];
        let cell = document.getElementById(pos);
        let img = cell.querySelector("img");
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                img.style.width = 9.5 * (10 - i) + 'px';
            }, i * 40);
        }
        let monster = enemies[index];
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                img.src = "./tarot/Enemy/" + monster + ".png";
                img.style.width = 9.5 * i + 'px';
            }, 400 + i * 40);
        }
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


function uncover() {
    if (gamestate == "beginning" && identify(this.querySelector('img')) == "Cardback") {
        gamestate = "";
        let img = this.querySelector('img');
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                img.style.width = 9.5 * (10 - i) + 'px';
            }, i * 20);
        }
        let next = "";
        switch (tarot) {
            case 0:
                next = "The Fool";
                break;
            case 1:
                next = "The Magician";
                break;
            case 2:
                next = "The High Priestess";
                break;
            case 3:
                next = "The Empress";
                break;
            case 4:
                next = "The Emperor";
                break;
            case 5:
                next = "The Hierophant";
                break;
            case 6:
                next = "The Lovers";
                break;
            case 7:
                next = "The Chariot";
                break;
            case 8:
                next = "Strength";
                break;
            case 9:
                next = "The Hermit";
                break;
            case 10:
                next = "The Wheel of Fortune";
                break;
            case 11:
                next = "Justice";
                break;
            case 12:
                next = "The Hanged Man";
                break;
            case 13:
                next = "Death";
                break;
            case 14:
                next = "Temperance";
                break;
            case 15:
                next = "The Devil";
                break;
            case 16:
                next = "The Tower";
                break;
            case 17:
                next = "The Star";
                break;
            case 18:
                next = "The Moon";
                break;
            case 19:
                next = "The Sun";
                break;
            case 20:
                next = "Judgement";
                break;
            case 21:
                next = "The World";
                break;
            default:
                next = "Unknown Tarot Card";
                break;
        }
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                img.src = "tarot/Characters/" + next + ".png";
                img.style.width = 9.5 * i + 'px';
            }, 200 + i * 20);
            setTimeout(() => {
                xpos = this.id[1];
                ypos = this.id[0];
                gamestate = "Move";
            }, 400);
        }
    }
    else if(gamestate == "beginning" && tarot == 11)
    {
        if(positions.indexOf(this.id) == -1 || bestiary.indexOf(enemies[positions.indexOf(this.id)]) > progress) return;
        enemies[positions.indexOf(this.id)] = "";
        positions[positions.indexOf(this.id)] = "";
        undrawnhand.push("Emptiness");
        gamestate = "";
        let img = this.querySelector('img');
        img.src = "tarot/Characters/Justice.png";
        img.style.width = 190 + "px";
        img.style.height = 230 + "px";
        const rect = img.getBoundingClientRect();
        const originalTop = rect.top;
        const originalLeft = rect.left;
        img.style.position = 'absolute';
        img.style.top = originalTop + 'px';
        img.style.left = originalLeft+55 + 'px';
        img.style.zIndex=1000;
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                img.style.height = 230-(11.5 * i) + 'px';
                img.style.width = 190-(9.5*i) +'px';
            }, i * 20);
            setTimeout(() => {
                xpos = this.id[1];
                ypos = this.id[0];
                gamestate = "Move";
                img.removeAttribute("style");
            }, 200);
        }
    }
    else if (gamestate == "Move" && adjacent(this.id, charpos())) {
        turn++;
        if (identify(this.querySelector("img")) == "Cardback") {
            gamestate = "";
            let img = this.querySelector('img');
            for (let i = 1; i < 11; i++) {
                setTimeout(() => {
                    img.style.width = 9.5 * (10 - i) + 'px';
                }, i * 20);
            }
            if (positions.indexOf(this.id) != -1) {
                for (let i = 1; i < 11; i++) {
                    setTimeout(() => {
                        img.src = "tarot/Enemy/Fear.png";
                        img.style.width = 9.5 * i + 'px';
                    }, 200 + i * 20);
                }
            }
            else {
                let next = undrawnhand.pop();
                for (let i = 1; i < 11; i++) {
                    setTimeout(() => {
                        img.src = "tarot/others/" + next + ".png";
                        img.style.width = 9.5 * i + 'px';
                    }, 200 + i * 20);
                }
            }
            setTimeout(() => {
                if(hermit)
                {
                    hermit = false;
                    let min = 20;
                    let choice = [];
                    if(Arcana < min) min=Arcana;
                    if(Confrontation < min) min=Confrontation;
                    if(Fortitude < min) min=Fortitude;
                    if(Arcana == min) choice.push("Arcana");
                    if(Confrontation == min) choice.push("Confrontation");
                    if(Fortitude == min) choice.push("Fortitude");
                    let chosen = choice[Math.floor(Math.random()*choice.length)];
                    switch (chosen) {
                        case "Arcana":
                            Arcana++;
                            break;
                        case "Fortitude":
                            Fortitude++;
                            break;
                        case "Confrontation":
                            Confrontation++;
                            break;
                        default:
                            break;
                    }
                    refresh();
                }
                else hermit = true;
                gamestate = "Enemies";
                enemyturn();
            }, 400);
        }
        else if (positions.indexOf(this.id) != -1) {
            gamestate = "";
            banish(this.id, identify(this.querySelector("img")));
            setTimeout(() => {
                gamestate = "Enemies";
                enemyturn();
            }, 400);
        }
        else {
            gamestate = "";
            swap(this.id, charpos());
            setTimeout(() => {
                if(tarot == 7) gamestate = "Move";
                else
                {
                    gamestate = "Enemies";
                    enemyturn();
                }
            }, 400);
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
    else 
    {
        if (one[0] > two[0]) {
            let temp = one;
            one = two;
            two = temp;
        }
        moveCards(one,two,false,123,20);
    }
}

function moveCards(one, two, horizontal, distance, steps) {
    document.getElementById(one).querySelector("img").style.zIndex = 0;
    document.getElementById(two).querySelector("img").style.zIndex = 0;
    if (one == charpos()) document.getElementById(one).querySelector("img").style.zIndex = 999;
    else document.getElementById(two).querySelector("img").style.zIndex = 999;
    let stepSize = distance / steps;
    for (let i = 1; i <= steps; i++) {
        setTimeout(() => {
            if (endgame) return;
            let offset = stepSize * i;
            if(horizontal)
            {
                document.getElementById(one).querySelector("img").style.right = `-${offset}px`;
                document.getElementById(two).querySelector("img").style.right = `${offset}px`;
            }
            else
            {
                document.getElementById(one).querySelector("img").style.top = `${offset}px`;
                document.getElementById(two).querySelector("img").style.top = `-${offset}px`;
            }
            if (i === Math.floor(steps / 2) && (one == charpos() || two == charpos())) {
                handleCard(one,two);
            }
            else if (i === steps) {
                if (horizontal) {
                    document.getElementById(one).querySelector("img").style.right = "0";
                    document.getElementById(two).querySelector("img").style.right = "0";
                }
                else {
                    document.getElementById(one).querySelector("img").style.top = "0";
                    document.getElementById(two).querySelector("img").style.top = "0";
                }
                temp = document.getElementById(one).querySelector("img").src;
                document.getElementById(one).querySelector("img").src = document.getElementById(two).querySelector("img").src;
                document.getElementById(two).querySelector("img").src = temp;
                if (charpos() == two) setpos(one);
                else if (charpos() == one) setpos(two);
            }
        }, i * 15);
    }
}

function handleCard(one,two)
{
    let identity = "";
                if (one == charpos()) identity = identify(document.getElementById(two).querySelector("img"));
                else identity = identify(document.getElementById(one).querySelector("img"));
                meltaway = true;
                if (identity == "Arcana") {
                    if (Arcana < 8) {
                        Arcana++;
                        if (Arcana > 3 && life < 3 && tarot == 2) {
                            Arcana = Arcana - 4;
                            life++;
                        }
                    }
                    else meltaway = false;
                }
                if (identity == "Confrontation") Confrontation++;
                else if (identity == "Fortitude") Fortitude++;
                refresh();
                if (identity == "Inspiration")  open();
                else if (identity == "blessing")
                {
                    if(life<3) life++;
                    else meltaway = false;
                }
                else if(identity == "luna")
                {
                    lunarphase = 10;
                    document.querySelector("body").classList.add("eclipse");
                } 
                else if (identity == "Obstacle") meltaway = false;
                else if (identity == "Conclusion") {
                    document.getElementById('board').innerHTML = "";
                    gamestate = "limbo";
                    setTimeout(() => {
                        generate();
                    }, 300);
                    return;
                }
                else if(identity == "Orace")
                {
                    for (let i = 0; i < 10; i++) {
                        reveal("Confrontation");                      
                    }
                }
                else if(identity == "Dame")
                {
                    for (let i = 0; i < 10; i++) {
                        reveal("Fortitude");                      
                    }
                }
                if (meltaway) {
                    if (charpos() == two) document.getElementById(one).querySelector("img").src = "./tarot/others/Emptiness.png";
                    else document.getElementById(two).querySelector("img").src = "./tarot/others/Emptiness.png";
                }
}
function identify(img) {
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Cardback.png") return "Cardback";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Arcana.png") return "Arcana";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Confrontation.png") return "Confrontation";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Fortitude.png") return "Fortitude";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Emptiness.png") return "Emptiness";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Obstacle.png") return "Obstacle";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Inspiration.png") return "Inspiration";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Conclusion.png") return "Conclusion";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/Enemy/Paranoia.png") return "Paranoiasleep";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/Enemy/Paranoia_awoken.png") return "Paranoia";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/Enemy/Depression.png") return "Depression";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/Enemy/Hunger.png") return "Hunger";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/Enemy/Hatred.png") return "Hatred";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/Enemy/Fear.png") return "Fear";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/heart.png") return "heart";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/corrupted.png") return "corrupted";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Filled.png") return "filled";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Empty.png") return "empty";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/corrupted.png") return "corrupted";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Blessing.png") return "blessing";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Luna.png") return "luna";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Orace.png") return "Orace";
    if (img.src == "file:///D:/User/Peter/Documents/hobby/tarot/others/Dame.png") return "Dame";
    return "Reader";
}

function refresh() {
    document.getElementById("swords").src = "./tarot/others/" + Confrontation + "Sword.png";
    document.getElementById("shields").src = "./tarot/others/" + Fortitude + "Shield.png";
    for (let i = 1; i < 9; i++) {
        const img = document.getElementById(i);
        if (Arcana >= i) {
            if (identify(img) == "empty") {
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
            if (identify(img) == "filled") {
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

function enemyturn() {
    if(defeated == enemies.length && undrawnhand.length>0)
    {
        defeated = 0;
        refresh();
        revelation();
        setTimeout(() => {
            gamestate = "Move";
            turn++;
        }, 400);
        return;
    }
    if(lunarphase > 0)
    {
        lunarphase--;
        if(lunarphase == 0) document.querySelector("body").classList.remove("eclipse");
        gamestate = "Move";
        return;
    }
    let counter = 0;
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i] == "") continue;
        else if (enemies[i] == "Hunger" && (Arcana + Confrontation + Fortitude == 0)) continue;
        else if (enemies[i] == "Depression" && positions[i][0] != ypos && positions[i][1] != xpos) continue;
        else if (enemies[i] == "Fear" && turn > 1 && identify(document.getElementById(positions[i]).querySelector("img")) != "Fear") continue;
        else if (enemies[i] == "Hatred" && (Math.abs(ypos - positions[i][0]) >= 2 || Math.abs(xpos - positions[i][1]) >= 2)) continue;
        else if (enemies[i] == "Paranoia" && identify(document.getElementById(positions[i]).querySelector("img")) == "Paranoiasleep" && (Math.abs(ypos - positions[i][0]) + Math.abs(xpos - positions[i][1])) > 2) continue;
        else {
            setTimeout(() => {
                activate(enemies[i], positions[i], i);
            }, counter * 205);
            counter++;
        }
    }
    setTimeout(() => {
        gamestate = "Move";
        turn++;
    }, 200 * (counter - 1));
}

function activate(type, pos, index) {
    switch (type) {
        case "Hunger":
            if (Confrontation + Arcana + Fortitude == 0) break;
            let options = [];
            img = document.getElementById(pos).querySelector("img");
            if (adjacent(pos, charpos())) {
                attack(1, "consume", pos);
                break;
            }
            chase(pos, index);
            break;
        case "Depression":
            if (ypos == pos[0] || xpos == pos[1]) attack(2, "enrage", pos);
            break;
        case "Fear":
            if (turn == 1) {
                let continuation = true;
                while (continuation) {
                    let trial = Math.floor(Math.random() * 7) + "" + Math.floor(Math.random() * 7);
                    if (positions.indexOf(trial) == -1 && !(adjacent(charpos(), trial)) && charpos() != trial) {
                        continuation = false;
                        positions[index] = trial;
                        pos = trial;
                        let options = [];
                        if (pos[0] > 0 && positions.indexOf((--pos[0]) + "" + pos[1]) == -1) options.push("up");
                        if (pos[0] < 6 && positions.indexOf((++pos[0]) + "" + pos[1]) == -1) options.push("down");
                        if (pos[1] > 0 && positions.indexOf(pos[0] + "" + (--pos[1])) == -1) options.push("left");
                        if (pos[1] < 6 && positions.indexOf(pos[0] + "" + (++pos[1])) == -1) options.push("right");
                        if (options.length == 2) {
                            flip = Math.floor(Math.random() * 2);
                            options[0] = options[flip];
                        }
                        switch (options[0]) {
                            case "down":
                                positions[index] = ++pos[0] + "" + pos[1];
                                swap(pos, ++pos[0] + "" + pos[1]);
                                break;
                            case "up":
                                positions[index] = --pos[0] + "" + pos[1];
                                swap(pos, --pos[0] + "" + pos[1]);
                                break;
                            case "left":
                                positions[index] = pos[0] + "" + --pos[1];
                                swap(pos, pos[0] + "" + --pos[1]);
                                break;
                            case "right":
                                positions[index] = pos[0] + "" + ++pos[1];
                                swap(pos, pos[0] + "" + ++pos[1]);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            else {
                if (adjacent(pos, charpos())) {
                    attack(3, "", pos);
                }
                else {
                    chase(pos, index);
                }
            }
            break;
        case "Hatred":
            if (Math.abs(ypos - pos[0]) < 2 && Math.abs(xpos - pos[1]) < 2) attack(4, "", pos);
            break;
        case "Paranoia":
            if (identify(document.getElementById(pos).querySelector("img")) == "Paranoiasleep") {
                if ((Math.abs(ypos - pos[0]) + Math.abs(xpos - pos[1])) < 3) document.getElementById(pos).querySelector("img").src = "./tarot/Enemy/Paranoia_awoken.png";
            }
            else {
                if (adjacent(pos, charpos())) {

                    attack(5, "", pos);
                    break;
                }
                else {
                    chase(pos, index);
                }
            }
            break;
        default:
            break;
    }
}

function attack(value, modifier, pos) {
    const img = document.getElementById(pos).querySelector("img");
    const rect = img.getBoundingClientRect();
    const originalTop = rect.top;
    const originalLeft = rect.left;
    img.style.position = 'absolute';
    img.style.top = originalTop + 'px';
    img.style.left = originalLeft + 'px';
    img.style.zIndex = 1000;
    for (let i = 1; i < 11; i++) {
        setTimeout(() => {
            const newWidth = 95 * (1 + i / 10);
            const newHeight = 115 * (1 + i / 10);
            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
            img.style.left = (originalLeft - ((newWidth - 115) / 2)) + 'px';
            img.style.top = (originalTop - ((newHeight - 95) / 2)) + 'px';
        }, i * 10);
    }

    setTimeout(() => {
        power = value;
        if (Arcana + Fortitude >= power) {
            if (power > Fortitude) Arcana = Arcana - (power - Fortitude);
            if(tarot == 14) banish(pos,"revenge");
        } else {
            life--;
        }
        if (modifier === "consume") {
            let options = [];
            if (Arcana > 0) options.push("a");
            if (Fortitude > 0) options.push("f");
            if (Confrontation > 0) options.push("c");
            flip = Math.floor(Math.random() * options.length);
            options[0] = options[flip];
            switch (options[0]) {
                case "a":
                    Arcana--;
                    break;
                case "f":
                    Fortitude--;
                    break;
                case "c":
                    Confrontation--;
                    break;
                default:
                    break;
            }
        }
        refresh();
    }, 150);

    for (let i = 1; i < 11; i++) {
        setTimeout(() => {
            const newWidth = 95 * (1 + (10 - i) / 10);
            const newHeight = 115 * (1 + (10 - i) / 10);
            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
            img.style.left = (originalLeft - ((newWidth - 115) / 2)) + 'px';
            img.style.top = (originalTop - ((newHeight - 95) / 2)) + 'px';
        }, 150 + i * 10);
    }

    setTimeout(() => {
        img.removeAttribute('style');
    }, 251);
}

function chase(pos, index) {
    let options = [];
    if (pos[0] > ypos && positions.indexOf((--pos[0]) + "" + pos[1]) == -1) options.push("up");
    else if (pos[0] < ypos && positions.indexOf((++pos[0]) + "" + pos[1]) == -1) options.push("down");
    if (pos[1] > xpos && positions.indexOf(pos[0] + "" + (--pos[1])) == -1) options.push("left");
    else if (pos[1] < xpos && positions.indexOf(pos[0] + "" + (++pos[1])) == -1) options.push("right");
    if (options.length == 2) {
        flip = Math.floor(Math.random() * 2);
        options[0] = options[flip];
    }
    switch (options[0]) {
        case "down":
            swap(pos, ++pos[0] + "" + pos[1]);
            positions[index] = ++pos[0] + "" + pos[1];
            break;
        case "up":
            swap(pos, --pos[0] + "" + pos[1]);
            positions[index] = --pos[0] + "" + pos[1];
            break;
        case "left":
            swap(pos, pos[0] + "" + --pos[1]);
            positions[index] = pos[0] + "" + --pos[1];
            break;
        case "right":
            swap(pos, pos[0] + "" + ++pos[1]);
            positions[index] = pos[0] + "" + ++pos[1];
            break;
        default:
            break;
    }
}

function banish(id, type) {
    let power = bestiary.indexOf(type);
    if (Arcana + Confrontation >= power) {
        if (power > Confrontation) Arcana = Arcana - (power - Confrontation);
        if(tarot == 15) document.getElementById(id).querySelector("img").src = "./tarot/others/Arcana.png";
        else document.getElementById(id).querySelector("img").src = "./tarot/others/Emptiness.png";
        if(tarot == 8 && life<3) life++;
        enemies[positions.indexOf(id)] = "";
        positions[positions.indexOf(id)] = "";
        refresh();
        defeated++;
    }
    else if(tarot == 14 && type == "revenge")
    {
        document.getElementById(id).querySelector("img").src = "./tarot/others/Emptiness.png";
        enemies[positions.indexOf(id)] = "";
        positions[positions.indexOf(id)] = "";
        refresh();
        defeated++;
    }
    if(defeated == enemies.length && undrawnhand.length>0)
    {
        defeated = 0;
        refresh();
        revelation();
        setTimeout(() => {
            gamestate = "Move";
            turn++;
        }, 800);
        return;
    }
}

function revelation()
{
    while(undrawnhand.length>0)
    {
        reveal(undrawnhand[0]);
    }
}

function reveal(identity)
{
    if(undrawnhand.indexOf(identity) == -1) return;
    undrawnhand.splice(undrawnhand.indexOf(identity),1);
    let a = Math.floor(Math.random()*7);
    let b = Math.floor(Math.random()*7);
    index = a + "" + b;
    while(revealtracker.indexOf(index) != -1 || positions.indexOf(index) != -1 || identify(document.getElementById(index).querySelector("img")) != "Cardback")
    {
        a = Math.floor(Math.random()*7);
        b = Math.floor(Math.random()*7);
        index = a + "" + b;
    }
    revealtracker.push(index);
    let img = document.getElementById(index).querySelector('img');
    for (let i = 1; i < 11; i++) {
        setTimeout(() => {
            img.style.width = 9.5 * (10 - i) + 'px';
        }, i * 40);
    }
    for (let i = 1; i < 11; i++) {
        setTimeout(() => {
            img.src = "tarot/others/" + identity + ".png";
            img.style.width = 9.5 * i + 'px';
            revealtracker.splice(revealtracker.indexOf(index),1);
        }, 400 + i * 40);
    }
}