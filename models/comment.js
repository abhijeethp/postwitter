module.exports = (sequelize, DataTypes) => {
  /**
   * COMMENT SCHEMA
   *
   * @property {string} text Contains the text content of the comment.
   */
  const Comment = sequelize.define(
    "Comment",
    {
      text: { type: DataTypes.STRING, allowNull: false }
    },
    {
      timestamps: true,
      updatedAt: false,
      underscored: true,
      hierarchy: true
    }
  );

  /**
   * ASSOCIATIONS
   *
   * @description
   * 1] 1:M relation -> 1 tweet can have many comments
   * 2] 1:M relation -> 1 user can make many comments
   */
  Comment.associate = function(models) {
    // 1:M relation -> 1 tweet can have many comments
    Comment.belongsTo(models.Tweet, {
      onDelete: "CASCADE"
    });

    // 1:M relation -> 1 user can make many comments
    Comment.belongsTo(models.User, {
      as: "commenter",
      foreignKey: "commenterId",
      onDelete: "CASCADE"
    });
  };

  return Comment;
};
