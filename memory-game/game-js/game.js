/*
 * shuffle() function provided by Udacity's starter code
 */

// creating array of classess

let deck = ["fa fa-envelope-o", "fa fa-envelope-o", "fa fa-area-chart", "fa fa-area-chart", "fa fa-balance-scale", "fa fa-balance-scale",
           "fa fa-battery-1", "fa fa-battery-1", "fa fa-bookmark-o", "fa fa-bookmark-o", "fa fa-comments", "fa fa-comments",
           "fa fa-bug", "fa fa-bug", "fa fa-check", "fa fa-check"];


// Creating Game state letiables
let open = [];
let matched = 0;
let moveCounter = 0;
let numStars = 3;
let timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

let match=0;
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}; console.log(deck);

// Difficulty settings (max number of moves for each star)
//reducing stars for max moves part
let hard = 17;
let medium = 25;
let modal = $("#modal");

/*
 * Support functions used by main event callback functions.
 */

//Interval function to be called every second, increments timer and updates HTML
      

let startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

    // Ensure that single digit seconds are preceded with a 0
    let formattedSec = "0";

    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    let time = String(timer.minutes) + ":" + formattedSec + " minutes" ;
    $(".timer").text(time);
};
    

// Resets timer state and restarts timer
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("00:00");

    timer.clearTime = setInterval(startTimer, 1000);
};alert("Start the Game !");

// Randomizes cards on board and updates card HTML
function updateCards() {
    deck = shuffle(deck);
    //k is iterator for deck classes
    let k = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[k]);
      k++;
    });
    resetTimer();
};



// Removes last start from remaining stars, updates modal HTML
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};

// Restores star icons to 3 stars, updates modal HTML
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};

// Updates number of moves in the HTML, removes star is necessary based on difficulty letiables
function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === hard || moveCounter === medium) {
        removeStar();
    }
};

// Checks if card is a valid move (if it not currently matched or open)
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

// Returns whether or not currently open cards match
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

// Returns win condition
function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};


// Sets currently open cards to the match state, checks win condition
let setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

// Sets currently open cards back to default state
let resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

/*
 * Event callback functions
 */

// Resets all game state letiables and resets all required HTML to default state
let resetGame = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

// Handles primary game logic of game
let onClick = function() {

    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);
                match++;
                alert(match+"matched");


            } else {
                setTimeout(resetOpen, 200);

            }
        }
    }
};

// Toggles win modal on
function showModal() {
    modal.css("display", "block");
};

// Resets game state and toggles win modal display off
let playAgain = function() {

    resetGame();
    modal.css("display", "none");
};

/*
 * Initalize event listeners
 */

$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

// Provides a randomized game board on page load
$(updateCards);