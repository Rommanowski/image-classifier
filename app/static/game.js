function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let labels = []

function set_target(){
fetch('/get_labels')
  .then(response => response.json())
  .then(data => {
    labels = data
    random_label = labels[getRandomInt(92)];
    $('#to_draw').text(random_label.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase()));
  })
  .catch(error => console.error('Błąd:', error));
}

function compare_results(){
    let prediction = $('#result').text();
    let target = $('#to_draw').text();

    if(target === prediction) return 1;
    else return 0;
}

$(function(){
    set_target();
})

