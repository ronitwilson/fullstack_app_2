Brainstorm
* backend side
    * token from cookie is recived ?
    * if cookie is signed correctly, reply with user name
* client side
    * get it and display logged in if correctly authorized

The problem was with set cookie at our backend
It was that the sameSite was not set, 
In pantaris case both the domain names are same

### can we configue it to allow only a specific hostname ?
Will cookie be used in IOT case ?



# My todo wishes
* configure nodemon to start backend
* implement the hashed password save in the mongo db
* check if there is a way to clear the mongo db table

# Missing knowledge
* How is the usestate method in the Usercontext working

# Next steps
* march 3  1.6.1 in video
    * further set the username and id in the user context
    * set login link


# Betterment thoughts
* app currently routes "/" to registerAndLogin router, want to refactor this

# march 12 next steps
* save ws in use state
* add event listner for message
* test using cooonection.send('hello')

# marck 16 next steps
* 18:08 -> show people in frontend
* 18:50 -> use avartar