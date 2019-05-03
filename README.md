# POSTWITTER

## TWITTER CLONE - POSTMAN ASSIGNMENT

### FUNCTIONALITIES

#### Basic Functionality

- User registration using unique username and a password
- User login Including session maintenance

#### Extended Functionality

- Follow, unfollow
- Create, read, delete tweet
- Unit/Integration tests for _all_ endpoints

#### Extra Credit

- Like/unlike a tweet
- Retweet
- Replies and threading

### RUNNING APPLICATION

### Requirements

- node
- npm
- mysql 5.6+

### development workflow

- git clone **repolink**
- cd postwitter
- npm install

#### run server

- create database 'postwitter'
- set database credentials for development in config/database_config.json
- npm start

#### running tests

- create database 'postwitter_test'
- set database credentials for test in config/database_config.json
- npm test
