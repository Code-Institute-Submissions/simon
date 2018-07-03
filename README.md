                                                          Y\     /Y
                                                          | \ _ / |
                                    _____                 | =(_)= |
                                ,-~"     "~-.           ,-~\/^ ^\/~-.
                              ,^ ___     ___ ^.       ,^ ___     ___ ^.
                             / .^   ^. .^   ^. \     / .^   ^. .^   ^. \
                            Y  l    O! l    O!  Y   Y  lo    ! lo    !  Y
                            l_ `.___.' `.___.' _[   l_ `.___.' `.___.' _[
                            l^~"-------------"~^I   l^~"-------------"~^I
                            !\,               ,/!   !                   !
                             \ ~-.,_______,.-~ /     \                 /
                              ^.             .^       ^.             .^ 
                                "-.._____.,-"           "-.._____.,-"
                            


Project’s core functionality
============================

### Aim

To re-create the classic memory game of
“[SIMON](https://en.wikipedia.org/wiki/Simon_(game))” as a website, where the
user can play against the computer (Simon). The logic of the game was to be
written with JavaScript. The game’s aesthetics were to be done using the
conventional HTML/CSS technologies.

The focus of this project was on functionality and logic ONLY rather than
aesthetic. However, the website is fully responsive on variety of devices and
resolutions.

### What it does

Simon plays a randomly generated sequence for the player to repeat using colours
and tones. The player has the sole goal of repeating the same sequence as Simon
to win the game. The sequence will get longer and longer as the player
progresses to higher levels.

Features
========

<img src="source/img/simon.png"/>

The features are split into two groups, the ‘core features’ are needed for the
game to function properly and the additional features to make the experience
more pleasant and fun.

### Core features

1.  Smart Console

    -   Shows the level progression, resetting, wrong selections, winning,
        losing messages etc with an arcade themed font.

2.  Turn ON

    -   Powers on the game, will stand by until the player starts the game –
        Console aided.

3.  Turn OFF

    -   Powers off the game – Console aided.

4.  Start Game

    -   Initiates the game

5.  Reset game

    -   Reset the current game - console aided.

6.  Simon play

    -   Will play its randomly generated sequence and depending on the selected
        mode, it will carry on playing the sequence until the user gets it
        right. Refer to ‘STRICT” mode.

7.  User play

    -   Will simulate player clicks on the coloured pads and keeps track of the
        player selections – Console aided.

8.  Check user sequence.

    -   Process the user selections. will decide if the player has won, lost,
        made the wrong selection and etc – Console aided

9.  Strict mode

    -   While this mode is active, any wrong selections made by the player will
        end the game abruptly, as opposed to the ‘normal mode’ where the
        sequence will be repeatedly played until the player gets it right.

10. Nostalgic classic arcade tunes for different functions of the game.

### Additional features

1.  LEVELS-Setter

    -   Using the “LEVELS” button, the maximum number of level can be manually
        set by the player.

        -   By default, the number of levels is to ‘20’.

        -   The minimum level that can be set by the player is ‘5’.

        -   The maximum level has no limit. It could be set to any integer.

2.  Hidden “CHEAT” Console

    -   Holding the “CTRL” key while the game is in session will slide in a
        hidden “CHEAT” console, granting the player the two abilities listed
        below via two buttons:

        -   Replay the current level sequence to jog player’s memory – Labelled
            “hint”.

        -   Skip the level entirely – Labelled “skip level”.

            -   Note: it will skip levels until the set or default number of
                levels has been reached, the last level (whatever it is, either
                the default of ‘20’ or player set via the set level button) has
                to be played by the player. For instance, if the player has set
                the number of levels to ‘6’, it will skip the level up until
                level ‘5’, the player has to select the right sequence on the
                last level in order to win the game.

            -   This feature also makes testing the game significantly easier.

3.  Multiple sound themes to choose from including ‘mute’, the list of which are
    listed below:

    -   Simon – default

    -   River Raid – Inspired by a classic Attari game [River
        Raid](https://en.wikipedia.org/wiki/River_Raid).

    -   Android

    -   High-pitched

    -   Mute – no sound

4.  Colour-blind friendly

    -   “TAGS” button – Toggle on and off numbers on the pads, making it easier
        for the colour-blind to keep track the sequence.

        -   By default, set to ‘OFF’.

5.  Multi-functional buttons

    -   “Power ON/OFF” button

    -   “PLAY/RESET” button

Technologies used
=================

-   JavaScript

    -   Approximately 25 functions

    -   5 nested functions

    -   Two user scripts

-   jQueries

    -   version

-   SASS

    -   Used heavily

    -   5 files in total

-   HTML5

-   CSS

-   Flexbox

    -   Primary tool for centring items.

-   Bootstrap v4.1.0

-   Font Awesome

    -   Console buttons and footer

-   Google fonts

    -   For the console

-   Gimp

-   Microsoft Word

-   Chrome and Firefox developer tools

-   Git/Github

-   Cloud9

Content and file management
===========================

List of all files

Functions split into different sections simon, user and so on

Sass functions and mixins – list all

Testing
=======

### Logic Debugging

All core functions are equipped with a self-constructed debugging

### Responsiveness/Aesthetics Testing

The responsiveness, functionality, fluidity of each page was extensively and
virtually tested on all the Chrome/Firefox responsive tool’s available devices,
ranging from Amazon fire tablets to iPhone x. Additionally, every page was
numerously loaded on the following devices by various users in order to identify
possible malfunctions and misbehaving elements.

-   iPhone x

-   Google Pixel 2

-   iPhone 7 Plus

-   Nexus 6P

-   22inch Full HD 1080p monitor

-   25inch Quad HD 1440p screen

-   13inch Full HD screen of a Dell XPS Ultrabook.

Project deployment
==================

Split into two Console and the pads -how

1.  Ideas/research

>   Schematics, game rules, exploring ideas, feasibility and so on

1.  crude Layout

>   crude layout to start the logic with

1.  Logic

2.  Logic test

3.  Nav and footer

4.  Nav and footer test

5.  Responsiveness test

6.  Fine tuning

improvements to be made or could be made

-   limiting clicks or disabling clicks

-   using a form for the set level functionality

-   theme changer

-   score board

-   tooltips

-   tutorials

Bugs and problems

-   QHD caused problems

-   XPS 13 - 13 inch 1080p screen set to 125% caused problems

-   firefox nav bar

