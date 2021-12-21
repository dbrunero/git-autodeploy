# Simple tool to autodeploy your project to your server




Requirements:

Basic knowledge about the concepts of servers/clients.
Basic knowledge about Node.js and Express.
Git.


In the /var/www/ directory on my server there are all the folders of the projects I want to autodepoly.
It is important (at least for theese young releases) that every project folder's name corresponds to the git-hub repository name of that project.

(I am Italian, I hope you will understand my spaghetti's English so I ask sorry, I could make some mistakes)




The concept:

Git-hub give us a very nice tool: Webhooks.
Webhooks are nothing else that a POST REQUEST to an endponint (we will decide which endpoint).
We will use the git-hub webhooks to POST an endpoint that we will create using express, once the POST is received node tells to the server what to do in relation with we want to do.


Note:
I use Telegraf (node package) to send to my telegram bot the status of the deploy.


PS:
Video will come soon.


