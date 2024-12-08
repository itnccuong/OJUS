import prisma from "../prisma/client";
import fs from "fs";
import path from "path";

module.exports = async () => {
  console.log("Cleaning up resources...");
  // Example: Stop Docker containers, clean the database, etc.
  await prisma.$disconnect();
};
