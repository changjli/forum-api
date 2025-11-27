const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("DeleteCommentUseCase", () => {
  it("orchestrates deleting a comment correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-xyz",
      commentId: "comment-123",
      owner: "user-abc",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExistence = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentExistence = jest
      .fn()
      .mockResolvedValue();
    mockCommentRepository.verifyCommentOwner = jest.fn().mockResolvedValue();
    mockCommentRepository.softDeleteComment = jest.fn().mockResolvedValue();

    const useCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    await useCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadExistence).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentExistence).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.softDeleteComment).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});
