import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dialect = process.env.DB_DIALECT || (process.env.DATABASE_URL ? "postgres" : "mysql");

const commonOptions = {
    dialect,
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
};

if (dialect === "postgres") {
    commonOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, commonOptions)
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            ...commonOptions,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        }
    )
export const connection = async ()=>{
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
        return {sucess: true, message: "Database connected successfully"};

    }
    catch(e){
        console.error("Error connecting to the database:", e);
        return {sucess: false, message: "Error connecting to the database"};
    }
}

export default sequelize;
