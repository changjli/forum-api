const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("throws on unimplemented methods", async () => {
    const repo = new ReplyRepository();
    await expect(repo.addReply({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.verifyReplyExistence("")).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.verifyReplyOwner("", "")).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.softDeleteReply("")).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(repo.findRepliesByCommentIds([])).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
