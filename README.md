# Cloud5
CMPT276 Group Project

Abstract
Hidden Traps is a fast-paced strategy/survival game that allows players to set traps and attack their opponents, developing their strategic thinking and memorization skills. The objective of the game is to outwit the other players and survive the longest. Each game will be limited to four players, with only one game running at a time. Features include the ability to login or sign up, choose a character, join a game with three other players, chat with other players, and carry out game actions using the keyboard controls. During gameplay, users will be able to attack their opponents using traps and specialized weapons, depending on the character chosen. The game ends once the timer is up, and players will be able to see their respective rankings before deciding to play again or quit. 


Purpose
The primary purpose of Hidden Traps is to provide entertainment to our target audience; this will be accomplished through an interactive interface which allows them to socialize in an exciting, real-time environment. Additionally, this game aims to improve players’ strategic thinking, resource management skills, and memorization skills as they decide where and when to use their limited abilities.  


Target Users
	Hidden Traps is primarily targeted at people aged 5+, especially those that are interested in games. This includes kids, teens and young adults worldwide. We hope to reach a wide audience by providing a simple interface with easy-to-learn controls, however, our game has the potential to reach older populations through the strategic gameplay. Although our target audience is worldwide, due to the host server being located in the US, players in North America will have optimal experience using the game and its features as server request/response time will be minimal.


Needs & Requirements
	Hidden Traps needs to be designed with an intuitive user interface, creative game characters and a robust gaming environment. Transition between different screens, movement of characters and flow of gameplay need to occur fluidly in real-time. Game design needs to incorporate learning of strategic thinking and resource management as two essential, transferable life skills. In addition, the game needs to utilize a login page, at least one web API and socket.io as a real-time engine for one or multiple game facets. Communication and socialization features of the game need to be available throughout the gameplay.


Scope
The scope of the project is large enough for five people as it has a sufficient number of epics which is proportional to the number of group members. The details of these epics and game features are discussed in further detail below.


Epics & Stories
The epics that we will have in this game will consist of:  a login/sign-up feature, the ability to choose a fighter from a cast of characters (each with their own unique abilities), a real-time chat to facilitate communication between players, interactive and real-time gameplay where players try to outwit others to be the last player standing, and an end-of-game scoreboard to display rankings.

Bob is a 12 year old boy who is accessing the website for the first time.
Sue is a 16 year old girl who has been playing (game name) regularly for the past 4 months.

The potential story/scenario of this game will let the user navigate between 6 stages: 

Login/Starting Screen
This is the first screen Bob will see. It will have a form through which Bob can sign up as the first time user by pressing a “sign up”  button that leads to a sign-up page. 
Upon reaching the website, Sue will have to input her username and password, which she has already created beforehand. After pressing the “Login” button, her credentials will be checked with the database and if they are correct, she will be logged in and brought to the home screen. 
Having an associated account with the game will allow Bob and Sue to access the game, and recognize recurring players by username when they play with them, facilitating social interaction.


Sign Up Screen
On this screen, Bob will see the form asking him for his desired username, password, and email (optional). After filling out and submitting the form, the inputs will be validated and a successful/failure message will be shown. If Bob signed up successfully, he will be redirected to the login/starting screen in order to sign in with his new credentials. 

Home Screen
At this point, Bob and Sue will be interacting with and experiencing the game in the same manner.
This screen will be used to acquaint players with the game’s controls so that once the actual game is initiated, all players will be accustomed to the controls and be familiar with the gameplay in order to provide a fair experience. 
The home screen is where Bob and Sue will be able to view the controls, displayed in a box at the top of the screen, as well as queue up for a game using a button near the bottom of the screen. Upon pressing the button, both players will be placed into a queue. Once two other players have entered the queue, the game will initiate and Bob, Sue and the two others whom will be brought to the pregame screen.  

Pregame Screen
Once they are familiar with the rules and controls of the game and are joined by two other players, Bob and Sue will see the cast of characters they can choose from. Each will have their own description and special abilities, which they can view by hovering over each character. To choose a character, they will click on the one they want and then press the “Join Game” button to proceed to the next screen.  No two players can choose the same character, so if Bob has chosen his character and proceeded to the next screen, that character should no longer be available as an option to Sue. The restriction of unique character selection serves to instigate exhilarating and dynamic gameplay, and challenge players to adapt when they do not obtain their desired character.

Game Screen
After all four players have locked in their chosen fighter, the game will begin. The chosen fighters will be loaded onto the map and the players will be given control of their character. A chat box will be loaded to the right of the game and players will be able to communicate or strategize with the other players in real-time. 
For the first minute, players will be forbidden from attacking others and will only be allowed to set traps around the map. Each player will have an allocated amount of traps that they can set. All traps will become invisible, even to the people who set them, once the minute is over and the fighting will commence. 
Once the first minute has passed, players will be allowed to start attacking others with their weapons. The fighting will last for four minutes or until only one character is left standing. Each player will have their own unique weapon and be given a set amount of ammunition. Once they have exhausted their ammunition supply, they will be unable to fire their weapons and have to rely on other methods to win. In order to win, players will have to manage their ammunition well. Upon stepping on a trap, the players will sustain damage, even if they were the one to set the trap! Memorizing trap placements and luring enemies into traps will be crucial to victory, alongside ammunition management. 
Once four minutes have passed or only one player is left standing, the game will conclude and all four players will be brought to the postgame screen.

Post-game screen
After the game comes to an end, users will be redirected to a post-game screen displaying a “Game Over” message with results and rankings. This will incentivize players to play again, to maintain or improve their ranking. Note that the game can end in two different ways. The game can end with a sole survivor being the winner or with the time running out with multiple survivors. For the former scenario, the ranking will be based on the time of death and the winner will be the sole survivor. The ranking for the latter scenario will be based on the amount of health of each character. The characters will be displayed in order of ranking and the four players will have the option to go back to the home screen to start another game. 
