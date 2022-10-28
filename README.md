# Run Bash Commands From Node

## General Information

This app created to run bash commands from NodeJS with API calls and log each command, time, userId and runTime to a log file.

The project has a simple Register/Login infrastructure, you must use Tokens for the commands you send to work.

Used Winston to log user actions and Command actions.

## Technology

You can examine the packages used in the package.json file.

## Setup

If you want to customize the settings, such as jwt secret or port, you can fix them in src/config/index.js.

Installing with NPM or Yarn:
```
$ cd ../node-run-bash-commands
$ npm install
$ npm start
```

```
$ cd ../node-run-bash-commands
$ yarn
$ yarn start
```

## How will you use the API ?

You can find the Postman file in the project : "NodeRunBashCommands.postman_collection.json"

`Default values were used for Host : 127.0.0.1 and Port : 8686`
`You can change it according to your own project.`

Test user information is as follows ;

```
{
    "username" : "gokhan"
    "password" : "123456"
}
```

### User Register

`Method : POST`

`URL : http://127.0.0.1:8686/user/register/`

```
// Request
{
    "username" : "test"
    "password" : "test1234" //Must be a minimum of 6 characters
}
```

```
// Response
{
    "status": true,
    "msg": "User registered successfully"
}
```

### User Login

`Method : POST`

`URL : http://127.0.0.1:8686/user/login/`

```
// Request
{
    "username" : "test"
    "password" : "test1234"
}
```

```
// Response
{
    "status": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." //This token is required for you to run commands
}
```

### Command Run

You have to send Bearer Token in Headers field but using "Authorization".

`Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -> Token`

`Method : POST`

`URL : http://127.0.0.1:8686/command/run/`

```
// Request
{
    "command" : "echo 'Hello World!'" //example : "ls -la"
}
```

```
// Response
{
    "status": true,
    "msg": "Command executed successfully",
    "data": "Hello World!\n"
}
```

You can block certain commands if you want for security purposes. You can change it from the 'unauthorizedCommands' or 'authorizedCommands' definition in the 'config/index.js' file.

```
//Disabling commands
unauthorizedCommands : {
    status : true, // True : Active, False : Passive
    command : ['rm', 'mkdir', 'cp', 'mv', 'ssh']
}
```

```
//Allow only certain commands
authorizedCommands : {
    status : false,
    command : ['ls']
}
```