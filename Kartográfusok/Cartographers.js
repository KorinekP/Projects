window.addEventListener('load', init, false); //Commentekkel próbáltam megkönnyíteni a javítást de lehet csak átláthatatlanabb lett tőle :((
let currtype; //megfelelő képhez mutató út
let currshort; //a táblában tárolt egy karakteres adat
let currpos = [[0,0,0],[0,0,0],[0,0,0]]; //az aktuális elem kinézete
let land = []; //11X11-es tábla
let season = 1; //adott évszak száma
let time = 0; //adott évszakban az eddig eltelt idő
let currtime = 0; //az aktuális elem ideje
let undrawnhand = []; //Adott évszakban már kihúzott elemek
let total = 0; //Összpontszám
let missionboard = []; //Melyik küldetések vannak és milyen sorrendben
let missionscores = [0,0,0,0]; //Mennyi pontot értünk el az egyes küldetésekből
let gameover = false; //Játék vége
function init() //elemek inicializálása
{
    let board = "";
    for (let i = 0; i < 11; i++) {
        board+="<tr>";
        for (let j = 0; j < 11; j++) {
            board+='<td class="play" id="'+i+" "+j+'"></td>';
        }
        board+="</tr>";
    }
    document.querySelector("#board").innerHTML=board;
    document.querySelectorAll('.play').forEach(td => {
        td.addEventListener('click', place);
    });
    document.querySelector("#rotate").addEventListener("click", turn);
    document.querySelector("#mirror").addEventListener("click", flip);
    draw();
    adjust();
    land = generate();
    land[1][1] = "m";
    land[3][8] = "m";
    land[5][3] = "m";
    land[8][9] = "m";
    land[9][5] = "m";
    reshape();
    while (missionboard.length < 4) {
        let random = Math.floor(Math.random() * 12);
        if (!missionboard.includes(random)) {
            missionboard.push(random);
        }
    }
    document.getElementById("first").innerHTML=missions[missionboard[0]].image;
    document.getElementById("second").innerHTML=missions[missionboard[1]].image;
    document.getElementById("third").innerHTML=missions[missionboard[2]].image;
    document.getElementById("fourth").innerHTML=missions[missionboard[3]].image;
}
function generate()  //11szer 11es tömb létrehozása
{
    let array = new Array(11);
    for (let i = 0; i < 11; i++) {
        let inner = new Array(11);
        array[i] = inner;
        for (let j = 0; j < 11; j++) {
            array[i][j] = 0;
        }
    }
    return array;
}

function adjust() //Az aktuális elem kinézetének updateelése
{
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(currpos[i][j] == 1)
            {
                document.getElementById(i+""+j+"x").innerHTML="<img src="+currtype+">";
            }
            else
            {
                document.getElementById(i+""+j+"x").innerHTML="<img src=assets/tiles/base_tile.png>";
            }
        }
    }
}
function reshape() //a térkép kinézetének igazítása a tömbhöz
{
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            switch (land[i][j]) {
                case 0:
                    document.getElementById(i+" "+j).innerHTML="<img src=assets/tiles/base_tile.png>"
                    break;
                case "m":
                    document.getElementById(i+" "+j).innerHTML="<img src=assets/tiles/mountain_tile.png>"
                    break;
                case "f":
                    document.getElementById(i+" "+j).innerHTML="<img src=assets/tiles/forest_tile.png>"
                    break;
                case "p":
                    document.getElementById(i+" "+j).innerHTML="<img src=assets/tiles/plains_tile.png>"
                    break;
                case "v":
                    document.getElementById(i+" "+j).innerHTML="<img src=assets/tiles/village_tile.png>"
                    break;
                case "w":
                    document.getElementById(i+" "+j).innerHTML="<img src=assets/tiles/water_tile.png>"
                    break;
                default:
                    alert("unknown content")
            }
        }
    }
}
function turn() //forgatás óramutatóval megegyező irányba
{
    let temp = [[0,0,0],[0,0,0],[0,0,0]];
    if(currpos[1][1] == 1) temp[1][1] = 1;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++)
        {
            if(i*j == 1) continue;
            else
            {
                if(currpos[i][j] == 1)
                {
                    let news = step(i,j);
                    temp[news[0]][news[1]] = 1;
                }
            }
        }
    }
    currpos = temp;
    adjust();
}

function step(a,b) //forgatáshoz segédfüggvény. 2szer megy körbe az elem
{
    if(a == 0 && b < 2) b = b+1;
    else if (b == 2 && a < 2) a = a+1;
    else if (a == 2 && b > 0) b = b-1;
    else a = a-1;

    if(a == 0 && b < 2) b = b+1;
    else if (b == 2 && a < 2) a = a+1;
    else if (a == 2 && b > 0) b = b-1;
    else a = a-1;
    let answer = [a,b]
    return answer;
}

