const createServer = require("../createServer");

describe("HTTP server", () => {
  it("should response 404 when request unregistered route", async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: "GET",
      url: "/unregisteredRoute",
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it("should handle server error correctly", async () => {
    // Arrange
    const requestPayload = {
      username: "dicoding",
      fullname: "Dicoding Indonesia",
      password: "super_secret",
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual("error");
    expect(responseJson.message).toEqual("terjadi kegagalan pada server kami");
  });

  it("should respond 401 Unauthorized when accessing protected route without token", async () => {
    // Arrange
    const server = await createServer({});

    // Action: hit a protected route without Authorization header
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: { title: "t", body: "b" },
    });

    // Assert: hapi native unauthorized response (not intercepted by onPreResponse)
    const json = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(401);
    expect(json.error).toEqual("Unauthorized");
    expect(json.message).toMatch(/Missing authentication|Unauthorized/);
  });

  it("should authenticate with valid JWT and map credentials via validate", async () => {
    // Arrange
    process.env.ACCESS_TOKEN_KEY = "test-secret-key";
    const Jwt = require("@hapi/jwt");
    const payload = { id: "user-xyz", username: "neo" };
    const token = Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
    // Fake container so handler succeeds without real use cases
    const AddThreadUseCase = require("../../../Applications/use_case/AddThreadUseCase");
    const ToggleCommentLikeUseCase = require("../../../Applications/use_case/ToggleCommentLikeUseCase");
    const fakeContainer = {
      getInstance: (key) => {
        if (key === AddThreadUseCase.name) {
          return {
            execute: async (data) => ({
              id: "thread-abc",
              title: data.title,
              body: data.body,
              owner: data.owner,
            }),
          };
        }
        if (key === ToggleCommentLikeUseCase.name) {
          return { execute: async () => {} };
        }
        return { execute: async () => {} };
      },
    };
    const server = await createServer(fakeContainer);

    // Act
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: { title: "Judul", body: "Isi" },
      headers: { Authorization: `Bearer ${token}` },
    });

    // Assert
    expect(response.statusCode).toBe(201); // authenticated & handler ran
    const json = JSON.parse(response.payload);
    expect(json.status).toBe("success");
    expect(json.data.addedThread.owner).toBe("user-xyz"); // owner taken from credentials
  });
});
