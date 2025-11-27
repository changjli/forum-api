const AddedReply = require("../AddedReply");

describe("AddedReply entity", () => {
  it("throws when required properties missing", () => {
    expect(() => new AddedReply({ id: "reply-1", content: "ok" })).toThrow(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws when types invalid", () => {
    expect(
      () => new AddedReply({ id: 5, content: "ok", owner: "user-1" })
    ).toThrow("ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("creates entity correctly", () => {
    const payload = { id: "reply-1", content: "ok", owner: "user-1" };
    const entity = new AddedReply(payload);
    expect(entity.id).toBe(payload.id);
    expect(entity.content).toBe(payload.content);
    expect(entity.owner).toBe(payload.owner);
  });
});
