module.exports = (sequelize, DataTypes) => {
  /**
   * TWEET SCHEMA
   */
  const Tweet = sequelize.define(
    "Tweet",
    {
      text: { type: DataTypes.STRING, allowNull: false }
    },
    {
      timestamps: true,
      updatedAt: false,
      underscored: true
    }
  );

  /**
   * ASSOCIATIONS
   *
   * Adds M:1 relation between Tweet and User models.
   */
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User, {
      foreignKey: "tweeterId",
      onDelete: "CASCADE",
      as: "tweeter"
    });
  };

  return Tweet;
};
