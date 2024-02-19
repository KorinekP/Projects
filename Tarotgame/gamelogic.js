window.addEventListener("load", setup());
function setup() {
    undrawnhand = new Array(0);
    gamestate = "beginning";
    xpos = undefined;
    ypos = undefined;
    Arcana = 0;
    Confrontation = 0;
    Fortitude = 0;
    endgame = false;
    enemies = [];
    count = 0;
    meltaway = true;
    tarot = 0;   //Change character
    check = 0;
    positions = [];
    bestiary = ["", "Hunger", "Depression", "Fear", "Hatred", "Paranoia_awoken", "Vengance", "Imprisonment", "Greed", "Insanity", "Derilium_awoken"];
    turn = 0;
    life = 3;
    if (tarot == 7 || tarot == 21) life = 1;
    defeated = 0;
    progress = 7;   //Change level. shop is 4
    lunarphase = 0;
    lastaction = "";
    revealtracker = [];
    hermit = false;
    tower = true;
    essence = progress * 15;
    stock = [];
    inventory = [];
    encounter = "normal";
    lastaction;
    document.addEventListener("keydown", shift);
    generate();
}

function draw(atk, def, arc) {
    if (inventory.includes("3Sword")) atk = atk + 3;
    if (inventory.includes("3Shield")) def = def + 3;
    if (inventory.includes("5Arcana")) arc = arc + 5;
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
    if (!enemies.includes("Imprisonment")) undrawnhand.push("Inspiration");
    if (tarot == 5) undrawnhand.push("Blessing");
    else if (tarot == 18) undrawnhand.push("Luna");
    else if (tarot == 6) {
        undrawnhand.push("Orace");
        undrawnhand.push("Dame");
    }
    check = 48 - undrawnhand.length - enemies.length;
    for (let i = 0; i < check; i++) {
        undrawnhand.push("Emptiness");
    }
    undrawnhand = shuffle(undrawnhand);
}