function flip() //tükrözés függőleges tengelyre
{
    let temp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(currpos[i][j] == 0) continue;
            if (j == 1) {
                temp[i][j] = 1;
            } else {
                temp[i][2 - j] = currpos[i][j];
            }
        }
    }
    currpos = temp;
    adjust();
}

function place(event) //elem elhelyezése. A 3X3as alak közepét rakjuk le a kattintással
{
    if(gameover) return;
    if (event.currentTarget.id == "board") return;
    let coordinates = [0,0];
    coordinates = event.currentTarget.id.split(" ");
    if(bounds(coordinates))
    {
        alert("A mező kilóg a pályáról!");
        return;
    } 
    if(collision(coordinates))
    {
        alert("Csak üres mezőre rakhatod!");
        return;
    }
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if(currpos[1+i][1+j]==1)
            {
                land[parseInt(coordinates[0])+i][parseInt(coordinates[1])+j] = currshort;
            }
        }
    }
    time += currtime;
    if(time >= 7) theleavesfall();
    else
    {
        document.getElementById("time").innerHTML="Évszak idő: "+time+"/7";
    }
    reshape();
    draw();
    adjust();
    if(gameover) itends();    
}

function bounds(a) //Kilóg e az elem a pályáról. Előbb nézzük mint a másikat hogy ne legyen out of index hiba
{
    if(currpos[0][0]+currpos[1][0]+currpos[2][0] > 0 && a[1] == 0) return true;
    if(currpos[0][0]+currpos[0][1]+currpos[0][2] > 0 && a[0] == 0) return true; 
    if(currpos[0][2]+currpos[1][2]+currpos[2][2] > 0 && a[1] == 10) return true; 
    if(currpos[2][0]+currpos[2][1]+currpos[2][2] > 0 && a[0] == 10) return true; 
    return false;
}

function collision(a) //szabadok e a mezők ahova rakunk
{
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if(currpos[1+i][1+j]==1)
            {
                if(land[parseInt(a[0])+i][parseInt(a[1])+j] != 0) return true;
            }
        }
    }
    return false;
}

function draw() //Új elem húzása lerakás utány
{
    if(gameover) return;
    let which = 0;
    do
    {
        which = Math.floor(Math.random() * 16);
    }
    while(undrawnhand.includes(which))
    undrawnhand.push(which);
    currpos = elements[which].shape;
    switch (elements[which].type) {
        case "water":
            currtype = "assets/tiles/water_tile.png";
            currshort = "w";
            break;
        case "town":
            currtype = "assets/tiles/village_tile.png";
            currshort = "v";
            break;
        case "forest":
            currtype = "assets/tiles/forest_tile.png";
            currshort = "f";
            break;
        case "farm":
            currtype = "assets/tiles/plains_tile.png";
            currshort = "p";
            break;
        default:
            alert("invalid type")
    }
    document.getElementById("currtime").innerHTML="Aktuális elem ideje:"+elements[which].time;
    currtime = elements[which].time;
}

function theleavesfall() //Évszakváltás
{
    let partial = 0;
    undrawnhand=[];
    time = 0;
    document.getElementById("time").innerHTML="Évszak idő: 0/7";
    switch (season) {
        case 1:
            partial = score(0) + score(1)+  hearthome();
            total+=partial;
            document.getElementById("total").innerHTML="Összesen: "+total;
            document.getElementById("spring").innerHTML = "Tavasz: " + partial;
            document.getElementById("currseason").innerHTML = "Évszak: Nyár (BC)";
            season++;
            break;
        case 2:
            partial = score(1) + score(2) +  hearthome();
            total+=partial;
            document.getElementById("total").innerHTML="Összesen: "+total;
            document.getElementById("summer").innerHTML = "Nyár: " + partial;
            document.getElementById("currseason").innerHTML = "Évszak: Ősz (CD)";
            season++;
            break;
        case 3:
            partial = score(2) + score(3) +  hearthome();
            total+=partial;
            document.getElementById("total").innerHTML="Összesen: "+total;
            document.getElementById("autumn").innerHTML = "Ősz: " + partial;
            document.getElementById("currseason").innerHTML = "Évszak: Tél (DA)";
            season++;
            break;
        case 4:
            partial = score(3) + score(0) +  hearthome();
            total+=partial;
            document.getElementById("total").innerHTML="Összesen: "+total;
            document.getElementById("winter").innerHTML = "Tél: " + partial;
            document.getElementById("currseason").innerHTML = "A játéknak vége";
            gameover=true;
            break;
    }
}

