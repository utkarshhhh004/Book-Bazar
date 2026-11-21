
import mongoose from "mongoose";
import { env } from "./src/config/env.js";

const runTest = async () => {
    try {
        console.log("Testing API MongoDB configuration...");

        if (!env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from root .env");
        }

        // MongoDB URI ko standard URL parser se parse mat karo.
        // MongoDB multi-host connection strings comma-separated hoti hain.

        const uri = env.MONGODB_URI;
        const hostPart = uri.split("@").pop().split("/")[0];

        console.log("MongoDB Hosts:", hostPart);
        console.log("Database: bookbazar");
        console.log("Replica Set: atlas-g1dtte-shard-0");

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000
        });

        const hello = await mongoose.connection.db.admin().command({
            hello: 1
        });

        console.log("\nSUCCESS: API MongoDB connection works!");
        console.log("Database:", mongoose.connection.name);
        console.log("Replica Set:", hello.setName);
        console.log("Primary:", hello.isWritablePrimary);

    } catch (error) {
        console.error("\nCONNECTION FAILED:", error.message);
        console.error("Error Type:", error.name);

        if (error.reason?.servers) {
            for (const [address, server] of error.reason.servers) {
                console.log("Server:", address);
                console.log("Server Error:", server.error?.message);
            }
        }

        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

runTest();
