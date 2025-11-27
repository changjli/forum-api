const AddComment = require("../AddComment");

describe("AddComment entity", () => {
  it("throws when required properties missing", () => {
    expect(() => new AddComment({ content: "hi" })).toThrow(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws when data types invalid", () => {
    const payload = { content: 123, threadId: "thread-1", owner: "user-1" };
    expect(() => new AddComment(payload)).toThrow(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("creates entity correctly", () => {
    const payload = {
      content: "hello world",
      threadId: "thread-1",
      owner: "user-1",
    };
    const entity = new AddComment(payload);
    expect(entity.content).toEqual(payload.content);
    expect(entity.threadId).toEqual(payload.threadId);
    expect(entity.owner).toEqual(payload.owner);
  });
});
