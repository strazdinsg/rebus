import {
  DataTypes,
  ForeignKey,
  HasOneGetAssociationMixin,
  Model,
} from "sequelize";
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
  declare userId: ForeignKey<User["id"]>;
  declare challengeId: ForeignKey<Challenge["id"]>;
  declare answer: string;
  declare score: number;
  declare imageUrl: string;
  declare getChallenge: HasOneGetAssociationMixin<Challenge>;
  declare getUser: HasOneGetAssociationMixin<User>;
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
      references: {
        model: User,
        key: "id",
      },
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "challenge_id",
      references: {
        model: Challenge,
        key: "id",
      },
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
Answer.belongsTo(Challenge, {
  foreignKey: {
    name: "challengeId",
    allowNull: false,
  },
});

User.hasMany(Answer, {
  foreignKey: "userId",
});
Answer.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
});

export { Answer };
