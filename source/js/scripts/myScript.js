// sound theme object!
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

// initialisations
var userSelection = []; // to store user sequence
var simonSelection = []; // to store computer generated sequence
var soundTheme = "simon"; // default sound theme
var levelsNum = 20; // maximun number of levels. users reaching this level will win.
var currentLevel = 0; // shows current level 
var simonLevelData; // hold currentLevel simon selections if currentLevel = 3 then simonLevelData.length = 3
var userProgress = 0; // what step in the sequence the user is on. eg  level 6 , 4 keys pressed right so far then userProgress = 4
var clickTracker = 0; // number of clicks
var resetDelay; // time to wait before reseting 

//1- start board sequence
$(document).ready(function() {

    // power on simon!
    $("#power").click(function() {

        // do stuff ONLY if it's switched on
        $(this).toggleClass("on");
        if (!$(this).hasClass("on")) {
            $(this).html(`OFF <i class="fas fa-toggle-off"></i>`);
            location.reload(); // need a function to power down with sound!
        }
        else {
            $(this).html(`ON <i class="fas fa-toggle-on"></i>`);

            /* Initialise simon */
            if (simonSelection.length === 0) {
                intialiseSimon(); // arguably at this level it will always be empty
            };

            $("#start-reset").click(function() {

                if ($(this).hasClass("reset")) {
                    resetSimon();
                    resetDelay = 1500;
                }
                else {
                    $(this).html(`RESET <i class="fas fa-eraser"></i>`);
                    $(this).addClass("reset")
                    resetDelay = 0;
                }
                setTimeout(startSimon, resetDelay)
            })

            // enable hidden console! - DO NOT WISH TO TOGGLE!; pressing and holding ctrl would manifest weird behaviour
            $(document).keydown(function(event) {
                if (event.which === 17) {
                    enableCheats(true);
                };
            });

            // disable hidden console! - DO NOT WISH TO TOGGLE!; pressing and holding ctrl would manifest weird behaviour
            $(document).keyup(function(event) {
                if (event.which === 17) {
                    enableCheats(false);
                };
            });


            // toggle through sound themes!
            $(".sound").click(function() {
                toggleSoundThemes(debug = 1);
            });


            $("#hint").click(function() {
                simonPlay();
            })

            $("#skip").click(function() {
                simonPlay(true);
            })

            $("#strict").click(function() {
                $(this).toggleClass("on");
                if ($(this).hasClass("on")) {
                    $(this).html(`STRICT <i class="fas fa-toggle-on"></i>`);
                }
                else {
                    $(this).html(`STRICT <i class="fas fa-toggle-off"></i>`);
                };
            });

            // player interaction funtion
            userPlay();

        }; // end of if power on!
    }); // end of power click function
}) // end of ready function


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

function enableCheats(val) {
    // $(".console-hidden").fadeIn(800);
    if (val) {
        $(".console-hidden").show("puff", 200);
    }
    else {
        $(".console-hidden").hide("drop", "slow");
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
        button.html(`${soundTheme.replace("_", " ").toUpperCase()} <i class="fas fa-volume-up"></i>`);
    }
    else if (soundTheme === "river_raid") {
        soundTheme = "android";
        button.html(`${soundTheme.toUpperCase()} <i class="fas fa-volume-up"></i>`);
    }
    else if (soundTheme === "android") {
        soundTheme = "high_pitched";
        button.html(`${soundTheme.replace("_", " ").toUpperCase()} <i class="fas fa-volume-up"></i>`);
    }
    else if (soundTheme === "high_pitched") {
        soundTheme = "mute";
        button.html(`MUTED <i class="fas fa-volume-off"></i>`);
    }
    else {
        soundTheme = "simon";
        button.html(`${soundTheme.toUpperCase()} <i class="fas fa-volume-up"></i>`);
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
        processClick(1);
    })

    $("#2").click(function() {
        processClick(2);
    })


    $("#3").click(function() {
        processClick(3);
    })


    $("#4").click(function() {
        processClick(4);
    })

    function processClick(id) {
        clickTracker++;
        simulateClick(id);
        checkData(id);
    };

}


// check user selection
function checkData(input) {

    //  eg: 
    //      currentLevel   = 2  
    //      simonLevelData = [2, 2]

    console.log("\ncheckData():");
    console.log("previousLevel = ", currentLevel);
    console.log("userProgress = ", userProgress);
    console.log("simonLevelData[userProgress] = ", simonLevelData[userProgress]);
    console.log("key pressed = ", input);

    var pass = true;
    // check userSelection with simonLevelData on the fly!
    if (input === simonLevelData[userProgress]) {
        console.log("\tcorrect user selection!", simonLevelData[userProgress])
        clickTracker = 0;
        userSelection[userProgress] = input;
        userProgress++;
    }
    else {
        pass = false;
        if ($("#strict").hasClass("on")) {
            // if strict is ON!
            pushToConsole("Err");
            setTimeout(function() {
                resetSimon();
                startSimon();
            }, 2000);
        }
        else {
            // if strict is OFF!
            console.log("\tWRONG KEY!", input, "expected = ", simonLevelData[userProgress])
            pushToConsole("XX");
            userProgress = 0
            setTimeout(function() {
                simonPlay();
            }, 1000);
        }
    };

    console.log("len simon = ", simonLevelData.length, "len user = ", userSelection.length)
    console.log("clickTracker = ", clickTracker)

    if (simonLevelData.length === userSelection.length && pass) {
        setTimeout(function() {
            currentLevel++;
            userProgress = 0;
            simonPlay();
        }, 1000);
    }

}


/* ------------------------ simon functions ----------------------------------*/

function resetSimon() {
    /*HARD reset*/
    userSelection = []; // reset all selections currently held
    simonSelection = []; // reset all selections currently held
    currentLevel = 0; // reset back to 0
    userProgress = 0;
    intialiseSimon();
    // pushToConsole(currentLevel) // push to console
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
    console.log("\nsimonPlay():")

    if (cheat) {
        if (level == 0) {
            currentLevel++;
        }
        else {
            currentLevel = level;
        }
    };

    pushToConsole(currentLevel);

    // set data with respect to currentLevel
    simonLevelData = simonSelection.slice(0, currentLevel);
    console.log("simonLevelData = ", simonLevelData)

    if (simonSelection.length > 1) {
        var i = 0; // counter for setInterval loop
        var inter = setInterval(function() {
            simulateClick(simonSelection[i]);
            i++;
            // console.log("simonSelection[i-1] = ", simonSelection[i - 1], i, currentLevel)
            if (i >= currentLevel) {
                console.log("\tinter cleared!", "currentLevel = ", currentLevel, "steps = ", i)
                clearInterval(inter);
            }
        }, 500);
    };
}

// a generic cheating function to be implemented for the user to cheat!
// same as " simonPlay(true) or simonPlay(true, level) "
function cheat(level) {
    userSelection = simonLevelData;
    if (level) {
        simonPlay(true, level);
    }
    else {
        simonPlay(true);
    }
}
