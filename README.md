# Summarizer

## What it Does
Summarizer is an application that will take the current news article that you are currently looking at and after clicking the chrome extension, will summarize the article into 5 concisces sentences. It also stores the previous analyzed articles and can acess them by merely clicking on the button below. 

##How I made it
I first started with the google template for chrome extensions. This was my first time writing javascript and my first time building a chrome extension so using the google documentaiton helped alot! 
###Libraries and API's
For libraries and api's i used the textTeaser api. TextTeaser is a natural language processing api that can summarize web pages so I acessed the api and used it for the meat of my application. I also used Materialize.css as the css framework for my project as I needed a quick and easy way to style it and Mateiralize fit that description perfectly.

##Screenshots of the app Working
![myimage-alt-tag](images/first.jpg)
![myimage-alt-tag](images/second.jpg)
![myimage-alt-tag](images/third.jpg)

##Problems, Pitfalls, and Progress
Most of my problems revolved around acessing the api and using that data correctly. After i had figured out how to actually call the api I was not able to correctly display the data. After a lot of debugging I had finally figured out that it was due to the asychronous nature of javascript. This being my first language that I have worked with that was asynchronous, I was confused but also intrigued. I learned more about the best practices for how to work with asynchronous languages and mangaged to finally figure it out! 

