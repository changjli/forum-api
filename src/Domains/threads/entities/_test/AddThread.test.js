const AddThread = require("../AddThread");

describe("AddThread entities", () => {
  it("should throw error when payload is missing required properties", () => {
    // Arrange
    const payload = {
      title: "A Thread Title",
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload has invalid data types", () => {
    // Arrange
    const payload = {
      title: 123,
      body: "A Thread Body",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddThread object correctly", () => {
    // Arrange
    const payload = {
      title: "A Thread Title",
      body: "A Thread Body",
      owner: "user-123",
    };

    // Action
    const { title, body, owner } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
