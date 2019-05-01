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
   */
  User.associate = function(models) {
    // TODO - DEFINE ASSOCIATIONS
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
