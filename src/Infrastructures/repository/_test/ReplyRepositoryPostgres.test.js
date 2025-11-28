const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("ReplyRepositoryPostgres", () => {
  const fakeId = () => "xyz";
  const repo = () => new ReplyRepositoryPostgres(pool, fakeId);

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
    });
  });

  beforeEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });
    await CommentsTableTestHelper.addComment({
      id: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addReply", () => {
    it("persists and returns AddedReply", async () => {
      const added = await repo().addReply({
        content: "balasan",
        commentId: "comment-123",
        owner: "user-123",
      });
      expect(added).toBeInstanceOf(AddedReply);
      expect(added.id).toBe("reply-xyz");
      expect(added.content).toBe("balasan");
    });
  });

  describe("verifyReplyExistence", () => {
    it("throws NotFoundError when not found", async () => {
      await expect(repo().verifyReplyExistence("reply-none")).rejects.toThrow(
        NotFoundError
      );
    });

    it("resolves when exists", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-1",
        commentId: "comment-123",
      });
      await expect(
        repo().verifyReplyExistence("reply-1")
      ).resolves.toBeUndefined();
    });
  });

  describe("verifyReplyOwner", () => {
    it("throws NotFoundError when missing", async () => {
      await expect(
        repo().verifyReplyOwner("reply-x", "user-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("throws AuthorizationError when owner mismatch", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-2",
        owner: "user-123",
      });
      await expect(
        repo().verifyReplyOwner("reply-2", "user-999")
      ).rejects.toThrow(AuthorizationError);
    });

    it("resolves when owner correct", async () => {
      await RepliesTableTestHelper.addReply({
        id: "reply-3",
        owner: "user-123",
      });
      await expect(
        repo().verifyReplyOwner("reply-3", "user-123")
      ).resolves.toBeUndefined();
    });
  });

  describe("softDeleteReply", () => {
    it("marks is_delete true", async () => {
      await RepliesTableTestHelper.addReply({ id: "reply-4", isDelete: false });
      await repo().softDeleteReply("reply-4");
      const rows = await RepliesTableTestHelper.findReplyById("reply-4");
      expect(rows[0].is_delete).toBe(true);
    });
  });

  describe("findRepliesByCommentIds", () => {
    it("returns empty when no ids", async () => {
      const rows = await repo().findRepliesByCommentIds([]);
      expect(rows).toEqual([]);
    });

    it("returns replies grouped by comment ids", async () => {
      const d1 = new Date("2024-01-01T00:00:00Z");
      const d2 = new Date("2024-01-01T00:00:01Z");
      await RepliesTableTestHelper.addReply({ id: "reply-a", date: d2 });
      await RepliesTableTestHelper.addReply({
        id: "reply-b",
        date: d1,
        content: "earlier",
      });

      const rows = await repo().findRepliesByCommentIds(["comment-123"]);
      expect(rows).toHaveLength(2);
      expect(rows[0].id).toBe("reply-b");
      expect(rows[1].id).toBe("reply-a");
      expect(rows[0]).toHaveProperty("username");
      expect(rows[0]).toHaveProperty("is_delete");
    });
  });
});
