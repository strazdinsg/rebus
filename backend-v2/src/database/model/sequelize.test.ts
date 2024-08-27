import { beforeAll, describe, expect, it } from "vitest";
import { getConnection } from "../databaseManager";
import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

// Just some PoC code to test TypeScript integration and associations for Sequelize
// See https://sequelize.org/docs/v6/other-topics/typescript/
class Ship extends Model<InferAttributes<Ship>, InferCreationAttributes<Ship>> {
  declare name: string;
  declare crewCapacity: number;
  declare amountOfSails: number;
  declare captainId: ForeignKey<Captain["id"]>;
}

Ship.init(
  {
    name: DataTypes.TEXT,
    crewCapacity: DataTypes.INTEGER,
    amountOfSails: DataTypes.INTEGER,
  },
  {
    sequelize: getConnection(),
    timestamps: false,
  }
);

class Captain extends Model<
  InferAttributes<Captain>,
  InferCreationAttributes<Captain>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare skillLevel: number;
  declare getShip: HasOneGetAssociationMixin<Ship>;
  declare createShip: HasManyCreateAssociationMixin<Ship, "captainId">;
}

Captain.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: DataTypes.TEXT,
    skillLevel: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 10 },
    },
  },
  {
    sequelize: getConnection(),
    timestamps: false,
  }
);

Captain.hasOne(Ship);
Ship.belongsTo(Captain);

describe("Sequelize tests", () => {
  beforeAll(async () => {
    await Captain.sync();
    await Ship.sync();

    const captain = await Captain.create({
      name: "Jack Sparrow",
      skillLevel: 10,
    });

    await captain.createShip({
      name: "Titanic",
      crewCapacity: 1000,
      amountOfSails: 40,
    });
  });

  it("Get associated ship", async () => {
    const awesomeCaptain = await Captain.findOne({
      where: {
        name: "Jack Sparrow",
      },
    });
    if (awesomeCaptain === null) {
      throw new Error("Captain not found");
    }
    const hisShip = await awesomeCaptain.getShip();
    expect(hisShip.name).toBe("Titanic");
    expect(hisShip.crewCapacity).toBe(1000);
    expect(hisShip.amountOfSails).toBe(40);
  });
});
