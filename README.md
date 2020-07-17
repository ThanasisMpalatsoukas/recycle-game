# Recycling game
Recycling game aims to help people understand better how recycling works by learning in a playful way.

## Game parameters
The code was made with flexibillity in a mind by letting the developers change easily the speed and the images that are used in the game.
To change the game speed and the images that are used simply go to **./script.js** and on the **CONFIG parameter on LINE 10**.

| Parameter name  | Value | Description |
| --------------- | ----- | ----------- |
| speed  | Integer  | The speed on which items are thrown in the game in ms |
| bin  | Array  | The images that correspond to each different garbage can. for example [1,11] means images from r1.png - r.11png **(Images need to have and r prefix!)**  |
| winningPoints | Integer | The amount of points a user must get to win |
| amountOfLosingEl | Integer | Amount of elements that need to be spawned the same time on the board to lose the game |

**Example**
```javascript
let CONFIG = {
    speed: 2000,
    bin: {
        "blue" : [20,28],
        "brown" : [12,19],
        "green" : [1,11]
    },
    winningPoints: 300,
    amountOfLosingEl: 10
}
```

these configurations mean that we got items spawning every 2s. Images between 1-11 are for the green bin, 12-19 for the brown bin and 20-28 for the blue bin. The 
player wins the game if he manages to get 300 points and loses if 10 items are currently on the board.