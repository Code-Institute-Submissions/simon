// initialisations
var userSelection = []; // to store user sequence
var simonSelection = []; // to store computer generated sequence

var soundThemesObj = {
    android: [
        "source/sounds/android/wing1.wav",
        "source/sounds/android/wing2.wav",
        "source/sounds/android/wing3.wav",
        "source/sounds/android/wing4.wav"
    ],
    simon: [
        "source/sounds/simon/wing1.mp3",
        "source/sounds/simon/wing2.mp3",
        "source/sounds/simon/wing3.mp3",
        "source/sounds/simon/wing4.mp3"
    ],
    river_raid: [
        "source/sounds/river_raid/wing1.wav",
        "source/sounds/river_raid/wing2.wav",
        "source/sounds/river_raid/wing3.wav",
        "source/sounds/river_raid/wing4.wav"
    ],
    high_pitched: [
        "source/sounds/high_pitched/wing1.wav",
        "source/sounds/high_pitched/wing2.wav",
        "source/sounds/high_pitched/wing3.wav",
        "source/sounds/high_pitched/wing4.wav"
    ]
}
var soundTheme = "simon";
var levelsNum = 20 // maximun number of levels. users reaching this level will win.
var currentLevel = 0 // shows current level 


//1- start board sequence
$(document).ready(function() {

    // power on simon!
    $("#power").click(function() {

        // toggle through sound themes!
        $(".sound").click(function() {
            toggleSoundThemes(debug = 1);
        });

        if ($(this).hasClass("power-off")) {
            location.reload(); // need a function to power down with sound!
            $(this).text("Turn on").addClass("power-on").removeClass("power-off");
        }
        else if ($(this).hasClass("power-on")) {
            $(this).text("Turn off").addClass("power-off").removeClass("power-on");

            /* Initialise simon */
            if (simonSelection.length === 0) {
                intialiseSimon();
            };

            startSimon();
            userPlay();

            // while power is on
            /*
            $("#start-reset").click(function() {
                if ($("#start-reset").hasClass("reset")) {
                    resetSimon();
                    $(this).text("start").addClass("start").removeClass("reset");
                }
                else if ($("#start-reset").hasClass("start")) {
                    $(this).text("reset").addClass("reset").removeClass("start");
                    startSimon();
                }
                else {
                    console.log("Should never get here!")
                }
            

                userPlay();

            });
            */
        };


    });
})


/* ------------------------ general functions ----------------------------------*/

// push to console display
function pushToConsole(val) {
    if (typeof val === "number") {
        $(".display").text(IntegerPrecision(val));
    }
    else {
        $(".display").text(val);
    };

    function IntegerPrecision(number) {
        /* if number is less than 10, add "0" behind it to show number as two digits
         */
        return (number < 10 ? '0' : '') + number;
    };
}

/* ------------------------ sound functions ----------------------------------*/

function playTune(wing, theme = soundTheme) {
    /*switch keypress tunes*/
    if (soundTheme !== "mute") {
        var tune = new Audio(soundThemesObj[theme][wing - 1]);
        tune.play();
    };
}


function toggleSoundThemes(debug = 0) {

    /*Change sound themes*/

    if (debug > 0) { console.log("\n>> toggleSoundThemes()") }

    var button = $(".sound");

    if (soundTheme === "simon") {
        soundTheme = "river_raid";
        button.html(`${soundTheme.replace("_", " ")} <i class="fas fa-volume-up"></i>`);
    }
    else if (soundTheme === "river_raid") {
        soundTheme = "android";
        button.html(`${soundTheme} <i class="fas fa-volume-up"></i>`);
    }
    else if (soundTheme === "android") {
        soundTheme = "high_pitched";
        button.html(`${soundTheme.replace("_", " ")} <i class="fas fa-volume-up"></i>`);
    }
    else if (soundTheme === "high_pitched") {
        soundTheme = "mute";
        button.html(`muted <i class="fas fa-volume-off"></i>`);
    }
    else {
        soundTheme = "simon";
        button.html(`${soundTheme} <i class="fas fa-volume-up"></i>`);
    }

    if (debug > 0) { console.log("\tsoundTheme = ", soundTheme) }
}


/* ------------------------ core functions ----------------------------------*/

function wingIdtoClass(i) {

    if (i == 1) {
        return "green-hit";
    }
    else if (i == 2) {
        return "red-hit";
    }
    else if (i == 3) {
        return "yellow-hit";
    }
    else if (i == 4) {
        return "blue-hit";
    }
    else {
        //should never get here!
        console.log(i, "crap in the generated sequence!\n");
        return "sequenceError";
    }
}


function pressKey(input, debug = 0) {

    if (debug > 0) { console.log("\n>> pressKey()") }

    if (Number.isInteger(input)) {

        var wing = $(`#${input}`)
        var wingClass = wingIdtoClass(input);
        wing.addClass(wingClass);
        playTune(input) // play tune

        if (debug > 0) { console.log("\tinput is a single integer:", input, "wingClass =", wingClass) };
    }
}


