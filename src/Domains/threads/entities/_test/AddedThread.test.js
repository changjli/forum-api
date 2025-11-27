const AddedThread = require("../AddedThread");

describe("AddedThread entities", () => {
  it("should throw error when payload is missing required properties", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A Thread Title",
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload has invalid data types", () => {
    // Arrange
    const payload = {
      id: 123,
      title: "A Thread Title",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A Thread Title",
      owner: "user-123",
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
