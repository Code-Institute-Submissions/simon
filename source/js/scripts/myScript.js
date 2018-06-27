//  ========================= initialisations ============================ 
var userSelection = []; // to store user sequence
var simonSelection = []; // to store computer generated sequence
const WING_ID_TO_CLASS_OBJ = {1: "green-hit", 2: "red-hit", 3: "yellow-hit", 4: "blue-hit"};
var levelsNum = 20; // maximun number of levels. users reaching this level will win.
var currentLevel = 0; // shows current level 
var simonLevelData; // hold currentLevel simon selections if currentLevel = 3 then simonLevelData.length = 3
var userProgress = 0; // what step in the sequence the user is on. eg  level 6 , 4 keys pressed right so far then userProgress = 4
var clickTracker = 0; // number of clicks

// ================================ start ================================ 
// load page first
$(document).ready(function() {

    // power on simon!
    $("#power").click(function() {

        // toggle simon on/off
        $(this).toggleClass("on");

        // do stuff ONLY if it's switched on
        if (!$(this).hasClass("on")) {
            powerOffSimon(); // power off simon
        }
        else {
            powerOnSimon(); // power on simon

            /*Hanlders introduced to reduce clutter*/
            playResetHandler(); // handle PLAY/RESET button
            hiddenConsoleHandler(); // handle hidden console via CTRL
            setLevelHanlder(); // handle level button (id =tier)
            soundThemeHandler(); // handle toggle sound-theme button
            strictHandler(); // handle strict button functionality
            handleUserPlay(); // handle user clicks - make sound, highlight etc....

        }; 
    }); 
}) 
//  ================================ end ================================ 


//  ################################   ALL FUNCTIONS   ###############################
//  ================================ general functions ================================
// push to console display
function pushToConsole(val, size) {
    
    if (typeof val === "number") {
        $(".display").css("fontSize", 110)
        $(".display").text(IntegerPrecision(val));
    }
    else {
        if (size) {
            var DisplayFontSize = size;
        }
        else {
            var DisplayFontSize = 110;
        }

        $(".display").css("fontSize", DisplayFontSize)
        $(".display").text(val);
    };
    
    // if number is less than 10, add "0" behind it to show number as two digits
    function IntegerPrecision(number) {
        return (number < 10 ? '0' : '') + number;
    };
}

// get what's displaying on the console and its size
function getDisplayTxt() {
    
    var val = $(".display").text();
    var size = $(".display").css("fontSize");
    size = parseInt(size.replace("px", ""));
    return val, size;
}

// used with keyup/keydown methods to brieflt show the hidden console - bound to "CTRL" key 
function enableCheats(val) {

    if (val) {
        $(".console-hidden").show("puff", 200);
    }
    else {
        $(".console-hidden").hide("drop", "slow");
    };
}

// set a new value for levelsNum
function setLevelsNum() {
    
    levelsNum = parseInt(prompt("Please enter the maximum number of levels as an integer.\nNote: Number has be to greater than 4."));
    console.log("levelsNum =", levelsNum, typeof levelsNum)

    // error management
    while (isNaN(levelsNum) || levelsNum < 5) {
        console.log("levelsNum =", levelsNum)
        if (isNaN(levelsNum)) {
            levelsNum = parseInt(prompt("Please enter integers only"));
        }
        else if (levelsNum < 5) {
            levelsNum = parseInt(prompt("Please enter an integer higher than 4"));
        }
    }

}

/* ================================ click simulation functions ================================ */

function pressKey(input, debug = 0) {

    if (debug > 0) { console.log("\n>> pressKey()") }

    if (Number.isInteger(input)) {

        var wing = $(`#${input}`)
        wing.addClass( WING_ID_TO_CLASS_OBJ[input] );
        playTune(input) // play tune

        if (debug > 0) { console.log("\tinput is a single integer:", input, "wingClass =", wingClass) };
    }
}


function releaseKey(input) {
    var wing = $(`#${input}`)
    wing.removeClass( WING_ID_TO_CLASS_OBJ[input] );
}

function simulateClick(input) {
    pressKey(input);
    setTimeout(function() {
        releaseKey(input);
    }, 250);
}

