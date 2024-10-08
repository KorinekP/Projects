function enemyturn() {
    if (defeated == enemies.length && undrawnhand.length > 0) {
        defeated = 0;
        revelation();
        setTimeout(() => {
            gamestate = "Move";
            turn++;
        }, 400);
        return;
    }
    if (lunarphase > 0) {
        lunarphase--;
        if (lunarphase == 0) document.querySelector("body").classList.remove("eclipse");
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
        else if (enemies[i] == "Paranoia" && identify(document.getElementById(positions[i]).querySelector("img")) == "Paranoia" && (Math.abs(ypos - positions[i][0]) + Math.abs(xpos - positions[i][1])) > 2) continue;
        else if (enemies[i] == "Vengance" && /*!adjacent(charpos(),positions[i]) &&*/ !(xpos-ypos == positions[i][1] - positions[i][0]) && !(parseInt(xpos)+parseInt(ypos) == parseInt(positions[i][1]) + parseInt(positions[i][0]))) continue;
        else if (enemies[i] == "Imprisonment" && neveralone(enemies,"Imprisonment")) continue;
        else if (enemies[i] == "Insanity" && lastaction != "uncover" && neveralone(enemies,"Insanity")) continue;
        else if (enemies[i] == "GreedArcana" && greediness("Arcana")) continue;
        else if (enemies[i] == "GreedFortitude" && greediness("Fortitude")) continue;
        else if (enemies[i] == "GreedConfrontation" && greediness("Confrontation")) continue;
        else {
            setTimeout(() => {
                activate(enemies[i], positions[i], i);
            }, counter * 205);
            counter++;
        }
    }
    setTimeout(() => {
        gamestate = "Move";
    refresh();
    }, 200 * (counter-1));
    setTimeout(() => {
        if (tarot == 12 && Arcana < 3 - life) Arcana = 3 - life;
        else if (tarot == 20) {
            if (Fortitude == Confrontation && Fortitude > 0) Arcana = 1;
            else Arcana = 0;
        }
        refresh();
    }, 200 * (counter+1))
}
function activate(type, pos, index) {
    switch (type) {
        case "Hunger":
            if (Confrontation + Arcana + Fortitude == 0) break;
            img = document.getElementById(pos).querySelector("img");
            if (adjacent(pos, charpos())) {
                attack(1, "consume", pos);
                break;
            }
            chase(pos, index,charpos());
            break;
        case "Depression":
            if (ypos == pos[0] || xpos == pos[1]) attack(2, "enrage", pos);
            break;
        case "Fear":
            if (turn == 1) {
                let continuation = true;
                while (continuation) {
                    let trial = Math.floor(Math.random() * 7) + "" + Math.floor(Math.random() * 7);
                    if (!positions.includes(trial) &&
                     !(adjacent(charpos(), trial)) &&
                     charpos() != trial &&
                     identify(document.getElementById(trial).querySelector("img")) == "Cardback"){
                        continuation = false;
                        positions[index] = trial;
                        pos = trial;
                        let options = [];
                        let temp = (--pos[0]) + "" + pos[1];
                        if (pos[0] > 0 && 
                            !positions.includes(temp) && 
                            identify(document.getElementById(temp).querySelector("img")) == "Cardback") {
                            options.push("up");
                        } 
                        temp = (++pos[0]) + "" + pos[1];
                        if (pos[0] < 6 && 
                            !positions.includes(temp) && 
                            identify(document.getElementById(temp).querySelector("img")) == "Cardback") {
                            options.push("down");
                        }
                        temp = (pos[0]) + "" + --pos[1];
                        if (pos[1] > 0 && 
                            !positions.includes(temp) && 
                            identify(document.getElementById(temp).querySelector("img")) == "Cardback") {
                            options.push("left");
                        }
                        temp = (pos[0]) + "" + ++pos[1];
                        if (pos[1] < 6 && 
                            !positions.includes(temp) && 
                            identify(document.getElementById(temp).querySelector("img")) == "Cardback") {
                            options.push("right");
                        }
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
                    chase(pos, index,charpos());
                }
            }
            break;
        case "Hatred":
            if (Math.abs(ypos - pos[0]) < 2 && Math.abs(xpos - pos[1]) < 2) attack(4, "", pos);
            break;
        case "Paranoia":
            if (identify(document.getElementById(pos).querySelector("img")) == "Paranoia") {
                if ((Math.abs(ypos - pos[0]) + Math.abs(xpos - pos[1])) < 3) document.getElementById(pos).querySelector("img").src = "./tarot/Enemy/Paranoia_awoken.png";
            }
            else {
                if (adjacent(pos, charpos())) {

                    attack(5, "", pos);
                    break;
                }
                else {
                    chase(pos, index,charpos());
                }
            }
            break;
        case "Vengance":
            attack(2+defeated,"",pos);
            break;
        case "Imprisonment":
            if (adjacent(pos, charpos())) {
                attack(7, "", pos);
                break;
            }
            chase(pos, index,charpos());
            break;
        case "GreedArcana":
            greedychase("Arcana",pos,index);
            break;
        case "GreedFortitude":
            greedychase("Fortitude",pos,index);
            break;
        case "GreedConfrontation":
            greedychase("Confrontation",pos,index);
            break;
        case "Insanity":
            if(!neveralone(enemies,"Insanity")) banish(pos,"banishment");
            else
            {
                if (adjacent(pos, charpos())) {
                    attack(7, "", pos);
                }
                else chase(pos, index,charpos());
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
            if (tarot == 14) banish(pos, "banishment");
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
function chase(pos,index,target) {
    let options = [];
    if (pos[0] > target[0] && !positions.includes((--pos[0]) + "" + pos[1])) options.push("up");
    else if (pos[0] < target[0] && !positions.includes((++pos[0]) + "" + pos[1])) options.push("down");
    if (pos[1] > target[1] && !positions.includes((pos[0] + "" + (--pos[1])))) options.push("left");
    else if (pos[1] < target[1] && !positions.includes((pos[0] + "" + (++pos[1])))) options.push("right");
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
function enemypower(enemy)
{
    if(enemy == "Paranoia") return 5;
    if(enemy == "Vengance") return Math.min(2+defeated,6);
    if(enemy == "GreedArcana") return 8;
    if(enemy == "GreedFortitude") return 8;
    if(enemy == "GreedConfrontation") return 8;
    return bestiary.indexOf(enemy);
}
function banish(id, type) {
    let power = enemypower(enemies[positions.indexOf(id)]);
    let prison = (enemies[positions.indexOf(id)] == "Imprisonment")
    if (type == "banishment") {
        if(prison) document.getElementById(id).querySelector("img").src = "./tarot/others/Inspiration.png";
        else document.getElementById(id).querySelector("img").src = "./tarot/others/Emptiness.png";
        enemies[positions.indexOf(id)] = "";
        positions[positions.indexOf(id)] = "";
        refresh();
        defeated++;
        essence = essence + power;
    } else if (Arcana + Confrontation >= power) {
        if (power > Confrontation) Arcana = Arcana - (power - Confrontation);
        if(prison) document.getElementById(id).querySelector("img").src = "./tarot/others/Inspiration.png";
        else if (tarot == 15) document.getElementById(id).querySelector("img").src = "./tarot/others/Arcana.png";
        else document.getElementById(id).querySelector("img").src = "./tarot/others/Emptiness.png";
        if (tarot == 8 && life < 3) life++;
        enemies[positions.indexOf(id)] = "";
        positions[positions.indexOf(id)] = "";
        refresh();
        defeated++;
        essence = essence + power;
    }
    if (defeated == enemies.length && undrawnhand.length > 0) {
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
function neveralone(array,target)
{
    const filtered = array.filter(element => element === "" || element === target);
    console.log(filtered.length != array.length);
    return filtered.length != array.length;
}
function greediness(target)
{
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if(identify(document.getElementById(i+""+j).querySelector("img")) == target) return false;
        }
    }
    if(undrawnhand.includes(target)) return true;
    return false;
}
function greedychase(target,pos,index)
{
    let fixation = "99";
    distance = 99;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if(identify(document.getElementById(i+""+j).querySelector("img")) == target)
            {
                let temp = Math.abs(i-pos[0])+Math.abs(j-pos[1]);
                if(distance < temp) continue;
                else
                {
                    fixation = i+""+j;
                    distance = temp;
                }
            }
        }
    }
    if(distance == 99)
    {
        if(adjacent(charpos(),pos))
        {
            attack(8,"",pos);
        }
        else chase(pos,index,charpos());
    }
    else
    {
        console.log(fixation);
        chase(pos,index,fixation);
    }
}