let stage = 1;
let timer = 1500;
let segmenttime = 1500;
let settings_usable = true;
let paused = true;
let pomodoro_time = 1500;
let short_break_time = 300;
let long_break_time = 1500;
let debug = false;
let acceleration = 1;
window.addEventListener("load", setup);

function setup()
{
    start_pause_button = document.getElementById("start_pause");
    reset_button = document.getElementById("reset");
    current_time = document.getElementById("timer");
    start_pause_button.addEventListener("click",start_pause);
    reset_button.addEventListener("click",reset);
    plusButtons = document.getElementsByClassName("plus");
    debugCheckBox = document.getElementById("debug_checkbox");
    progressCircle = document.getElementById("progress");
    interval = setInterval(tick, 1000);
    for (const button of plusButtons) {
        button.addEventListener("click", increment);
    }
    minusButtons = document.getElementsByClassName("minus");
    for (const button of minusButtons) {
        button.addEventListener("click", decrement);
    }
    debugCheckBox.addEventListener("change",debugging);
    refresh();
}

function increment(e)
{
    if(!settings_usable) return;
    let which_timer = e.target.parentElement.parentElement.children[1];
    switch(e.target.classList[1])
    {
        case "pomodoro":
            pomodoro_time = pomodoro_time + 60;
            setTime(which_timer,pomodoro_time);
            break;
        case "short_break":
            short_break_time = short_break_time + 60;
            setTime(which_timer,short_break_time);
            break;
        case "long_break":
            long_break_time = long_break_time + 60;
            setTime(which_timer,long_break_time);
            break;
    }
    refresh();
}

function decrement(e)
{
    if(!settings_usable) return;
    let which_timer = e.target.parentElement.parentElement.children[1];
    switch(e.target.classList[1])
    {
        case "pomodoro":
            pomodoro_time = pomodoro_time - 60;
            setTime(which_timer,pomodoro_time);
            break;
        case "short_break":
            short_break_time = short_break_time - 60;
            setTime(which_timer,short_break_time);
            break;
        case "long_break":
            long_break_time = long_break_time - 60;
            setTime(which_timer,long_break_time);
            break;
    }
    refresh();
}

function refresh()
{
    if(paused) start_pause_button.textContent = "Start";
    else start_pause_button.textContent = "Pause";
    if(!settings_usable)
    {
        for (const button of plusButtons) {
            button.disabled = true;
        }
        for (const button of minusButtons) {
            button.disabled = true;
        }
    }
    else
    {
        setTime(current_time,pomodoro_time);
        timer = pomodoro_time;
        segmenttime = timer;
        for (const button of plusButtons) {
            if(button.parentElement.parentElement.children[1].textContent == "59:00" ) button.disabled = true;
            else button.disabled = false;
        }
        for (const button of minusButtons) {
            if(button.parentElement.parentElement.children[1].textContent == "01:00" ) button.disabled = true;
            else button.disabled = false;
        }
    }
}

function start_pause(e)
{
    if(paused)
    {
        settings_usable = false;
        paused = false;
    }
    else
    {
        paused = true;
    }
    refresh();
}

function reset()
{
    stage = 1;
    timer = pomodoro_time;
    setTime(current_time,pomodoro_time);
    document.getElementById("stage").textContent = "Pomodoro 1";
    progressCircle.setAttribute("stroke-dasharray",[0,1]);
    paused = true;
    settings_usable = true;
    refresh();
}

function setTime(target,value)
{
    let seconds = value % 60;
    let minutes = (value - seconds) / 60;
    if(seconds < 10) seconds = "0" + seconds;
    if(minutes < 10) minutes = "0" + minutes;
    target.textContent= minutes + ":" + seconds;
}

function tick()
{
    if(paused) return;
    timer = timer-acceleration;
    setTime(current_time,timer);
    if(timer <= 0)
    {
        stage++;
        if(stage % 8 == 0)
        {
            document.getElementById("stage").textContent = "Long Break";
            timer = long_break_time;
            setTime(current_time,long_break_time);
        } 
        else if(stage % 2 == 0)
        {
            document.getElementById("stage").textContent = "Short Break";
            timer = short_break_time;
            setTime(current_time,short_break_time);
        }
        else
        {
            document.getElementById("stage").textContent = "Pomodoro " + ((stage-1)/2+1);
            timer = pomodoro_time;
            setTime(current_time,pomodoro_time);
        }
        segmenttime = timer;
    }  
    let ratio = timer/segmenttime;
    progressCircle.setAttribute("stroke-dasharray",[816-ratio*816,ratio*816]);
    progressCircle.setAttribute("stroke-dashoffset",200);
}

function debugging()
{
    if(acceleration == 1) acceleration = 60;
    else acceleration = 1;
}