/* ================================ user functions ================================ */
function handleUserPlay() {
    /*handle the user's clicks*/
    
    $("#1").click(function() {
        if ($("#start-reset").hasClass("reset")) {processClick(1);};
    });

    $("#2").click(function() {
        if ($("#start-reset").hasClass("reset")) {processClick(2);};
    });


    $("#3").click(function() {
        if ($("#start-reset").hasClass("reset")) {processClick(3);};
    });

    $("#4").click(function() {
        if ($("#start-reset").hasClass("reset")) {processClick(4);};
    });

    // nested funtion to avoid repetition
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
    if (input === simonLevelData[userProgress]) {
        // check userSelection with simonLevelData on the fly!
        console.log("\tcorrect user selection!", simonLevelData[userProgress])
        clickTracker = 0;
        userSelection[userProgress] = input;
        userProgress++;
    }
    else {
        pass = false;
        if ($("#strict").hasClass("on")) {
            // if strict is ON!
            playTheme("lose")
            pushToConsole("You Lose!", 20);
            setTimeout(function() {
                restorePlay();
            }, 4000);
        }
        else {
            // if strict is OFF!
            console.log("\tWRONG KEY!", input, "expected = ", simonLevelData[userProgress])
            pushToConsole("x_x", 70);
            userProgress = 0
            setTimeout(function() {
                simonPlay();
            }, 1000);
        }
    };

    console.log("len simon = ", simonLevelData.length, "len user = ", userSelection.length)
    console.log("clickTracker = ", clickTracker)

    if (simonLevelData.length === userSelection.length && pass) {
        currentLevel++;
        userProgress = 0;
        if (currentLevel === levelsNum) {
            pushToConsole("You win!", 20);
            playTheme("win")
            setTimeout(function() {
                restorePlay();
            }, 15000)
        }
        else {
            setTimeout(function() {
                simonPlay();
            }, 1000);
        }
    }

} // end of checkData()


/* ================================ simon functions ================================ */
function resetSimon() {
    /*HARD reset*/
    userSelection = []; // reset all selections currently held
    simonSelection = []; // reset all selections currently held
    currentLevel = 0; // reset back to 0
    userProgress = 0;
    intialiseSimon();
    pushToConsole("reseting...", 20); // push to console
    console.log("console reset!")
}


function startSimon() {
    /*Initiate Game!*/
    currentLevel++;
    simonPlay();
    pushToConsole(currentLevel);
}

// power off simon
function powerOffSimon() {
    playTheme("off")
    pushToConsole("Powering off...", 20);
    $("#power").html(`POWER ON <i class="fas fa-toggle-off"></i>`);
    setTimeout(function() {
        location.reload(); // need a function to power down with sound!
    }, 2000)
}

// power on simon
function powerOnSimon() {
    playTheme("on")
    $("#power").html(`POWER OFF <i class="fas fa-toggle-on"></i>`);
    /* Initialise simon */
    if (simonSelection.length === 0) {
        intialiseSimon(); // arguably at this level it will always be empty
    };
}

function intialiseSimon() {
    /*
    generate random integers ranging from 1 to 4 for "levelsNum" rounds!
    levelsNum:   total number of levels as integers; users reaching this level win;
    */
    for (var i = 0; i < levelsNum; i++) {
        simonSelection[i] = Math.ceil((Math.random() * 4));
    }
    // start console
    pushToConsole("press 'PLAY' to start", 15);
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


/* ============================== Handlers and other functions ============================== */
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

// press PLAY to start then RESET to reset
function playResetHandler() {
    $("#start-reset").click(function() {
        var resetDelay;
        if ($(this).hasClass("reset")) {
            playTheme("reset");
            resetSimon();
            resetDelay = 1500;
        }
        else {
            $(this).html(`RESET <i class="fas fa-eraser"></i>`);
            $(this).addClass("reset")
            resetDelay = 0;
        }
        setTimeout(startSimon, resetDelay);
    });
}

// revert back to the PLAY button from reset
function restorePlay() {
    resetSimon();
    pushToConsole("press 'PLAY' to start", 15);
    $("#start-reset").html(`PLAY <i class="fas fa-play"></i>`);
    $("#start-reset").removeClass("reset")
}

function hiddenConsoleHandler() {
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

    $("#hint").click(function() {
        if ($("#start-reset").hasClass("reset")) {
            simonPlay();
        }
    })

    $("#skip").click(function() {
        if (currentLevel < levelsNum - 1 && $("#start-reset").hasClass("reset")) {
            simonPlay(true);
        }
    })
}

// handle strict button 
function strictHandler() {
    $("#strict").click(function() {
        $(this).toggleClass("on");
        if ($(this).hasClass("on")) {
            playTheme("strict");
            $(this).html(`STRICT <i class="fas fa-toggle-on"></i>`);
        }
        else {
            $(this).html(`STRICT <i class="fas fa-toggle-off"></i>`);
        };
    });
}

// handle toggle sound theme button
function soundThemeHandler() {
    // toggle through sound themes!
    $(".sound").click(function() {
        toggleSoundThemes(debug = 1);
    });
}


// handle level button (id =tier)
function setLevelHanlder() {
    $(".tier").click(function() {
        setLevelsNum();
        $(this).text(`${levelsNum} LEVELS`)
    })

}

