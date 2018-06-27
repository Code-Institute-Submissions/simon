//  ========================= initialisations ============================ 
var userSelection = []; // to store user sequence
var simonSelection = []; // to store computer generated sequence
const WING_ID_TO_CLASS_OBJ = { 1: "green-hit", 2: "red-hit", 3: "yellow-hit", 4: "blue-hit" };
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
            toggleTags(); // handle the tags
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

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> setLevelsNum()") }

    levelsNum = parseInt(prompt("Please enter the maximum number of levels as an integer.\nNote: Number has be to greater than 4."));

    if (debug > 0) { console.log(`\tsetLevelsNum = "${levelsNum}" and type of "${typeof levelsNum}"`) }


    // error management
    while (isNaN(levelsNum) || levelsNum < 5) {

        if (isNaN(levelsNum)) {
            levelsNum = parseInt(prompt("Please enter integers only"));
        }
        else if (levelsNum < 5) {
            levelsNum = parseInt(prompt("Please enter an integer higher than 4"));
        }
    }

}

/* ================================ click simulation functions ================================ */

// simulate a click 
function simulateClick(input) {

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> simulateClick()") };

    pressKey(input);
    setTimeout(function() {
        releaseKey(input);
    }, 250);

    // nested function:  simulate pressing the key
    function pressKey(input) {

        if (debug > 0) { console.log("\t>> pressKey()") };

        if (Number.isInteger(input)) {

            var wing = $(`#${input}`)
            wing.addClass(WING_ID_TO_CLASS_OBJ[input]);
            playTune(input) // play tune

            if (debug > 0) { console.log(`\t\tadded "${WING_ID_TO_CLASS_OBJ[input]}" class to wing id "${input}"`) };
        };
    };

    // nested function:  simulate releasing the key
    function releaseKey(input) {

        if (debug > 0) { console.log("\t>> releaseKey()") }

        var wing = $(`#${input}`)
        wing.removeClass(WING_ID_TO_CLASS_OBJ[input]);

        if (debug > 0) { console.log(`\t\tremoved "${WING_ID_TO_CLASS_OBJ[input]}" class to wing id "${input}"`) };
    };

}

/* ================================ user functions ================================ */

// handle clicks made by player/user
function handleUserPlay() {

    $("#1").click(function() {
        if ($("#start-reset").hasClass("reset")) { processClick(1); };
    });

    $("#2").click(function() {
        if ($("#start-reset").hasClass("reset")) { processClick(2); };
    });


    $("#3").click(function() {
        if ($("#start-reset").hasClass("reset")) { processClick(3); };
    });

    $("#4").click(function() {
        if ($("#start-reset").hasClass("reset")) { processClick(4); };
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

    var debug = 0; // set to a number higher than zero to log debugs

    if (debug > 1) {
        console.log("\n>> checkData()");
        console.log("\tpreviousLevel = ", currentLevel);
        console.log("\tuserProgress = ", userProgress);
        console.log("\tsimonLevelData[userProgress] = ", simonLevelData[userProgress]);
        console.log("\tkey pressed = ", input);
    };

    var pass = true;
    if (input === simonLevelData[userProgress]) {

        // check userSelection with simonLevelData on the fly!
        if (debug > 0) { console.log("\tcorrect user selection!", simonLevelData[userProgress]) };

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
            setTimeout(restorePlay, 4000);
        }
        else {

            // if strict is OFF!
            if (debug > 0) { console.log("\tWRONG KEY!", input, "expected = ", simonLevelData[userProgress]) };

            pushToConsole("x_x", 70);
            userProgress = 0;
            setTimeout(simonPlay, 1200);
        }
    };

    if (debug > 3) {
        console.log("\tlen simon = ", simonLevelData.length, "len user = ", userSelection.length);
        console.log("\tclickTracker = ", clickTracker);
    };

    if (simonLevelData.length === userSelection.length && pass) {
        currentLevel++;
        userProgress = 0;
        if (currentLevel === levelsNum) {
            pushToConsole("You win!", 20);
            playTheme("win")
            setTimeout(restorePlay, 10000);
        }
        else {
            setTimeout(simonPlay, 700);
        }
    }

} // end of checkData()


/* ================================ simon functions ================================ */

// hard reset simon
function resetSimon() {

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> resetSimon()") };

    userSelection = []; // reset all selections currently held
    simonSelection = []; // reset all selections currently held
    currentLevel = 0; // reset 
    userProgress = 0; // reset 
    intialiseSimon();
    pushToConsole("reseting...", 20); // push to console

    if (debug > 0) { console.log("console reset!") };
}


// start playing sequence
function startSimon() {

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> startSimon()") };

    // Initiate Game!
    currentLevel++;
    simonPlay();
    pushToConsole(currentLevel);
}


// power simon OFF
function powerOffSimon() {

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> powerOffSimon()") };

    playTheme("off")
    pushToConsole("Powering off...", 20);
    $("#power").html(`POWER ON <i class="fas fa-toggle-off"></i>`);
    setTimeout(function() {
        location.reload(); // need a function to power down with sound!
    }, 2000)
}


// power simon ON
function powerOnSimon() {

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> powerOnSimon()") };

    playTheme("on")
    $("#power").html(`POWER OFF <i class="fas fa-toggle-on"></i>`);
    // Initialise simon 
    if (simonSelection.length === 0) {
        intialiseSimon(); // arguably at this level it will always be empty
    };
}


// initialise simon
function intialiseSimon() {

    // generate random integers ranging from 1 to 4 for "levelsNum" rounds!
    // levelsNum:   total number of levels as integers; users reaching this level win;

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> intialiseSimon()") };

    for (var i = 0; i < levelsNum; i++) {
        simonSelection[i] = Math.ceil((Math.random() * 4));
    };

    // start console
    pushToConsole("press 'PLAY' to start", 15);

    if (debug > 0) { console.log("\tsimonSelection = ", simonSelection) };

}


// play simon selections
function simonPlay(cheat = false, level = 0) {

    /*
    cheat:  skip current level to the next level.    
    level:  if cheat=== true jump to this level.
    */

    var debug = 0; // set to a number higher than zero to log debugs
    if (debug > 0) { console.log("\n>> simonPlay()") };

    // if cheat enabled!
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
    if (debug > 0) { console.log("\tsimonLevelData = ", simonLevelData) };

    if (simonSelection.length > 1) {
        var i = 0; // counter for setInterval loop
        var inter = setInterval(function() {
            simulateClick(simonSelection[i]);
            i++;

            if (i >= currentLevel) {
                if (debug > 0) { console.log(`\tsetInterval() cleared at level "${currentLevel}" after "${i}" steps`) };
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

// handle enabling and disable of the hidden cheat console
function hiddenConsoleHandler() {

    // enable hidden console! - DO NOT USE TOGGLE!; pressing and holding ctrl would cause weird behaviour
    $(document).keydown(function(event) {
        if (event.which === 17) {
            enableCheats(true);
        };
    });

    // disable hidden console! - DO NOT USE TOGGLE!; pressing and holding ctrl would cause weird behaviour
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


// handle level button (id = tier)
function setLevelHanlder() {
    $(".tier").click(function() {
        setLevelsNum();
        $(this).text(`${levelsNum} LEVELS`)
    })

}


// handle the tags
function toggleTags() {
    $("#tags").click(function() {
        $(this).toggleClass("on");
        if ($(this).hasClass("on")) {
            $("#1").text("1")
            $("#2").text("2")
            $("#3").text("3")
            $("#4").text("4")
        }
        else {
            $("#1").text("")
            $("#2").text("")
            $("#3").text("")
            $("#4").text("")
        };
    })
}
