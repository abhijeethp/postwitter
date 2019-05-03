const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  /**
   * USER SCHEMA
   *
   * @property {string} email
   * @property {string} username
   * @property {string} displayName
   * @property {string} password
   *
   */
  const User = sequelize.define(
    "User",
    {
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      displayName: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  /**
   * ASSOCIATIONS
   *
   * @description
   * 1] N:M relation between User X (follower) and User Y (followed)
   * 2] 1:M relation -> 1 user can make multiple tweets
   * 3] 1:M relation -> 1 user can like multiple tweets
   * 4] 1:M relation -> 1 user can retweet multiple tweets
   */
  User.associate = function(models) {
    // 1:M relation -> 1 user can follow many users
    User.belongsToMany(models.User, {
      through: "Follow",
      as: "following",
      foreignKey: "followingId",
      updatedAt: false
    });

    // N:1 relation -> 1 user can be followed by many users
    User.belongsToMany(models.User, {
      through: "Follow",
      as: "followedBy",
      foreignKey: "followedById",
      updatedAt: false
    });

    // 1:M relation -> 1 user can post many tweets
    User.hasMany(models.Tweet, {
      foreignKey: "tweeterId",
      onDelete: "CASCADE"
    });

    // 1:M relation -> 1 user can like many tweets
    User.belongsToMany(models.Tweet, {
      through: "Like",
      as: "liked",
      onDelete: "CASCADE"
    });

    // 1:M relation -> 1 user can retweet many tweets
    User.belongsToMany(models.Tweet, {
      through: "Retweet",
      as: "retweeted",
      onDelete: "CASCADE"
    });
  };

  /**
   * Pre-hook for hashing password before persisting user in the database.
   */
  User.beforeCreate((user, options) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) return reject(err);
        user.password = hash;
        return resolve(user, options);
      });
    });
  });

  return User;
};
