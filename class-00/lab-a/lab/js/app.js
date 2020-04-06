'use strict';

const names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

const leftImage = document.getElementById('left');
const centerImage = document.getElementById('center');
const rightImage = document.getElementById('right');

// having 'allProducts' as a const prevents it from being parsed to/from local storage because it is trying to change the value of the const
var allProducts = [];
const container = document.getElementById('image_container');
const viewed = [];
const labels = [];
const pics = [leftImage, centerImage, rightImage];
const list = document.getElementById('productlist');
// making the below variable a const would not allow the value to be reassigned within the click handler line 56
var totalClicks = 0;
const views = [];
const votes = [];

function Product(name) {
  this.name = name;
  this.path = 'img/' + name + '.jpg';
  this.votes = 0;
  this.views = 0;
  allProducts.push(this);
}

function makeRandom() {
  return Math.floor(Math.random() * names.length);
}

function displayPics(){
  while(viewed.length < 6){
    const rando = makeRandom();
    while(!viewed.includes(rando)){
      viewed.push(rando);
    }
  }
  
  // TODO: In a sentence or two, explain why the previous line of code threw an error when we changed the letiable declaration from `let to `let`.
  // The reason the console.log from line 38 threw an error was because of the scope of 'let' on line 33. Changing that from a var declaration to a let declaration limited the cope of that declaration to strictly within that code block.
  console.log(viewed);

  // const would not allow the below for loop's initializer to change as the loop increments
  for (var i = 0; i < 3; i++){
    const temp = viewed.shift();
    pics[i].src = allProducts[temp].path;
    pics[i].id = allProducts[temp].name;
    allProducts[temp].views += 1;
  }
}

function handleClick(event) {
  if (event.target.id === 'image_container') {
    return alert('Be sure to click directly on an image!!');
  }
  totalClicks += 1;
  if(totalClicks > 24) {
    container.removeEventListener('click', handleClick);
    container.style.display = 'none';
    showList();
    makeChart();
  }
  // a loop's initializer can not be a const as it needs to be able to change as the loop increments
  for(var i = 0; i < names.length; i++){
    if(event.target.id === allProducts[i].name) {
      allProducts[i].votes += 1;
      console.log(`event.target.id + ' has ' + allProducts[i].votes + ' votes in ' + allProducts[i].views + ' views'`);
    }
  }
  localStorage.busmall = JSON.stringify(allProducts);
  localStorage.busmallProducts = JSON.stringify(allProducts);
  displayPics();
}

function showList() {
  // a loop's initializer can not be a const as it needs to be able to change as the loop increments
  for(var i = 0; i < allProducts.length; i++) {
    const liEl = document.createElement('li');
    liEl.textContent = `allProducts[i].name + ' has ' + allProducts[i].votes + ' votes in ' + allProducts[i].views + ' views'`;
    list.appendChild(liEl);
  }
}

function makeChartData(){
  allProducts.forEach(function(product){
    labels.push(product.name);
    votes.push(product.votes);
    views.push(product.views);
  });
}

function makeChart(){
  makeChartData();
  const ctx = document.getElementById('chartypants').getContext('2d');
  new Chart(ctx, { //eslint-disable-line
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'total votes',
        backgroundColor: 'gold',
        borderColor: '#214',
        data: votes,
      }]
    },
    options: {
      responsive: false,
      scales: {
        yAxes: [{
          ticks: {
            max: 20,
            min: 0,
            stepSize: 1
          }
        }]
      }
    }
  });
  Chart.defaults.global.defaultFontColor = '#eee'; //eslint-disable-line
}

container.addEventListener('click', handleClick);

document.getElementById('bus').addEventListener('click', function(){
  localStorage.removeItem('busmall');
  console.log('Local storage was cleared!');
});

if(localStorage.busmall){
  console.log('Local storage data exists');
  allProducts = JSON.parse(localStorage.busmall);
} else {
  console.log('There is no local storage data; initialize app by creating instances');
  // const would not allow the below for loops initializer to change as the loop increments
  for(var i = 0; i < names.length; i++) {
    new Product(names[i]);
  }
}

displayPics();
