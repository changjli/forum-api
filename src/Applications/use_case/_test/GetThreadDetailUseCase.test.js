const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("GetThreadDetailUseCase", () => {
  it("orchestrates fetching thread detail including replies correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const mockThread = {
      id: threadId,
      title: "Judul",
      body: "Isi",
      date: "2025-01-01T10:00:00.000Z",
      username: "nicholas",
    };

    const mockComments = [
      {
        id: "comment-1",
        username: "userA",
        date: "2025-01-01T10:10:00.000Z",
        content: "Komentar A",
        is_delete: false,
      },
      {
        id: "comment-2",
        username: "userB",
        date: "2025-01-01T10:12:00.000Z",
        content: "Komentar B",
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: "reply-1",
        comment_id: "comment-1",
        username: "userC",
        date: "2025-01-01T10:11:00.000Z",
        content: "Balasan 1",
        is_delete: false,
      },
      {
        id: "reply-2",
        comment_id: "comment-1",
        username: "userD",
        date: "2025-01-01T10:11:30.000Z",
        content: "Balasan 2 (deleted)",
        is_delete: true,
      },
      {
        id: "reply-3",
        comment_id: "comment-2",
        username: "userE",
        date: "2025-01-01T10:13:00.000Z",
        content: "Balasan untuk komentar terhapus",
        is_delete: false,
      },
    ];

    const expectedComments = [
      {
        id: "comment-1",
        username: "userA",
        date: "2025-01-01T10:10:00.000Z",
        content: "Komentar A",
        replies: [
          {
            id: "reply-1",
            username: "userC",
            date: "2025-01-01T10:11:00.000Z",
            content: "Balasan 1",
          },
          {
            id: "reply-2",
            username: "userD",
            date: "2025-01-01T10:11:30.000Z",
            content: "**balasan telah dihapus**",
          },
        ],
      },
      {
        id: "comment-2",
        username: "userB",
        date: "2025-01-01T10:12:00.000Z",
        content: "**komentar telah dihapus**",
        replies: [
          {
            id: "reply-3",
            username: "userE",
            date: "2025-01-01T10:13:00.000Z",
            content: "Balasan untuk komentar terhapus",
          },
        ],
      },
    ];

    const expectedThread = {
      thread: {
        id: threadId,
        title: "Judul",
        body: "Isi",
        date: "2025-01-01T10:00:00.000Z",
        username: "nicholas",
        comments: expectedComments,
      },
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockResolvedValue(mockThread);
    mockCommentRepository.findCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(mockComments);
    mockReplyRepository.findRepliesByCommentIds = jest
      .fn()
      .mockResolvedValue(mockReplies);

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const result = await useCase.execute(threadId);

    // Assert
    expect(result).toStrictEqual(expectedThread);
    expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.findCommentsByThreadId).toBeCalledWith(
      threadId
    );
    expect(mockReplyRepository.findRepliesByCommentIds).toBeCalledWith([
      "comment-1",
      "comment-2",
    ]);
  });
});