function releaseKey(input) {
    // console.log("\nreleaseWing(): i got called");
    var wing = $(`#${input}`)
    var wingClass = wingIdtoClass(input);
    // console.log("\twing = ", wing, "wingClass = ", wingClass)
    wing.removeClass(wingClass);
}

function simulateClick(input) {
    pressKey(input);
    setTimeout(function() {
        releaseKey(input);
    }, 250);
}

function simulateClick_Beta(input) {
    var counter = 0;
    var x = setInterval(function() {
        counter++;
        console.log(counter)
        pressKey(input);
        playTune(input);
        setTimeout(releaseKey(input), 1000);
        if (counter > 5) {
            clearInterval(x);
        }
    }, 800)
}


/* ------------------------ user functions ----------------------------------*/


function userPlay() {

    $("#1").click(function() {
        simulateClick(1);
        pushUserSelection(1);
        checkSelection();
    })

    $("#2").click(function() {
        simulateClick(2);
        pushUserSelection(2);
        checkSelection();
    })


    $("#3").click(function() {
        simulateClick(3);
        pushUserSelection(3);
        checkSelection();
    })


    $("#4").click(function() {
        simulateClick(4);
        pushUserSelection(4);
        checkSelection();
    })

}


function pushUserSelection(input) {
    if (currentLevel === 1) {
        userSelection.push(input);
    }
    else {

        for (var i = 0; i < currentLevel; i++) {
            if (i < currentLevel - 1) {

                continue;
            }
            console.log("\n>> pushUserSelection(): currentLevel, i = ", currentLevel, i)
            userSelection[i] = input;
        }
    }

    console.log("\n>> pushUserSelection(): userSelection = ", userSelection);

}


function checkSelection() {
    // currentLevel;
    /*
    check user input
    compare with simon input
    if matched currentLevel++
    run simonplay again
    */
    console.log("\n>> checkSelection(): userSelection:", userSelection)
    var simonSelectionSliced = simonSelection.slice(0, userSelection.length);
    setTimeout(function() {

        // data/level check
        if (simonSelectionSliced.length === userSelection.length) {
            if (simonSelectionSliced.join() == userSelection.join()) {
                currentLevel++;
                simonPlay();
            }
            else {
                console.log("fucked up!",
                    "\nsimonSelectionSliced = ", simonSelectionSliced,
                    "\nuserSelection = ", userSelection)
            }

        }
    }, 1000)


}


// check user selection
function checkData() {

    /*
    1.  analyse data:   only push to "userSelection" list if the selection is correct
    2.  
        if selection is valid:
            currentLevel++;
            playsimon;
            
        if selection invalid:
            push "err" to console;
            resetSimon();
            simonPlay();
    */
    





}


/* ------------------------ simon functions ----------------------------------*/

function resetSimon() {
    /*HARD reset*/
    userSelection = []; // reset all selections currently held
    simonSelection = []; // reset all selections currently held
    currentLevel = 0; // reset back to 0
    intialiseSimon();
    pushToConsole(currentLevel) // push to console
    console.log("console reset!")
}


function startSimon() {
    /*Initiate Game!*/
    currentLevel++;
    simonPlay();
    pushToConsole(currentLevel);
}


function intialiseSimon() {
    /*
    generate random integers ranging from 1 to 4 for "levelsNum" rounds!
    levelsNum:   total number of levels as integers; users reaching this level win;
    */
    for (var i = 0; i < levelsNum; i++) {
        simonSelection[i] = Math.ceil((Math.random() * 4));
    }
    // reset console to 00
    pushToConsole(currentLevel);
    console.log("intialiseSimon():  simonSelection = ", simonSelection)
}


function simonPlay(cheat = false, level = 0) {
    /*  level:  play simon at this level
        test:   allows playing of the simon-held selections without 
                having to complete the sequence
        */

    if (cheat) {
        if (level == 0) {
            currentLevel++;
        }
        else {
            currentLevel = level;
        }
    };

    pushToConsole(currentLevel);

    if (simonSelection.length > 1) {
        var i = 0; // counter for setInterval loop
        var inter = setInterval(function() {
            simulateClick(simonSelection[i]);
            i++;
            // console.log("simonSelection[i-1] = ", simonSelection[i - 1], i, currentLevel)
            if (i >= currentLevel) {
                console.log("inter cleared i, currentLevel", i, currentLevel)
                clearInterval(inter);
            }
        }, 500);
    };
}

// a generic cheating function to be implemented for the user to cheat!
// same as " simonPlay(true) or simonPlay(true, level) "
function cheat(level) {
    if (level) {
        simonPlay(true, level);
    } else {
        simonPlay(true);
    }
}
