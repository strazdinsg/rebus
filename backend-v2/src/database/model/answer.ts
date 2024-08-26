import { DataTypes, Model } from "sequelize";
import { getConnection } from "../databaseManager";
import { Challenge } from "./challenge";
import { User } from "./user";

/**
 * Model for the answers table.
 */
class Answer extends Model {
  // Declare the properties of the model, do not initialize them here
  // See https://sequelize.org/docs/v6/core-concepts/model-basics/#caveat-with-public-class-fields
  declare id: number;
  declare userId: number;
  declare challengeId: number;
  declare answer: string;
  declare score: number;
  declare imageUrl: string;
}

Answer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "challenge_id",
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image_url",
    },
  },
  {
    sequelize: getConnection(),
    modelName: "Answer",
    tableName: "answer",
    timestamps: false,
  }
);

// Foreign key relationships
Challenge.hasMany(Answer, {
  foreignKey: "challengeId",
});
User.hasMany(Answer, {
  foreignKey: "userId",
});

export { Answer };
