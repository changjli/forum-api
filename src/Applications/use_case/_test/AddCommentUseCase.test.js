const AddCommentUseCase = require("../AddCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");

describe("AddCommentUseCase", () => {
  it("orchestrates adding a comment correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "Isi komentar",
      threadId: "thread-xyz",
      owner: "user-abc",
    };

    const mockAddedComment = new AddedComment({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExistence = jest.fn().mockResolvedValue();
    mockCommentRepository.addComment = jest
      .fn()
      .mockResolvedValue(mockAddedComment);

    const useCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    const result = await useCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(
      new AddedComment({
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.checkThreadExistence).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: useCasePayload.content,
        threadId: useCasePayload.threadId,
        owner: useCasePayload.owner,
      })
    );
  });
});
