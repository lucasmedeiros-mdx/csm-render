Back when I played the game only the Java applet existed, and there was no such thing as a HTML5 version. So, in the past few days I've been analyzing CSM code (front-end) to understand how the game is rendered and what kind of information I can get from the API. This post will cover some of these aspects, being more suited to developers, it still has some interesting information about the maps itself.

Some quirks I found:
* Pressing "Q" will display the scoreboard while the round is going on, I don't think this exists in the Java version and don't know if this is a popular information, as opposed to the "Spacebar" shorcut.
* In Public matches, You can check the tactics name from both teams (and see how creative users are when naming tactics = not really).
* You can also check the number of rounds the match has.
* It becomes clear the HTML5 version is ported from the Java version



**Game Board**

When creating HTML5 based games, the board where animation is drawn is called "Canvas", this will be referenced in following sections.


**Loading Map Information**

In CSM files, a map is an object with the following information: Image (Background Image), Width, Height, Number of valid coordinates in map, Binary file with coordinates.

This is a mock of CSM initialization of a map:
<pre>var map = new Map(117,0,"de_dust2","maps/de_dust2.new.map","images/de_dust2.png",876,606,17985)</pre>

The basic information here is that we're starting a de_dust2 map and the background image for it is the file "de_dust2.png".

This will create a new map with 876 width, 606 height and **17985 valid locations**.
Each location is a coordinate with a X and Y related to the canvas, this information is stored in "de_dust2.new.map" file in a binary format.

CSM stores coordinates from 3 in 3 pixels. For dust2, the first point is mapped at x:564 y:51, the second at x:567 y:51, and so on. So a user can't be in coordinate (565,51) as that's an invalid location, this is an interesting factor to keep in mind when creating tactics.

This information is loaded in the map settings and applied to the canvas:
<pre>this.loadMap('de_dust2.new.map')</pre>


**Rendering Data**

As soon as information is retrieved we can draw it in the Game Board.

The first step is to draw the map image in the background:
<pre>context.drawImage(backgroundImage, 0, 0)</pre>


To my surprise the player itself isn't an asset (is not stored as an image), but it kinda makes sense as players in CSM are circles that move by the map. So instead CSM uses a different technique to draw the players, and uses geometrical shapes instead.

This is the relevant code when it comes to rendering each player:
<pre>context.arc(player.x, player.y, settings.PLAYER_RADIUS + 3, 2 * Math.PI, 0, false)</pre>

As you can see, we define the location (x, y) the player is placed and the radius (size) the player will fill.

Next step is to draw the field of view of the player (angle he's aiming at). Once again, some math is performed (this is the part I just copy) to define the field of view angle:
angle = -(player.viewAngle * Math.PI / 180);
context.arc(player.x, player.y, settings.FOV_RADIUS, angle - .25 * Math.PI, angle + .25 * Math.PI, false)

Vary player's body with their current life:
<pre>health = d + 2 * Math.PI / 100 * player.health
ctx.arc(player.x, player.y, settings.PLAYER_RADIUS, 1.5 * Math.PI, health, false)</pre>

There're still some necessary steps to draw the player (Painting as blue for Counter-Terrorist and red for Terrorists, setting FoV color, player name), but overall it's pretty simple processing.


**Animation Frame**

To perform an animation we need to render the board with updated information again and again. There are many techniques to solve this problem, CSM is using a basic setInterval loop that executes the "main" method.

The appropriate action here would be to use a requestAnimationFrame that executes both the "update" and "render" methods instead.


**Loading Game Information**

Now it comes the interesting part, to "update" the game objects this information has to come from somewhere. And each match in CSM is stored in a different file in the server.
When the game starts, this binary file is requested by the client and the "matchData" is set.

The game executes LoadingState.loadMatchData(), you can now access some information from your console (F12)
<pre>Number of rounds = game.getDataReader().rounds
Home Team Tactic Name = game.getDataReader().homeTacticName
Away Team Tactic Name = game.getDataReader().awayTacticName</pre>

This file also contains all game information (player positions and actions in each frame). This information is updated in each object and rerendered all the time (this is what produces 2D animation).

There's also another file that contains FOV information (if you can see both teams, or only yours), I'll not get into many details. But if you only have access to one team, a different file will be parsed from back-end filtering the points from the opponent (I tried it, for science). Not saying the system is bullet proof, but at least you can't see tactics from others.


**Quick Demo**

I made a small demo putting it all together, but instead you can control the player with WASD and the Field of View with the mouse. The actual function to defect collision was already implemented in their file (it's justed not used), I just did some changes to consider only 3px (they were considering 6px for some reason). 
From this demo it shouldn't be much harder to implement a HTML5 tactic editor version (considering the near function existed, maybe they already tried it and faced some issues), as this would be the obvious next step.
This is still interesting (imo) to detect "hard to spot" syncs in maps, have fun.

Link: [CSM Rendering Demo](https://lucasmedeiros-mdx.github.io/csm-render/)