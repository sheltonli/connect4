Shelton Li 999009905
William Armstrong 993418789

Note: Our game works for a single player but only part of it works for network play.  We've left in the buggy code so you can see where we got to.
If you want to see it work single player, please comment out these lines 116-119 in board.js and lines 40-47 in board.php (the view). 

We managed to send pieces to the other player, however there is something wrong with it since the same player can receive a duplicate message.
We have not been able to handle turns.

When a player wins their status is updated in the database. When a player ties it is updated in the database.


The amazingly awesome board we made using THREE.js
To make this work each column is clickable.  The pieces are only added when it makes sense.
The white balls change colour once you click a column to give the illusion of a piece being dropped.
If there are four pieces in a row, guess what .. ? you win!! and the board spins around and the pieces flash different colours!! yeah!


Our implementation makes use of CodeIgniter, AJAX, JSON, JQuery, CSS and MySql.  We used THREE.js to make the board.
The Captcha was implemented for users when registering.
Our site has been checked on CDF.  It works in it's buggy fashion ... thanks for your time in marking it!
