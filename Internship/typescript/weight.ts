import * as Apexcharts from "apexcharts";

type Data = {
    weight: number,
    date: Date;
}

let DataStorage: Data[];
let LimitedStorage: Data[] = [];
window.addEventListener('load', initialize);

function initialize() {
    DataStorage = JSON.parse(localStorage.getItem("DataStorage") || '[]').map(obj => ({
        ...obj,
        date: new Date(obj.date)
    }));
    console.log(JSON.parse(localStorage.getItem("DataStorage")));

    document.getElementById("add").addEventListener("click", AddData);
    document.getElementById("week").addEventListener("click", function() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        LimitData(cutoffDate);
        DisplayHistory();
    });
    document.getElementById("month").addEventListener("click", function() {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - 1); 
        LimitData(cutoffDate);
        DisplayHistory();
    });
    document.getElementById("year").addEventListener("click", function() {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        LimitData(cutoffDate);
        DisplayHistory();
    });
    document.getElementById("lifetime").addEventListener("click", function() {
        const cutoffDate = new Date(1800, 0, 1);
        LimitData(cutoffDate);
        DisplayHistory();
    });

    DisplayHistory();
}

function FormatDate(time: Date): string {
    const PresentDay: Date = new Date();
    PresentDay.setHours(23, 59, 59, 59);
    const Yesterday: Date = new Date();
    Yesterday.setDate(Yesterday.getDate() - 1);
    if (typeof time === 'string') {
        time = new Date(time);
    }
    let answer: string = "";
    if (time.getFullYear() == PresentDay.getFullYear()) {
        if (time.getMonth() == PresentDay.getMonth() && time.getDate() == PresentDay.getDate()) {
            answer = "today at " + time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        else if (time.getMonth() == Yesterday.getMonth() && time.getDate() == Yesterday.getDate()) {
            answer = "yesterday at " + time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        else {
            const dayMonthFormat = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            answer = `${dayMonthFormat} at ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    }
    else {
        const dayMonthFormat = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        answer = `${dayMonthFormat} ${time.getFullYear()} at ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; // Exclude seconds
    }
    return answer;
}

function LimitData(limit: Date): void {
    LimitedStorage = [];
    DataStorage.forEach(data => {
        if (data.date.getTime() > limit.getTime()) {
            LimitedStorage.push(data);
        }
    });
    LimitedStorage.sort((a, b) => a.date.getTime() - b.date.getTime());
    console.log(LimitedStorage);
    updateChart();
}

function AddData(): void {
    event.preventDefault();
    const weightInput = document.getElementById("weight") as HTMLInputElement;
    const weight = parseFloat(weightInput.value);
    const roundedWeight = parseFloat(weight.toFixed(1));
    if (roundedWeight !== weight) {
        console.log("Weight should have maximum one fractional digit.");
        return;
    }
    const DateInput = document.getElementById("date") as HTMLInputElement;
    const dateTimeString = DateInput.value;
    if (dateTimeString === undefined || dateTimeString === '' || isNaN(weight) || weight == undefined) return;
    const [dateString, timeString] = dateTimeString.split("T");
    const [year, month, day] = dateString.split("-");
    const [hour, minute] = timeString.split(":");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
    if(date > new Date()) {console.log("Cant set date in the future");return;}
    const newData = {
        weight: weight,
        date: date
    };

    DataStorage.push(newData);
    console.log(DataStorage);
    DisplayHistory();
}

function DisplayHistory() : void{
    let text = "";
    let limit = Math.min(10, DataStorage.length);
    let beginning = Math.max(0, DataStorage.length - 10);
    for (let i = beginning; i < beginning + limit; i++) {
        text += `<tr><td>${DataStorage[i].weight} kg</td><td>${FormatDate(DataStorage[i].date)}</td></tr>`;
    }
    for (let i = limit; i < 10; i++) {
        text += '<tr><td></td><td></td></tr>';
    }
    document.getElementById("display").innerHTML = text;
}

window.addEventListener("beforeunload", function() {
    localStorage.setItem("DataStorage", JSON.stringify(DataStorage));
});

function updateChart()
{
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const paddingleft = 52;
    const paddingbottom = 15;
    const padding = 5;
    const numDataPoints = LimitedStorage.length;
    const xSpacing = (canvas.width-paddingleft) / (numDataPoints - 1);
    const minweight = Math.min(...LimitedStorage.map(data => data.weight))
    const yRange = Math.max(...LimitedStorage.map(data => data.weight)) - minweight;
    const ySpacing = ((canvas.height - paddingbottom) - 2 * padding) / yRange;
    context.fillStyle = "black";
    context.font = "12px Arial";
    context.textAlign = "right";
    const maxWeight = Math.max(...LimitedStorage.map(data => data.weight));
    for (let i = 0; i < 5; i++) {
        const label = maxWeight - (maxWeight - minweight) * (i / 5);
        const y = 10 + i * 42;
        context.fillStyle = "black";
        context.fillText(label.toFixed(1) + " kg", 45, y);
    
        context.strokeStyle = "grey"; 
        context.beginPath();
        context.moveTo(paddingleft, y*1.05-7);
        context.lineTo(canvas.width, y*1.05-7);
        context.stroke();
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    context.fillText(LimitedStorage[0].date.getDate() + " " + monthNames[LimitedStorage[0].date.getMonth()], 85, 195);
    context.fillText(LimitedStorage[LimitedStorage.length-1].date.getDate() + " " + monthNames[LimitedStorage[LimitedStorage.length-1].date.getMonth()], 700, 195);
    context.stroke();
    context.fillStyle = "black";
    type coordinate = [number,number];
    let coordinates : coordinate[] = [];
    for (let i = 0; i < numDataPoints; i++) {
        const x = paddingleft + xSpacing * i;
        const y = (canvas.height - padding) - (LimitedStorage[i].weight - minweight) * ySpacing - paddingbottom;
        let temp : coordinate = [x,y];
        coordinates.push(temp);
    }
    context.beginPath();
    context.moveTo(coordinates[0][0],coordinates[0][1]);
    for(let i = 1;i<numDataPoints;i++)
    {
        context.lineTo(coordinates[i][0],coordinates[i][1]);
    }
    context.lineWidth = 2;
    context.strokeStyle = "black"; 
    context.stroke();
    DisplayProgress();
}

function DisplayProgress() {
    const startDiv = document.getElementById("Start");
    const currentDiv = document.getElementById("Current");
    const progressDiv = document.getElementById("Progress");

    if (LimitedStorage.length === 0) {
        startDiv.textContent = "N/A";
        currentDiv.textContent = "N/A";
        progressDiv.textContent = "N/A";
        return;
    }

    const startWeight = LimitedStorage[0].weight;
    const currentWeight = LimitedStorage[LimitedStorage.length - 1].weight;
    const progress = currentWeight - startWeight;
    const progressSign = progress >= 0 ? "+" : "";

    startDiv.textContent = startWeight.toFixed(1) + " kg";
    currentDiv.textContent = currentWeight.toFixed(1) + " kg";
    progressDiv.textContent = progressSign + progress.toFixed(1) + " kg";
}

var options = {
    chart: {
      type: 'bar'
    },
    series: [
      {
        name: 'sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      }
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
    }
  }
  
  var chart = new ApexCharts(document.querySelector('canvas'), options)
  chart.render()