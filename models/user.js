var bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  /**
   * USER SCHEMA
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
   * 1] N:M relation between User X (follower) and User Y (followed)
   * 2] 1:M relation between User and Tweet
   */
  User.associate = function(models) {
    // 1:M relation -> 1 user can follow many users
    User.belongsToMany(models.User, {
      through: "Following",
      as: "follower",
      foreignKey: "followerId",
      updatedAt: false
    });

    // N:1 relation -> 1 user can be followed by many users
    User.belongsToMany(models.User, {
      through: "Following",
      as: "followed",
      foreignKey: "followedId",
      updatedAt: false
    });

    // 1:M relation -> 1 user can post many tweets
    User.hasMany(models.Tweet, {
      foreignKey: "tweeterId",
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
