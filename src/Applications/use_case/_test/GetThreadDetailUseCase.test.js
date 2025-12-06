const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const CommentLikeRepository = require("../../../Domains/commentLikes/CommentLikeRepository");

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
        likeCount: 2,
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
        likeCount: 0,
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
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockResolvedValue(mockThread);
    mockCommentRepository.findCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(mockComments);
    mockReplyRepository.findRepliesByCommentIds = jest
      .fn()
      .mockResolvedValue(mockReplies);
    mockCommentLikeRepository.getLikeCountsByCommentIds = jest
      .fn()
      .mockResolvedValue({ "comment-1": 2 });

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
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

  it("sorts comments by date ascending and replaces deleted comment content", async () => {
    // Arrange
    const threadId = "thread-xyz";
    const mockThread = {
      id: threadId,
      title: "Judul",
      body: "Isi",
      date: "2025-02-01T00:00:00.000Z",
      username: "tester",
    };

    // Intentionally unsorted by date (middle, latest, earliest)
    const mockComments = [
      {
        id: "comment-b",
        username: "user2",
        date: "2025-02-01T10:05:00.000Z",
        content: "B konten",
        is_delete: false,
      },
      {
        id: "comment-c",
        username: "user3",
        date: "2025-02-01T10:06:00.000Z",
        content: "C konten (akan dihapus)",
        is_delete: true,
      },
      {
        id: "comment-a",
        username: "user1",
        date: "2025-02-01T10:04:00.000Z",
        content: "A konten",
        is_delete: false,
      },
    ];

    const mockReplies = [];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockResolvedValue(mockThread);
    mockCommentRepository.findCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(mockComments);
    mockReplyRepository.findRepliesByCommentIds = jest
      .fn()
      .mockResolvedValue(mockReplies);
    mockCommentLikeRepository.getLikeCountsByCommentIds = jest
      .fn()
      .mockResolvedValue({});

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Act
    const result = await useCase.execute(threadId);

    // Assert sorting (expected order: a, b, c by date)
    const ids = result.thread.comments.map((c) => c.id);
    expect(ids).toEqual(["comment-a", "comment-b", "comment-c"]);
    // Assert deletion replacement on last comment
    const deletedComment = result.thread.comments.find(
      (c) => c.id === "comment-c"
    );
    expect(deletedComment.content).toBe("**komentar telah dihapus**");
    // Assert non-deleted untouched
    expect(result.thread.comments[0].content).toBe("A konten");
    expect(result.thread.comments[1].content).toBe("B konten");
    // Assert replies empty
    expect(result.thread.comments[0].replies).toEqual([]);
  });
});