function generate() {
    console.log(inventory);
    document.getElementById('board').innerHTML = "";
    document.querySelector("body").classList = [];
    if (progress == 4) Arcana = Arcana;
    else if (tarot == 0) Arcana = Math.floor(Arcana / 2);
    else Arcana = 0;
    if (inventory.includes("Arcanapotion")) { Arcana = Arcana + 4; inventory.splice(inventory.indexOf("Arcanapotion"), 1); }
    Confrontation = 0;
    if (inventory.includes("Startsword")) Confrontation++;
    Fortitude = 0;
    if (inventory.includes("Startshield")) Fortitude++;
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

function newlevel(level) {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            let cell = document.getElementById(i + "" + j);
            cell.innerHTML = "<img src=tarot/others/Cardback.png>";
            cell.addEventListener("click", uncover);
        }
    }
    switch (level) {
        case 1:
            encounter = "normal";
            enemies = ["Hunger", "Hunger", "Depression", "Depression", "Paranoia"];
            break;
        case 2:
            encounter = "normal";
            enemies = ["Depression", "Depression", "Hatred", "Hatred", "Paranoia"];
            break;
        case 3:
            encounter = "normal";
            enemies = ["Hunger", "Fear", "Fear", "Paranoia", "Paranoia"];
            break;
        case 4:
            encounter = "normal";
            enemies = ["Hunger", "Depression", "Fear", "Hatred", "Paranoia"];
            break;
        case 5:
            if (life == 3) stock = ["Arcanapotion", "Startsword", "Startshield", "3Sword", "3Shield", "5Arcana", "Door"];
            else stock = ["Healthpotion", "Startsword", "Startshield", "3Sword", "3Shield", "5Arcana", "Door"];
            price = ["10", "20", "20", "15", "15", "15"];
            if (tarot == 3) price[Math.floor(Math.random() * 6)] = 0;
            indexes = [1, 1, 1, 1, 1, 1, 1];
            for (let i = 0; i < 7; i++) {
                indexes[i] = Math.floor(Math.random() * 6);
                if (i == 6 && indexes[i] == 0) indexes[i]++;
            }
            encounter = "midshop";
            break;
        case 6: 
        case 7:
            encounter = "normal";
            enemies = ["Vengance", "Vengance", "Hunger", "Hunger", "Hunger", "Imprisonment"];
            break;
        case 8:
            encounter = "normal";
            enemies = ["Depression", "Hatred", "Hatred", "Insanity", "Insanity"];
            break; 
        case 9:
            encounter = "normal";
            enemies = ["Vengance", "Vengance", "Depression", "GreedArcana", "GreedFortitude","GreedConfrontation"];
            break;
        default:
            enemies = ["Vengance", "Vengance", "Depression", "GreedArcana", "GreedFortitude","GreedConfrontation"];
            break;
    }
    if (encounter == "midshop") {
        for (let i = 0; i < 48; i++) {
            undrawnhand.push("Emptiness");
        }
        console.log(undrawnhand);
        revelation();
        refresh();
        return;
    }
    let count = enemies.length;
    positions = [];
    while (count > 0) {
        pos = Math.floor(Math.random() * 7) + "" + Math.floor(Math.random() * 7);
        if (identify(document.getElementById(pos).querySelector("img")) == "Cardback" && !positions.includes(pos)) {
            positions.push(pos);
            count--;
        }
    }
    console.log(enemies, positions);
    if (tarot == 8) draw(8, 0, 10);
    else if (tarot == 9) draw(0, 0, 0);
    else if (tarot == 10) {
        let a = Math.floor(Math.random() * 25);
        let b = Math.floor(Math.random() * a);
        let c = 25 - b - a;
        draw(c, b, a);
    }
    else if (tarot == 13) draw(3, 3, 12);
    else if (tarot == 14) draw(0, 8, 10);
    else if (tarot == 15) draw(0, 0, 23);
    else if (tarot == 20) draw(7, 7, 0);
    else draw(5, 5, 8);
    spawn(positions, enemies);
    refresh();
    if (tarot == 19) {
        reveal("Inspiration");
        reveal("Obstacle");
    }
    else if (tarot == 17) {
        for (let i = 0; i < 21; i++) {
            reveal("Arcana");
        }
    }
    else if (tarot == 21) {
        for (let i = 0; i < 41; i++) {
            reveal("Emptiness");
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
    else if (gamestate == "beginning" && tarot == 11) {
        if (!positions.includes(this.id) || enemypower(enemies[positions.indexOf(this.id)]) > progress) return;
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
        img.style.left = originalLeft + 55 + 'px';
        img.style.zIndex = 1000;
        defeated++;
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                img.style.height = 230 - (11.5 * i) + 'px';
                img.style.width = 190 - (9.5 * i) + 'px';
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
        if (tarot == 1 && (!positions.includes(this.id) || !identify(this.querySelector("img")) == "Cardback")) {
            let rowdif = this.id[0] - charpos()[0];
            let coldif = this.id[1] - charpos()[1];
            let temp = this.id;
            for (let i = 0; i < 6; i++) {
                let a = parseInt(temp[0]) + parseInt(rowdif);
                let b = parseInt(temp[1]) + parseInt(coldif);
                temp = a + "" + b;
                let target = document.getElementById(temp);
                if (target == null) continue;
                else if (positions.indexOf(temp) != -1 && identify(target.querySelector("img")) != "Cardback") {
                    i = 6;
                    let power = enemypower(enemies[positions.indexOf(temp)]);
                    if (Arcana + Confrontation >= power && Arcana > 0) {
                        let temporal = power - Confrontation;
                        if (temporal < 1) Arcana--;
                        else Arcana = Arcana - temporal;
                        console.log(Arcana);
                        banish(temp, "banishment");
                        console.log(Arcana);
                        setTimeout(() => {
                            gamestate = "Enemies";
                            enemyturn();
                        }, 200);
                        return;
                    }
                }
            }

        }
        if (identify(this.querySelector("img")) == "Cardback") {
            gamestate = "";
            let img = this.querySelector('img');
            for (let i = 1; i < 11; i++) {
                setTimeout(() => {
                    img.style.width = 9.5 * (10 - i) + 'px';
                }, i * 20);
            }
            if (positions.includes(this.id) && turn > 1) {
                lastaction = "uncover";
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
            lastaction = "uncover";
            setTimeout(() => {
                if (hermit && tarot == 9) {
                    hermit = false;
                    let min = 20;
                    let choice = [];
                    if (Arcana < min && Arcana < 8) min = Arcana;
                    if (Confrontation < min && Confrontation < 10) min = Confrontation;
                    if (Fortitude < min && Fortitude < 10) min = Fortitude;
                    if (Arcana == min) choice.push("Arcana");
                    if (Confrontation == min) choice.push("Confrontation");
                    if (Fortitude == min) choice.push("Fortitude");
                    let chosen = choice[Math.floor(Math.random() * choice.length)];
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
                if (tarot == 13) if (undrawnhand.indexOf("Arcana") == -1 || undrawnhand.indexOf("Confrontation") == -1 || undrawnhand.indexOf("Fortitude") == -1) { revelation(); document.querySelector("body").classList.add("death"); }
                gamestate = "Enemies";
                enemyturn();
            }, 400);
        }
        else if (positions.includes(this.id)) {
            lastaction = "attack";
            gamestate = "";
            banish(this.id, identify(this.querySelector("img")));
            setTimeout(() => {
                gamestate = "Enemies";
                enemyturn();
            }, 400);
        }
        else {
            lastaction = "move";
            gamestate = "";
            swap(this.id, charpos());
            setTimeout(() => {
                if (tarot == 7) gamestate = "Move";
                else {
                    gamestate = "Enemies";
                    enemyturn();
                }
            }, 400);
        }
    }
}

function handleCard(one, two) {
    let identity = "";
    if (one == charpos()) identity = identify(document.getElementById(two).querySelector("img"));
    else identity = identify(document.getElementById(one).querySelector("img"));
    meltaway = true;
    switch (identity) {
        case "Arcana":
            if (Arcana < 8) {
                Arcana++;
                if (Arcana > 3 && life < 3 && tarot == 2) {
                    Arcana = Arcana - 4;
                    life++;
                }
            } else {
                meltaway = false;
            }
            break;
        case "Confrontation":
            if (Confrontation < 10) {
                Confrontation++;
            } else {
                meltaway = false;
            }
            break;
        case "Fortitude":
            if (Fortitude < 10) {
                Fortitude++;
            } else {
                meltaway = false;
            }
            break;
        case "Inspiration":
            open();
            break;
        case "blessing":
            if (life < 3) {
                life++;
            } else {
                meltaway = false;
            }
            break;
        case "Luna":
            lunarphase += 10;
            document.querySelector("body").classList.add("eclipse");
            break;
        case "Obstacle":
            meltaway = false;
            break;
        case "Conclusion":
            document.getElementById('board').innerHTML = "";
            gamestate = "limbo";
            setTimeout(() => {
                generate();
            }, 300);
            return;
        case "Orace":
            for (let i = 0; i < 10; i++) {
                reveal("Confrontation");
            }
            break;
        case "Dame":
            for (let i = 0; i < 10; i++) {
                reveal("Fortitude");
            }
            break;
        case "Price":
            meltaway = false;
            break;
        case "Startsword":
        case "Startshield":
        case "3Sword":
        case "3Shield":
        case "Arcanapotion":
        case "Healthpotion":
        case "5Arcana":
            const priceIndex = stock.indexOf(identity);
            if (essence >= price[priceIndex]) {
                essence -= price[priceIndex];
                if (identity === "Healthpotion") {
                    life = 3;
                } else {
                    inventory.push(identity);
                }
            } else {
                meltaway = false;
            }
            break;
        case "Door":
            encounter = "miniboss";
            price = [];
            indexes = [];
            stock = [];
            document.getElementById('board').innerHTML = "";
            gamestate = "limbo";
            setTimeout(() => {
                generate();
            }, 300);
            break;
        default:
            meltaway = false;
            break;
    }
    refresh();
    if (document.getElementById(one) == null || document.getElementById(two) == null) return;
    if (meltaway) {
        if (charpos() === two) {
            document.getElementById(one).querySelector("img").src = "./tarot/others/Emptiness.png";
        } else {
            document.getElementById(two).querySelector("img").src = "./tarot/others/Emptiness.png";
        }
    }
}


function reveal(identity) {
    if (!undrawnhand.includes(identity)) return;
    undrawnhand.splice(undrawnhand.indexOf(identity), 1);
    a = Math.floor(Math.random() * 7);
    b = Math.floor(Math.random() * 7);
    index = a + "" + b;
    if (index == "06" && encounter == "midshop") index = "16";
    while (revealtracker.includes(index) || positions.includes(index) || identify(document.getElementById(index).querySelector("img")) != "Cardback") {
        a = Math.floor(Math.random() * 7);
        b = Math.floor(Math.random() * 7);
        index = a + "" + b;
        if (encounter == "midshop" && index == "06") index = "16";
    }
    revealtracker.push(index);
    let img = document.getElementById(index).querySelector('img');
    let x = a;
    let y = b;
    for (let i = 1; i < 11; i++) {
        setTimeout(() => {
            img.style.width = 9.5 * (10 - i) + 'px';
        }, i * 40);
    }
    setTimeout(() => {
        if (encounter == "midshop") {
            if (indexes[y] == x && y != 6) img.src = "tarot/others/" + price[y] + ".png";
            else if (indexes[y] == x - 1) img.src = "tarot/others/" + stock[y] + ".png";
            else img.src = "tarot/others/" + identity + ".png";
        }
        else {
            img.src = "tarot/others/" + identity + ".png";
        }
    }, 400);
    for (let i = 1; i < 11; i++) {
        setTimeout(() => {
            img.style.width = 9.5 * i + 'px';
            revealtracker.splice(revealtracker.indexOf(index), 1);
        }, 400 + i * 40);
    }
}