function score(a) //Pontok kiszámítása és a feliratok fejlesztése
{
    let points = evaluate(missionboard[a]);
    missionscores[a]+=points;
    switch(a)
    {
        case 0:
            document.getElementById(a).innerHTML="A pontok: "+missionscores[a];
            break;
        case 1:
            document.getElementById(a).innerHTML="B pontok: "+missionscores[a];
            break;
        case 2:
            document.getElementById(a).innerHTML="C pontok: "+missionscores[a];
            break;
        case 3:
            document.getElementById(a).innerHTML="D pontok: "+missionscores[a];
            break;
    }
    return points;
}
function checkbounds(i,j,k,l) //Out of index hiba elkerülésére segédfüggvény. Szomszéd vizsgáláshoz
{
    if(i+k>10 || i+k < 0 || j+l>10 || j+l<0) return true;
    return false;
}
function evaluate(a) //Hosszadalmas függvény az egyes küldetések pontozására
{
    //sok sok segéd változó
    let point = 0;
    let helper1 = 0;
    let helper2 = 0;
    let helper3 = 0;
    let helpbool = true;
    let helparray = [];
    switch (a) {
        case 0: //Fasor
        //Ugynúgy van fogalmazva mint a sorház, de az ábra szerint itt csak az egyik fasorért kapunk pontot
            helper2=0;
            helper1=0;
            for (let i = 0; i < 11; i++) {
                if(helper2<helper1) helper2 = helper1;
                helper1 = 0;
                for (let j = 0; j < 11; j++) {
                    if (land[j][i] == "f") {
                        helper1++;
                    }
                    else
                    {
                        if(helper2<helper1) helper2 = helper1;
                        helper1 = 0;
                    }
                }
            }
            point = helper2*2;
            return point;
        case 1: //Az erdő széle
            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < 11; j++) {
                    if ((i == 0 || i == 10 || j == 0 || j == 10) && land[i][j]=="f") {
                        point++;
                    }
                }
            }
            return point;
        case 2: //Krumpliöntözés
            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < 11; j++) {
                    if(land[i][j] == "w")
                    {
                        for (let k = -1; k < 2; k++) {
                            for (let l = -1; l < 2; l++) {
                                if(k*l != 0)continue;
                                if(checkbounds(i,j,k,l)) continue;
                                else if(land[i+k][j+l] == "p") helper1 = 2;
                            }
                        }
                        point = point+helper1;
                        helper1 = 0;
                    }
                }
            }
            return point;
        case 3: //Gazdag város
            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < 11; j++) {
                    if (land[i][j] == "v") {
                        for (let k = -1; k < 2; k++) {
                            for (let l = -1; l < 2; l++) {
                                if(k*l != 0)continue;
                                if(checkbounds(i,j,k,l)) continue;
                                else if(!helparray.includes(land[i+k][j+l]) && land[i+k][j+l]!=0) helparray.push(land[i+k][j+l]);
                            }
                        }
                        if(helparray.length>2) point = point+3;
                        helparray = [];
                    }
                }
            }
            return point;
        case 4: //Sorház
        //Ugyanúgy van fogalmazva mint a Fasor de az ábra szerint több ugyanakkoráért is járhat pont
            for (let i = 0; i < 11; i++) {
                if(helper2<helper1)
                {
                    helper2 = helper1;
                    helper3 = 1;
                } 
                else if(helper2==helper1)
                {
                    helper3++;
                }
                helper1 = 0;
                for (let j = 0; j < 11; j++) {
                    if (land[i][j] == "v") {
                        helper1++;
                    }
                    else
                    {
                        if(helper2<helper1)
                        {
                            helper2 = helper1;
                            helper3 = 1;
                        } 
                        else if(helper2==helper1)
                        {
                            helper3++;
                        }
                        helper1 = 0;
                    }
                }
            }
            point = helper2*helper3*2;
            return point;
        case 5: //Páratlan silók
            for (let i = 0; i < 11; i++) {
                if(i % 2!=0)continue;
                helpbool = true;
                for (let j = 0; j < 11; j++) {
                    if (land[j][i] == 0) {
                        helpbool=false;
                        break;
                    }
                }
                if(helpbool) point = point+10;
            }
            return point;
        case 6: //Álmosvölgy
            for (let i = 0; i < 11; i++) {
                helper1 = 0;
                for (let j = 0; j < 11; j++) {
                    if (land[i][j] == "f") {
                        helper1++;
                    }
                }
                if(helper1>2) point = point+4;
            }
            return point;
        case 7: //Öntözőcsatorna
            for (let i = 0; i < 11; i++) {
                helper1 = 0;
                helper2 = 0;
                for (let j = 0; j < 11; j++) {
                    if (land[j][i] == "w") helper1++;
                    if (land[j][i] == "p") helper2++;
                }
                if(helper1==helper2 && helper1>0) point = point+4;
            }
            return point;
        case 8: //Mágusok völgye
            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < 11; j++) {
                    if(land[i][j] == "w")
                    {
                        for (let k = -1; k < 2; k++) {
                            for (let l = -1; l < 2; l++) {
                                if(k*l != 0)continue;
                                if(checkbounds(i,j,k,l)) continue;
                                else if(land[i+k][j+l] == "m") helper1 = 3;
                            }
                        }
                        point = point+helper1;
                        helper1 = 0;
                    }
                }
            }
            return point;
        case 9: //Üres telek
            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < 11; j++) {
                    if(land[i][j] == "0")
                    {
                        for (let k = -1; k < 2; k++) {
                            for (let l = -1; l < 2; l++) {
                                if(k*l != 0)continue;
                                if(checkbounds(i,j,k,l)) continue;
                                else if(land[i+k][j+l] == "v") helper1 = 2;
                            }
                        }
                        point = point+helper1;
                        helper1 = 0;
                    }
                }
            }
        return point;
        case 10: //Határvidék
            for (let i = 0; i < 11; i++) {
                helpbool = true;
                for (let j = 0; j < 11; j++) {
                    if (land[i][j] == 0) {
                        helpbool=false;
                        break;
                    }
                }
                if(helpbool) point = point+6;
            }
            for (let i = 0; i < 11; i++) {
                helpbool = true;
                for (let j = 0; j < 11; j++) {
                    if (land[j][i] == 0) {
                        helpbool=false;
                        break;
                    }
                }
                if(helpbool) point = point+6;
            }
            return point;
        case 11: //Gazdag vidék
            for (let i = 0; i < 11; i++) {
                helparray = [];
                for (let j = 0; j < 11; j++) {
                    if (!helparray.includes(land[i][j]) && land[i][j]!=0) {
                        helparray.push(land[i][j])
                    }
                }
                if(helparray.length>4) point = point+4;
            }
            return point;
    }
}
function hearthome() //Hegyek pontozása. A társashoz hasonlóan minden évszak végén ad pontot (a társasban pénzt ad ami kb ezt jelenti)
{
    let point = 0;
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if(land[i][j] == "m")
            {
                let mountain = true;
                for (let k = -1; k < 2; k++) {
                    for (let l = -1; l < 2; l++) {
                        if(k*l != 0)continue;
                        if(checkbounds(i,j,k,l)) continue;
                        else if(land[i+k][j+l] == 0) mountain = false;
                    }
                }
                if(mountain) point = point+1;
            }
        }
    }
    return point;
}
async function itends() //Játék vége. Azért async hogy az utolsó pont leírások megtörténjenek előtte
{
    await new Promise(resolve => setTimeout(resolve, 100));
    alert("A játéknak vége, összesen "+total+" pontot értél el, gratulálok!");
    document.getElementById("rotate").disabled=true;
    document.getElementById("mirror").disabled=true;
    currpos=[[0,0,0],[0,0,0],[0,0,0]];
    adjust();
}

