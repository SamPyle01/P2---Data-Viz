
let table;
let musicals = [];
let actions = [];
let comedies = [];   
let minYear = 9999;
let maxYear = -9999;
let bgImg;

let url = "https://docs.google.com/spreadsheets/d/1kMby76qbyazlI7TzUSp2XMBVO1BCVbrTBIdvrzENbOM/export?format=csv";

function preload() {
  table = loadTable(url, "csv", "header");
  bgImg = loadImage("film.png"); 
}

function setup() {
  createCanvas(1300, 800);
  textFont("sans-serif");

  // go through each row
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);

    let genre = (row.getString("genre") || "").toLowerCase();
    let title = row.getString("movie_title");
    let year = getYear(row.getString("release_date"));
    let rating = row.getString("mpaa_rating");
    let gross = row.getString("total_gross").replace(/,/g, "");
    gross = float(gross);

    if (!isFinite(year)) continue;

    //skip Snow White + Fantasia
    if ((title.toLowerCase().includes("snow white") && year === 1937) ||
        (title.toLowerCase().includes("fantasia") && year === 1940)) {
      continue; 
    }
 
    if (genre.includes("musical")) {
      musicals.push({ title, year, rating, gross });
    }
    if (genre.includes("action")) {
      actions.push({ title, year, rating, gross });
    }
     if (genre.includes("comedy")) {              
      comedies.push({ title, year, rating, gross }); 
    }                                             


    if (year < minYear) minYear = year;
    if (year > maxYear) maxYear = year;
  }
  if (minYear < 1960) {
  minYear = 1960;
}
}

function draw() {
   background(20); 
   image(bgImg, 0, -35, width, height + 70);

  textSize(40);
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  //text("Disney Musical, Comedy, and Action Movies Timeline", 20, 25);

  let musicalLine = height * 0.35;   
  let comedyLine  = height * 0.55;  
  let actionLine  = height * 0.75;  

  //timeline lines
  strokeWeight(4);
  stroke(100, 200, 255);                      
  line(60, musicalLine, width - 40, musicalLine);
  stroke(120, 230, 120);                         
  line(60, comedyLine,  width - 40, comedyLine); 
  stroke(255, 170, 80);                         
  line(60, actionLine,  width - 40, actionLine); 

  //every 10 years
  textSize(25);
  fill(225);
  noStroke();
  for (let y = Math.ceil(minYear / 10) * 10; y <= maxYear; y += 10) {
    let x = map(y, minYear, maxYear, 70, width - 40);
    textAlign(CENTER, BOTTOM);
     text(y, x, height * 0.25);         //musical 
  // text(y, x, height * 0.52);           //comedy 
  // text(y, x, height * 0.72);           //action 
}

  //dots
  let hoverMovie = null;
  noStroke();

  // musical movies (blue)
  fill(100, 200, 255);
  for (let i = 0; i < musicals.length; i++) {
    let m = musicals[i];
    let x = map(m.year, minYear, maxYear, 70, width - 40);
    let y = musicalLine + ((i % 5) - 2) * 14; 
    circle(x, y, 15);

     if (dist(mouseX, mouseY, x, y) < 6) {
    hoverMovie = { ...m, x, y, color: color(100, 200, 255), genre: "Musical" }; 
    }
}
// comedy movies (green)                       
  fill(120, 230, 120);                           
  for (let i = 0; i < comedies.length; i++) {   
    let m = comedies[i];                       
    let x = map(m.year, minYear, maxYear, 70, width - 40); 
    let y = comedyLine + ((i % 5) - 2) * 14;      
    circle(x, y, 15);                            

    if (dist(mouseX, mouseY, x, y) < 6) {       
      hoverMovie = { ...m, x, y, color: color(120, 230, 120), genre: "Comedy" }; 
    }                                          
  }                                            

  // action movies (orange)
  fill(255, 170, 80);
  for (let i = 0; i < actions.length; i++) {
    let m = actions[i];
    let x = map(m.year, minYear, maxYear, 70, width - 40);
    let y = actionLine + ((i % 5) - 2) * 14;
    circle(x, y, 15);

   if (dist(mouseX, mouseY, x, y) < 6) {
    hoverMovie = { ...m, x, y, color: color(255, 170, 80), genre: "Action" }; 
    }
}

  // info hovering (tooltip)
  if (hoverMovie) {
    stroke(255);         
    strokeWeight(4);     
    fill(hoverMovie.color);
    circle(hoverMovie.x, hoverMovie.y, 25); 
    noStroke();         

    showTooltip(hoverMovie);
  }
}

// transform year to 0000 from MM/DD/YY (watched a couple of videos but did ultimatley get help from ChatGPT for it to work)
function getYear(dateStr) {
  if (!dateStr) return NaN;
  let parts = dateStr.split("/");
  if (parts.length < 3) return NaN;
  let yy = int(parts[2]);
  if (yy <= 24) return 2000 + yy;
  return 1900 + yy;
}

// info show (tooltip)
function showTooltip(m) {
  let lines = [
    m.title,
    "Year: " + m.year,
    "MPAA: " + m.rating,
    "Gross: $" + niceMoney(m.gross),
    "Genre: " + (m.genre || "Movie"),
  ];

  let fontSize = 22;        
  let lineSpacing = 26;     
  let padding = 16;       
  textSize(fontSize);      

  let w = 0;
  for (let i = 0; i < lines.length; i++) {
    w = max(w, textWidth(lines[i]));
  }
  w += padding * 2;
  let h = lineSpacing * lines.length + padding * 1.5; 

  let x = mouseX + 25;
  let y = mouseY + 25;
  if (x + w > width - 10) x = width - w - 10;
  if (y + h > height - 10) y = height - h - 10;


  fill(255, 240);
  noStroke();
  rect(x, y, w, h, 8); 
  fill(0);
  textAlign(LEFT, TOP);

  // text lines 
  let yy = y + padding * 0.8;
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x + padding, yy);
    yy += lineSpacing;
  }
}

// format $$$, Refrence: ChatGPT
function niceMoney(v) {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(0) + "K";
  return v.toFixed(0);
}
// helper: count how many movies share the same year
function getYearCount(movies, year) {
  let count = 0;
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].year === year) count++;
  }
  return count;
}

