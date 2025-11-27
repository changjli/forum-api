const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("throws on unimplemented methods", async () => {
    const repo = new CommentRepository();
    await expect(repo.addComment({})).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.verifyCommentExistence("")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.verifyCommentOwner("", "")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.softDeleteComment("")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.findCommentsByThreadId("")).rejects.toThrow(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