const elements = [ //A lerakható mezők. A rotate és mirrored adattagokat kivettem, de akaár bent is hagyhattam volna. currpos tárolja mindkettőt igazából. Nem értem a fa z alak miért van kétszer.
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,0],
                [1,0,0],
                [0,0,0]],
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,1],
                [1,1,0],
                [0,0,0]],
    },
    {
        time: 1,
        type: 'farm',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
    },
    {
        time: 1,
        type: 'farm',
        shape: [[0,1,0],
                [1,1,1],
                [0,1,0]],
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [1,0,0],
                [1,0,0]],
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,0,0],
                [1,1,1],
                [1,0,0]],
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,1]],
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,0],
                [1,1,0],
                [0,0,0]],
    },
];

const missions = [ //Küldetések. Első adattag a képét mutatja, a másik az indexet ami a missionboardban van tárolva meg pontozást mutatja
    { image: "<img src=assets/missions_hun/Group_68.png>", index: 0 },
    { image: "<img src=assets/missions_hun/Group_69.png>", index: 1 },
    { image: "<img src=assets/missions_hun/Group_70.png>", index: 2 },
    { image: "<img src=assets/missions_hun/Group_71.png>", index: 3 },
    { image: "<img src=assets/missions_hun/Group_72.png>", index: 4 },
    { image: "<img src=assets/missions_hun/Group_73.png>", index: 5 },
    { image: "<img src=assets/missions_hun/Group_74.png>", index: 6 },
    { image: "<img src=assets/missions_hun/Group_75.png>", index: 7 },
    { image: "<img src=assets/missions_hun/Group_76.png>", index: 8 },
    { image: "<img src=assets/missions_hun/Group_77.png>", index: 9 },
    { image: "<img src=assets/missions_hun/Group_78.png>", index: 10 },
    { image: "<img src=assets/missions_hun/Group_79.png>", index: 11 }
];
