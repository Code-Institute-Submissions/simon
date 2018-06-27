
/* ================================ sound functions ================================ */

var soundTheme = "simon"; // default sound theme

// sound theme object!
const SOUND_THEMES_OBJ = {
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
    ],
    other: {
        on: "source/sounds/other/on.mp3",
        reset: "source/sounds/other/reset.mp3",
        off: "source/sounds/other/off.mp3",
        win: "source/sounds/other/win.mp3",
        control: "source/sounds/other/alert.mp3",
        lose: "source/sounds/other/lose.mp3",
        strict: "source/sounds/other/alert.mp3"
    }
}

function playTune(wing, theme = soundTheme, consoleItem = "") {
    /*switch keypress tunes*/
    if (soundTheme !== "mute") {
        var tune = new Audio(SOUND_THEMES_OBJ[theme][wing - 1]);
        tune.play();
    };
}

function playTheme(val) {
    /*switch playing themes*/
    var tune = new Audio(SOUND_THEMES_OBJ["other"][val]);
    tune.play();
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
} // end of toggleSoundThemes()

