import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        dialect: "mysql",
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
