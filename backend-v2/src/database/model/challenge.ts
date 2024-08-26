import { DataTypes, Model } from "sequelize";
import { getConnection } from "../databaseManager";

/**
 * Model for the challenges table.
 */
class Challenge extends Model {
  // Declare the properties of the model, do not initialize them here
  // See https://sequelize.org/docs/v6/core-concepts/model-basics/#caveat-with-public-class-fields
  declare id: number;
  declare question: string;
  declare maxScore: number;
}

Challenge.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxScore: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: "max_score",
    },
  },
  {
    sequelize: getConnection(),
    modelName: "Challenge",
    tableName: "challenge",
    timestamps: false,
  }
);

export { Challenge };
