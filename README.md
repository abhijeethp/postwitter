# POSTWITTER - TWITTER CLONE

> ## FUNCTIONALITIES

#### Basic Functionality

- User registration using unique username and a password.
- User login including session maintenance.

#### Extended Functionality

- Follow / unfollow.
- Create / read / delete tweet.
- Unit / Integration tests for basic and extended functionality endpoints.

#### Extra Credit

- Like / unlike a tweet.
- Retweet / unretweet.
- Replies and threading.

> ## RUNNING THE APPLICATION

### Requirements

- node 10.15.3+
- npm 6.9.0+
- MySQL 5.6+

### development workflow

```
> git clone https://github.com/rkinabhi/postwitter.git
> cd postwitter
> npm install
```

#### running the server

1. Create an empty database with name **postwitter** in MySQL.
2. Go inside root directory of the project.
3. Set database credentials for "**[development](https://github.com/rkinabhi/postwitter/blob/master/config/database_config.json#L2)**]" in **[config/database_config.json](https://github.com/rkinabhi/postwitter/blob/master/config/database_config.json)**.
4. `> npm start`

#### running tests

1. Create an empty database with name **postwitter_test** in MySQL.
2. Go inside root directory of the project.
3. Set database credentials for "**[test](https://github.com/rkinabhi/postwitter/blob/master/config/database_config.json#L10)**" in **[config/database_config.json](https://github.com/rkinabhi/postwitter/blob/master/config/database_config.json)**
4. `> npm test`
