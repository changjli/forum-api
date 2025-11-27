const DeleteReplyUseCase = require("../../replies/DeleteReplyUseCase");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");

describe("DeleteReplyUseCase", () => {
  it("orchestrates deleting a reply correctly", async () => {
    const payload = {
      commentId: "comment-123",
      replyId: "reply-987",
      owner: "user-xyz",
      threadId: "thread-123",
    };

    const mockReplyRepo = new ReplyRepository();
    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();

    mockThreadRepo.checkThreadExistence = jest.fn().mockResolvedValue();
    mockCommentRepo.verifyCommentExistence = jest.fn().mockResolvedValue();
    mockReplyRepo.verifyReplyExistence = jest.fn().mockResolvedValue();
    mockReplyRepo.verifyReplyOwner = jest.fn().mockResolvedValue();
    mockReplyRepo.softDeleteReply = jest.fn().mockResolvedValue();

    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepo,
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    await useCase.execute(payload);

    expect(mockCommentRepo.verifyCommentExistence).toBeCalledWith(
      payload.commentId
    );
    expect(mockReplyRepo.verifyReplyExistence).toBeCalledWith(payload.replyId);
    expect(mockReplyRepo.verifyReplyOwner).toBeCalledWith(
      payload.replyId,
      payload.owner
    );
    expect(mockReplyRepo.softDeleteReply).toBeCalledWith(payload.replyId);
    expect(mockThreadRepo.checkThreadExistence).toBeCalledWith(
      payload.threadId
    );
  });
});
