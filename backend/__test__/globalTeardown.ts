import prisma from "../prisma/client";

module.exports = async () => {
  console.log("Cleaning up resources...");
  await prisma.$disconnect();
};
