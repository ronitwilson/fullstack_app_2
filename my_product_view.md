# 23 march
## current status 
User registration

User can login

there is ui page to choose user 

there is a page/form ui to enter chat message

we can read that message

we send message from backend to the requested user

## what is needed
send that message through web socket to the right user id
send the msg and userid to backend,  in backend fwd message to the right guy


display sender(self) messages and reciver messages in the ui

what is needed to init the messages from the db
readFromDb function 
get the array
send it through rest api
populate the state variable

readFromDb function 
get token from the req header

# make a auto reconnect function

# show offline people
* make the dot with the green
* make a route to get all users 
* filter out self user and online users
* make a dot with grey for offline users