const AddedComment = require("../AddedComment");

describe("AddedComment entity", () => {
  it("throws when required properties missing", () => {
    expect(() => new AddedComment({ id: "comment-1", content: "abc" })).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws when data types invalid", () => {
    expect(
      () => new AddedComment({ id: 99, content: "abc", owner: "user-1" })
    ).toThrow("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("creates entity correctly", () => {
    const payload = { id: "comment-1", content: "abc", owner: "user-1" };
    const entity = new AddedComment(payload);
    expect(entity.id).toEqual(payload.id);
    expect(entity.content).toEqual(payload.content);
    expect(entity.owner).toEqual(payload.owner);
  });
});
