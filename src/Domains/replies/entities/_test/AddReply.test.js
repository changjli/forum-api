const AddReply = require("../AddReply");

describe("AddReply entity", () => {
  it("throws when required properties missing", () => {
    expect(() => new AddReply({ content: "hi" })).toThrow(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws when data types invalid", () => {
    expect(
      () =>
        new AddReply({
          content: 123,
          commentId: "comment-1",
          owner: "user-1",
          threadId: "thread-1",
        })
    ).toThrow("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("creates entity correctly", () => {
    const payload = {
      content: "reply content",
      commentId: "comment-1",
      owner: "user-1",
      threadId: "thread-1",
    };
    const reply = new AddReply(payload);
    expect(reply.content).toBe(payload.content);
    expect(reply.commentId).toBe(payload.commentId);
    expect(reply.owner).toBe(payload.owner);
    expect(reply.threadId).toBe(payload.threadId);
  });
});
