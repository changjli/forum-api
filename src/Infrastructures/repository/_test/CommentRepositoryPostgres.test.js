const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  const fakeId = () => "abc";

  const repo = () => new CommentRepositoryPostgres(pool, fakeId);

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
    });
  });

  beforeEach(async () => {
    await RepliesTableTestHelper?.cleanTable?.(); // in case replies created elsewhere
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addComment", () => {
    it("persists and returns AddedComment", async () => {
      const comment = await repo().addComment({
        content: "isi komentar",
        threadId: "thread-123",
        owner: "user-123",
      });
      expect(comment).toBeInstanceOf(AddedComment);
      expect(comment.id).toEqual("comment-abc");
      expect(comment.content).toEqual("isi komentar");
      expect(comment.owner).toEqual("user-123");
    });
  });

  describe("verifyCommentExistence", () => {
    it("throws NotFoundError when comment absent", async () => {
      await expect(repo().verifyCommentExistence("comment-x")).rejects.toThrow(
        NotFoundError
      );
    });

    it("resolves when comment exists", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-1",
        threadId: "thread-123",
      });
      await expect(
        repo().verifyCommentExistence("comment-1")
      ).resolves.toBeUndefined();
    });
  });

  describe("verifyCommentOwner", () => {
    it("throws NotFoundError when comment missing", async () => {
      await expect(
        repo().verifyCommentOwner("comment-x", "user-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("throws AuthorizationError when owner mismatch", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-2",
        owner: "user-123",
      });
      await expect(
        repo().verifyCommentOwner("comment-2", "user-999")
      ).rejects.toThrow(AuthorizationError);
    });

    it("resolves when owner matches", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-3",
        owner: "user-123",
      });
      await expect(
        repo().verifyCommentOwner("comment-3", "user-123")
      ).resolves.toBeUndefined();
    });
  });

  describe("softDeleteComment", () => {
    it("marks is_delete true", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-4",
        isDelete: false,
      });
      await repo().softDeleteComment("comment-4");
      const { rows } = await pool.query(
        "SELECT is_delete FROM comments WHERE id = $1",
        ["comment-4"]
      );
      expect(rows[0].is_delete).toBe(true);
    });
  });

  describe("findCommentsByThreadId", () => {
    it("returns ordered comments with all fields", async () => {
      const d1 = new Date("2024-01-01T00:00:00Z");
      const d2 = new Date("2024-01-01T00:00:01Z");
      await CommentsTableTestHelper.addComment({
        id: "comment-a",
        date: d2,
        content: "two",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-b",
        date: d1,
        content: "one",
      });

      const rows = await repo().findCommentsByThreadId("thread-123");
      expect(rows).toHaveLength(2);
      expect(rows[0].id).toBe("comment-b");
      expect(rows[1].id).toBe("comment-a");
      expect(rows[0]).toHaveProperty("username");
      expect(rows[0]).toHaveProperty("is_delete");
    });

    it("returns empty array when no comments", async () => {
      const rows = await repo().findCommentsByThreadId("thread-123");
      expect(rows).toEqual([]);
    });
  });
});
