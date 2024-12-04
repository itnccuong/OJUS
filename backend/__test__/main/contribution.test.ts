import { beforeEach, describe, expect, test } from "@jest/globals";
import { app } from "../../src/app";
import request from "supertest";
import jwt from "jsonwebtoken";
import path from "path";
import {
  ContributionListResponseInterface,
  ContributionResponseInterface,
  GetOneProblemInterface,
  ResponseInterfaceForTest,
  SuccessResponseInterface,
} from "../../interfaces/api-interface";
import prisma from "../../prisma/client";
import { cleanDatabase } from "../test_utils";
import * as util from "node:util";
import { exec } from "child_process";

const filePath = path.resolve(__dirname, "../../temp/testcases.zip");

let fake_token = "";

const execPromise = util.promisify(exec);
beforeEach(async () => {
  await cleanDatabase();
  await execPromise("ts-node prisma/seed.ts");

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

describe("Get contributions", () => {
  test("Get all contributions", async () => {
    const res = (await request(app)
      .get("/api/contributions")
      .set(
        "Authorization",
        `Bearer ${fake_token}`,
      )) as ResponseInterfaceForTest<
      SuccessResponseInterface<ContributionListResponseInterface>
    >;
    expect(res.status).toBe(200);
    const contributions = res.body.data.contributions;
    expect(contributions.length).toBeGreaterThan(0);
    contributions.map((contribution) => {
      expect(contribution.status).toBe(0);
    });
  });

  test("Get one contribution", async () => {
    const res = (await request(app)
      .get("/api/contributions/1")
      .set(
        "Authorization",
        `Bearer ${fake_token}`,
      )) as ResponseInterfaceForTest<
      SuccessResponseInterface<ContributionResponseInterface>
    >;
    const contribution = res.body.data.contribution;
    expect(res.status).toBe(200);
    expect(contribution.problemId).toBe(1);
    expect(contribution.status).toBe(0);
  });
});

describe("Admin Contribution Actions", () => {
  test("Accept a contribution", async () => {
    const res = (await request(app)
      .put("/api/contributions/1/accept")
      .set(
        "Authorization",
        `Bearer ${fake_token}`,
      )) as ResponseInterfaceForTest<
      SuccessResponseInterface<ContributionResponseInterface>
    >;

    expect(res.status).toBe(200);
    expect(res.body.data.contribution.status).toBe(2);

    // Verify the contribution status is updated
    const problemRes = (await request(app).get(
      "/api/problems/no-account/1",
    )) as ResponseInterfaceForTest<
      SuccessResponseInterface<GetOneProblemInterface>
    >;
    const problem = problemRes.body.data.problem;
    expect(problem.status).toBe(2);
  });

  test("Reject a contribution", async () => {
    const res = (await request(app)
      .put("/api/contributions/1/reject")
      .set(
        "Authorization",
        `Bearer ${fake_token}`,
      )) as ResponseInterfaceForTest<
      SuccessResponseInterface<ContributionResponseInterface>
    >;

    expect(res.status).toBe(200);
    expect(res.body.data.contribution.status).toBe(1);

    // Verify the contribution status is updated
    const problemRes = (await request(app).get(
      "/api/problems/no-account/1",
    )) as ResponseInterfaceForTest<
      SuccessResponseInterface<GetOneProblemInterface>
    >;
    const problem = problemRes.body.data.problem;
    expect(problem.status).toBe(1);
  });
});
