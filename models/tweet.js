module.exports = (sequelize, DataTypes) => {
  /**
   * TWEET SCHEMA
   *
   * @property {string} text contains the text content of the tweet
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
   * @description
   * 1] M:1 relation -> many tweets can be created by 1 user.
   * 2] 1:N relation -> 1 tweet can be liked by many users.
   * 3] 1:N relation -> 1 tweet can be retweeted by many users.
   * 4] 1:N relation -> 1 tweet can have many comments.
   */
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User, {
      foreignKey: "tweeterId",
      onDelete: "CASCADE",
      as: "tweeter"
    });

    // 1:M relation -> 1 user can like many tweets
    Tweet.belongsToMany(models.User, {
      through: "Like",
      as: "likedBy",
      onDelete: "CASCADE"
    });

    // 1:M relation -> 1 user can retweet many tweets
    Tweet.belongsToMany(models.User, {
      through: "Retweet",
      as: "retweetedBy",
      onDelete: "CASCADE"
    });

    // 1:M relation -> 1 tweet can have many comments
    Tweet.hasMany(models.Comment, {
      onDelete: "CASCADE"
    });
  };

  return Tweet;
};
