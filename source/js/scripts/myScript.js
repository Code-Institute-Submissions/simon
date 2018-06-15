// initialisations
var userSeq = []; // to store user sequence
var comSeq = []; // to store computer generated sequence

var soundThemes = {
    android: [
        "source/sounds/android/wing0.wav",
        "source/sounds/android/wing1.wav",
        "source/sounds/android/wing2.wav",
        "source/sounds/android/wing3.wav"
        ],
    simon: [
        "source/sounds/simon/wing0.mp3",
        "source/sounds/simon/wing1.mp3",
        "source/sounds/simon/wing2.mp3",
        "source/sounds/simon/wing3.mp3"
        ],
    river_raid: [
        "source/sounds/river_raid/wing0.wav",
        "source/sounds/river_raid/wing1.wav",
        "source/sounds/river_raid/wing2.wav",
        "source/sounds/river_raid/wing3.wav"
        ],
    high_pitched: [
        "source/sounds/high_pitched/wing0.wav",
        "source/sounds/high_pitched/wing1.wav",
        "source/sounds/high_pitched/wing2.wav",
        "source/sounds/high_pitched/wing3.wav"
        ]
}



var id, color = 0;
var levelCounter = 0


//1- start board sequence
$(document).ready(function() {

    // power on simon!
    $("#power").click(function() {


        if ($(this).hasClass("power-off")) {
            location.reload(); // need a function to power down with sound!
            $(this).text("Turn on").addClass("power-on").removeClass("power-off");
        }
        else if ($(this).hasClass("power-on")) {
            $(this).text("Turn off").addClass("power-off").removeClass("power-on");
            pushToConsole("--");

            // while power is on
            $("#start-reset").click(function() {

                levelCounter++;
                // start-reset
                if ($("#start-reset").hasClass("reset")) {
                    levelCounter = 0;
                    $(this).text("start").addClass("start").removeClass("reset");
                }
                else if ($("#start-reset").hasClass("start")) {
                    $(this).text("reset").addClass("reset").removeClass("start");
                }
                else {
                    console.log("Should never get here!")
                }

                // generate random sequence
                genRandom();


                // pressWing();

            })
        }

    })


})

function generateSeq() {
    /*generate sequence*/
    pushToConsole(levelCounter); // show current value of levelCounter on Display
    genRandom();
    console.log(comSeq)
}

// push to console display
function pushToConsole(val) {
    $(".display").text(val);
}

// generate random numbers
function genRandom() {
    // generate random integer ranging from 1 to 4 for 40 rounds!
    var i;
    for (i = 0; i < 40; i++) {
        comSeq[i] = Math.ceil((Math.random() * 4));
    }
    console.log(comSeq)
}


function pressWing(input, debug = 0) {

    if (debug > 0) { console.log(">> pressWing()") }

    if (Number.isInteger(input)) {

        /*only for test purposes!*/
        var wing = $(`#${input}`)
        var wingClass = wingIdtoClass(input);
        wing.addClass(wingClass);
        playTune(input, theme="river_raid") // play tune

        if (debug > 0) { console.log("\tinput is a single integer:", input, "wingClass =", wingClass) };
    }
    else if (Array.isArray(input)) {
        if (debug > 0) { console.log("\tinput is a list:", input) }

        var i;
        for (var i = 0; i < input.length; i++) {
            var wing = $(`#${input[i]}`)
            var wingClass = wingIdtoClass(input[i]); // assign the right class to a given id
            wing.addClass(wingClass);

            if (debug > 0) { console.log("\ti =", i, "input[i] =", input[i], "wingClass =", wingClass) }
        };
    };
}


function wingIdtoClass(i) {
    /*
    this function takes a wing id and returns the asscociated 
    hit class (wing pressed!) 
    */

    if (i == 0) {
        return "green-hit";
    }
    else if (i == 1) {
        return "red-hit";
    }
    else if (i == 2) {
        return "yellow-hit";
    }
    else if (i == 3) {
        return "blue-hit";
    }
    else {
        //should never get here!
        console.log("crap in the generated sequence!\n");
        return "sequenceError";
    }
}


function playTune(wing, theme = "simon") {

    var tune = new Audio(soundThemes[theme][wing]);
    tune.play();
}
