# Cloud5
## CMPT276 Group Project

## Abstract
Battle Blobs is a fast-paced 2D top-down survival game that tests player's strategic thinking and memorization skills, by utilizing traps to outwit their opponents and survive the longest. Players select unique characters that have specialized traps and weapons to attack one another. Each game consists of four players competing until time runs out, with only one game running at a time. At the end of each game, players are awarded a respective ranking and have the option to play again or quit. Users control their characters with the arrow keys and space bar.

Features include
 - User sign-up and login
 - Character selection
 - Join a game with three other players
 - Chat with other players

## Purpose
The primary purpose of Battle Blobs is to provide entertainment to our target audience, by providing them with an interactive interface to play and socialize real-time. Players also benefit by improving strategic thinking, resource management, and memorization as they decide where and when to use their limited abilities.

## Target Users
Battle Blobs is targetted towards all ages 5+. The game aims to reach a wide audience by providing a simple interface with easy-to-learn controls, and strategic gameplay that attracts older populations. The game is targetted at players worldwide, but due to the host server being located in the US, players in North America will have the optimal experience as server request/response time will be minimal.

## Needs & Requirements
Battle Blobs needs to be designed with an intuitive user interface, creative game characters, and a robust gaming environment. Transition between different screens, character movement, and flow of gameplay need to occur fluidly in real-time. The game needs to utilize a login page, at least one web API and [socket.io](https://socket.io/) as a real-time engine for one or multiple game facets. Communication and socialization features of the game need to be available throughout the gameplay.

## Scope
The scope of the project is large enough for five people as there is a sufficient number of epics proportional to the number of group members. The details of these epics and game features are discussed in further detail below.

## Epic & Stories
The epics for this game are
 - A login/Sign-up feature
 - Ability to choose a fighter from a cast of characters (each with their own unique abilities)
 - A real-time chat to facilitate communication between players
 - Interactive and real-time gameplay where players try to outwith others to be the last player standing
 - End-of-game scoreboard to display rankings

Bob is a 12 year old boy who is accessing the website for the first time. Sue is a 16 year old girl who has been playing (game name) regularly for the past 4 months.

The potential story/scenario of this game will let the user navigate between 6 stages:

**Login/Starting Screen:** This is the first screen Bob will see. It will have a form through which Bob can sign up as the first time user by pressing a “sign up” button that leads to a sign-up page. Sue having already created an account will enter her username and password. After pressing the “Login” button, her credentials will be checked with the database and if they are correct, she will be logged in and brought to the home screen. Having an associated account with the game will allow Bob and Sue to access the game, and recognize/socialize with recurring players by username when they play with them.

**Sign Up Screen:** On this screen, Bob will see the form asking him for his desired username, password, and email (optional). After filling out and submitting the form, the inputs will be validated and a successful/failure message will be shown. If Bob signed up successfully, he will be redirected to the login/starting screen in order to sign in with his new credentials.

**Home Screen:** At this point, Bob and Sue will be interacting and experiencing the game in the same manner. This screen acquaints players with the game’s controls before the actual game is initiated. The controls are displayed in a box at the top of the screen. All players will be accustomed to the controls and be familiar with the gameplay in order to provide a fair experience. Bob and Sue can queue for a game while they view the controls, by pressing a button near the bottom of the screen. Upon pressing the button, both players will be placed into a queue. Once two other players have entered the queue, the game will initiate and all four players will be brought to the pregame screen.


**Pregame Screen:** Once they are familiar with the rules and controls of the game and are joined by two other players, Bob and Sue will see the cast of characters they can choose from. Each will have their own description and special abilities, which can be viewed by hovering over each character. To choose a character, they will click on the one they want and then press the “Join Game” button to proceed to the next screen. No two players can choose the same character, so if Bob has chosen his character and proceeded to the next screen, that character should no longer be available as an option to Sue. The restriction of unique character selection serves to instigate exhilarating and dynamic gameplay, and challenge players to adapt when they do not obtain their desired character.

**Game Screen:** After all four players have locked in their chosen fighter, the game will begin. The chosen fighters will be loaded onto the map and the players will be given control of their character. A chat box will be loaded to the right of the screen and players will be able to communicate or strategize with the other players in real-time. For the first minute, players will be forbidden from attacking others and will only be allowed to set traps around the map. Each player will have an allocated amount of traps that they can set. All traps will become invisible, even to the people who set them, once the first minute is over. After the first minute has passed, players will be allowed to attack each other with their weapons. The fighting will last for four minutes or until only one character is left standing. Each player will have their own unique weapon and be given a set amount of ammunition. Once they have exhausted their ammunition supply, they will be unable to fire their weapons and have to rely on other methods to win. In order to win, players will have to manage their ammunition well. Upon stepping on a trap, the players will sustain damage, even if they were the one to set the trap! Memorizing trap placements and luring enemies into traps will be crucial to victory, alongside ammunition management. Once four minutes have passed or only one player is left standing, the game will conclude and all four players will be brought to the postgame screen.

**Post-game screen:** After the game comes to an end, users will be redirected to a post-game screen displaying a “Game Over” message with results and rankings. This will incentivize players to play again, to maintain or improve their ranking. The game can end in two different ways: with a sole survivor being the winner or with the time running out and multiple survivors. For the former scenario, the ranking will be based on the time of death and the winner will be the sole survivor. The ranking for the latter scenario will be based on the amount of health of each character. The characters will be displayed in order of ranking and the four players will have the option to go back to the home screen to start another game.
