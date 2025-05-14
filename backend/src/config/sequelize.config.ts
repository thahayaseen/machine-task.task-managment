import { Dialect } from "sequelize";
import { SequelizeOptions } from "sequelize-typescript";
interface DBConfig {
  [key: string]: SequelizeOptions;
}
const config: DBConfig = {
  development: {
    username: "myuser",
    password: "mypassword",
    database: "mydatabase",
    host: "localhost",
    dialect: "postgres" as Dialect,
  },
};
export default config