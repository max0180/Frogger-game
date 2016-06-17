# Frogger Game 

My practice project to recreate a popular arcade game using HTML5 Canvas API and JavaScript with object-oriented elements.

## How to start and play the game

To play the game either clone the repository with git or download it to your computer as a zip file. The game can be started by simply opening the index.html located in the root folder in any supported web-browser (tested in Chrome v51).

### Player

The player's default position is in the middle at the bottom of the game 
area. The player is moved around the game area grid using keyboard arrow keys:

- move up :arrow_up:
- move down :arrow_down:
- move to the right :arrow_right:
- move to the left :arrow_left:

### Game strategy, score and lives

The goal of the game is for the player to get the highest possible score.

The game starts with **score: 0** and **3 lives**. 

The player crosses to the water strip while navigating around stones
and avoiding collisions with enemy bugs. If the player is hit by an enemy bug, a life is deducted and the player is returned to its default position. When the player reaches the water strip, the score is increased by 5 points and the game is reset. The game becomes progressively harder each time the player reaches the water strip, and it continues as long as the player has more than 0 lives.

The player is also encouraged to collect randomly appearing gems to increase the score and the number of lives:

- Blue Gem +1 point
- Green Gem +2 points
- Orange Gem +3 points
- Heart +1 life

### Future Improvements

- Make a timed game
- Add player image selector utility/start menu
- Add restart functionality from the game over screen
- Create a savable list of players with their names and highest achieved scores











