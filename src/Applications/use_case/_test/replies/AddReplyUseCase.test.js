const AddReplyUseCase = require("../../replies/AddReplyUseCase");
const ReplyRepository = require("../../../../Domains/replies/ReplyRepository");
const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const AddReply = require("../../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../../Domains/replies/entities/AddedReply");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");

describe("AddReplyUseCase", () => {
  it("orchestrates adding reply correctly", async () => {
    const payload = {
      content: "sebuah balasan",
      commentId: "comment-123",
      owner: "user-xyz",
      threadId: "thread-123",
    };

    const mockAddedReply = new AddedReply({
      id: "reply-555",
      content: payload.content,
      owner: payload.owner,
    });

    const expectedAddedReply = new AddedReply({
      id: "reply-555",
      content: payload.content,
      owner: payload.owner,
    });

    const mockReplyRepo = new ReplyRepository();
    const mockCommentRepo = new CommentRepository();
    const mockThreadRepo = new ThreadRepository();

    mockThreadRepo.checkThreadExistence = jest.fn().mockResolvedValue();
    mockCommentRepo.verifyCommentExistence = jest.fn().mockResolvedValue();
    mockReplyRepo.addReply = jest.fn().mockResolvedValue(mockAddedReply);

    const useCase = new AddReplyUseCase({
      replyRepository: mockReplyRepo,
      commentRepository: mockCommentRepo,
      threadRepository: mockThreadRepo,
    });

    const result = await useCase.execute(payload);

    expect(result).toStrictEqual(expectedAddedReply);
    expect(mockCommentRepo.verifyCommentExistence).toBeCalledWith(
      payload.commentId
    );
    expect(mockReplyRepo.addReply).toBeCalledWith(new AddReply(payload));
    expect(mockThreadRepo.checkThreadExistence).toBeCalledWith(
      payload.threadId
    );
  });
});
