import { DataTypes, Model } from "sequelize";
import { getConnection } from "../databaseManager";

/**
 * Model for the user table.
 */
class User extends Model {
  // Declare the properties of the model, do not initialize them here
  // See https://sequelize.org/docs/v6/core-concepts/model-basics/#caveat-with-public-class-fields
  declare id: number;
  declare name: string;
  declare pin: string;
  declare isAdmin: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\d{4,6}$/,
        msg: "Pin code must be 4 to 6 digits",
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: getConnection(),
    modelName: "User",
    tableName: "user",
    timestamps: false,
  }
);

export { User };
