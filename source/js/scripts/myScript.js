// initialisations
var userSeq = []; // to store user sequence
var comSeq = []; // to store computer generated sequence
var soundSet = [
    "http://www.soundjay.com/button/sounds/button-4.mp3", //green
    "http://www.soundjay.com/button/sounds/button-09.mp3", //red
    "http://www.soundjay.com/button/sounds/button-10.mp3", //yellow 
    "http://www.soundjay.com/button/sounds/button-7.mp3" //blue   
];
var id, color = 0;
var levelCounter = 0

//1- start board sequence
$(document).ready(function() {

    $("#start-reset").click(function() {
        
        levelCounter++;
        if ($("#start-reset").hasClass("reset")) {
            levelCounter = 0;
            $(this).text("start").addClass("start").removeClass("reset"); 
            
        } else if ($("#start-reset").hasClass("start")) {
            $(this).text("reset").addClass("reset").removeClass("start"); 
        } else {
            console.log("Should never get here!")
        }
        
        generateSeq();
        
    })


})

function generateSeq() {
    // generate sequence
    pushToConsole(levelCounter); // show current value of levelCounter on Display
    genRandomNum();
}


/* --------- helpers -----------*/
// push to console display
function pushToConsole(val) {
    $(".display").text(val);
}

// generate random numbers
function genRandomNum() {
     // generate random integer ranging from 1 to 4
    comSeq.push( Math.floor(Math.random() * 4) )
}

// reset Sequence 
function resetSeq() {
    // reset sequence
}



// replicated sequence
