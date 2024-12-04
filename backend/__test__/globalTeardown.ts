import prisma from "../prisma/client";

module.exports = async () => {
  console.log("Cleaning up resources...");
  // Example: Stop Docker containers, clean the database, etc.
  await prisma.$disconnect();
};
