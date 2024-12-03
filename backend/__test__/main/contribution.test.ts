import { describe, expect, test } from "@jest/globals";
import { app } from "../../src/app";
import request from "supertest";
import jwt from "jsonwebtoken";
import path from "path";
import {
  ContributionResponseInterface,
  ResponseInterfaceForTest,
  SuccessResponseInterface,
} from "../../interfaces/api-interface";
import { Problem } from "@prisma/client";
import prisma from "../../prisma/client";

const filePath = path.resolve(__dirname, "../../temp/testcases.zip");

let fake_token = "";
beforeAll(async () => {
  fake_token = jwt.sign(
    { userId: 1 }, // Payload
    process.env.JWT_SECRET as string, // Secret
    { expiresIn: "3m" }, // Token expiration
  );
});

describe("Contribute", () => {
  test("Contribute", async () => {
    const res = (await request(app)
      .post("/api/contributions")
      .set("Authorization", `Bearer ${fake_token}`)
      .field("title", "Contribution Title")
      .field("description", "Contribution Description")
      .field("difficulty", "2")
      .field("tags", "ok")
      .field("timeLimit", "1000")
      .field("memoryLimit", "1000")
      .attach("file", filePath)
      .set("Content-Type", "multipart/form-data")) as ResponseInterfaceForTest<
      SuccessResponseInterface<ContributionResponseInterface>
    >;
    expect(res.status).toBe(201);
    expect(res.body.data.contribution.title).toBe("Contribution Title");
    expect(res.body.data.contribution.status).toBe(0);
    expect(res.body.data.contribution.authorId).toBe(1);

    const file = await prisma.files.findFirst({
      where: { fileId: res.body.data.contribution.fileId },
    });
    expect(file).toBeTruthy();
    if (file) {
      expect(file.filename).toContain("Contribution_Title");
      expect(file.fileType).toContain("zip");
      expect(file.location).toBeTruthy();
    }
  });
});
