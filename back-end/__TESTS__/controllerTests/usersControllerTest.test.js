const request = require("supertest");
const app = require("../../index");
const jwt = require("jsonwebtoken");
const { db, closeDb } = require("../../db/dbConfig");

describe("User API Endpoints", () => {
  let token;
  const JSK = process.env.JWT_SECRET;

  const testUserData = {
    profileimg: "https://picsum.photos/200",
    username: "test1",
    password: "test1",
    email: "test1@test.com",
  };

  const testUserData2 = {
    id: "0f098045-9e14-4ca9-943b-d948e50d1232",
    profileimg: "https://picsum.photos/200",
    username: "test2",
    password: "test2",
    email: "test2@test.com",
  };

  beforeAll(async () => {
    const clientTokenPayload = {
      user: testUserData2,
      scopes: ["read:user", "write:user"],
    };

    token = jwt.sign(clientTokenPayload, JSK, {
      expiresIn: "1h",
    });

    await db.none("TRUNCATE users RESTART IDENTITY CASCADE");
  });

  test("GET /users - Get all users", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    console.log("TEST-GET /users response:", res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.payload)).toBeTruthy();
  });

  test("POST /users/signup - Create a new user", async () => {
    const res = await request(app).post("/users/signup").send(testUserData2);

    console.log("TEST-POST /users/signup response:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.payload).toHaveProperty("username", "test2");
    expect(res.body).toHaveProperty("token");
  });

  // test("POST /users/signin - Sign in a user", async () => {
  //   const res = await request(app).post("/users/signin").send({
  //     email: "test1@test.com",
  //     password: "test1",
  //   });

  //   console.log("TEST-POST /users/signin response:", res.body);

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty("token");
  // });

  test("PUT /users/update - Update user info", async () => {
    const updatedUserData = {
      username: "test11",
      email: "test11@test.com",
    };
    const res = await request(app)
      .put("/users/update")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedUserData);

    const decoded = jwt.decode(token);
    console.log({ token, decoded });
    console.log("TEST-PUT /users/update response:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.payload).toHaveProperty("username", "test11");
  });

  // test("DELETE /users/delete - Delete user", async () => {
  //   const res = await request(app)
  //     .delete("/users/delete")
  //     .set("Authorization", `Bearer ${token}`);

  //   console.log("TEST-DELETE /users/delete response:", res.body);

  //   expect(res.statusCode).toBe(200);
  // });

  afterAll(() => {
    closeDb();
  });
});
