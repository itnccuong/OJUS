// import { cleanDatabase, insertUser } from "../test_utils";
// import { user, userToken } from "../test_data";
// import request from "supertest";
// import { app } from "../../src/app";
// import { STATUS_CODE } from "../../utils/constants";
// import {
//   ResponseInterfaceForTest,
//   UserWithAvatarInterface,
// } from "../../interfaces/interface";
// import path from "path";
// import { findUserById } from "../../services/user.services/user.services";
// import { findFileById } from "../../services/problem.services/judging.services";
// import axios from "axios";
// import { deleteFile } from "../../utils/fileUtilsDO";
// import { User } from "@prisma/client";
//
// const avatar = path.resolve(__dirname, "../../dataForTest/avatar.png");
//
// jest.setTimeout(60000);
//
// beforeEach(async () => {
//   await cleanDatabase();
//   await insertUser(user);
// });
//
// test("Get user", async () => {
//   const res = (await request(app)
//     .get("/api/user")
//     .set("Authorization", `Bearer ${userToken}`)) as ResponseInterfaceForTest<{
//     user: UserWithAvatarInterface;
//   }>;
//   expect(res.status).toBe(STATUS_CODE.SUCCESS);
//   const foundUser = res.body.data.user;
//   expect(foundUser.userId).toBe(user.userId);
// });
//
// test("Get user by name", async () => {
//   const res = (await request(app).get(
//     `/api/user/by-name/${user.username}`,
//   )) as ResponseInterfaceForTest<{ user: UserWithAvatarInterface }>;
//   expect(res.status).toBe(STATUS_CODE.SUCCESS);
//   const foundUser = res.body.data.user;
//   expect(foundUser.userId).toBe(user.userId);
// });
//
// test("Upload avatar", async () => {
//   const res = (await request(app)
//     .patch("/api/user/avatar")
//     .set("Authorization", `Bearer ${userToken}`)
//     .attach("file", avatar)) as ResponseInterfaceForTest<{
//     user: UserWithAvatarInterface;
//   }>;
//   expect(res.status).toBe(STATUS_CODE.SUCCESS);
//   const foundUser = await findUserById(res.body.data.user.userId);
//   expect(foundUser.avatarId).toBeTruthy();
//   const foundAvatar = await findFileById(foundUser.avatarId!);
//
//   expect(foundAvatar).toBeTruthy();
//   expect(foundAvatar.filename).toBe("avatar.png");
//   expect(foundAvatar.key).toBeTruthy();
//   const requestFileUrl = await axios.get(foundAvatar.url);
//   expect(requestFileUrl.status).toBe(STATUS_CODE.SUCCESS);
//   expect(foundAvatar.key).toBeTruthy();
//   await deleteFile(foundAvatar.key!);
// });
//
// test("Delete avatar", async () => {
//   const res = (await request(app)
//     .delete("/api/user/avatar")
//     .set("Authorization", `Bearer ${userToken}`)) as ResponseInterfaceForTest<{
//     user: User;
//   }>;
//   expect(res.status).toBe(STATUS_CODE.SUCCESS);
//   const foundUser = await findUserById(res.body.data.user.userId);
//   expect(foundUser.avatarId).toBeFalsy();
// });
