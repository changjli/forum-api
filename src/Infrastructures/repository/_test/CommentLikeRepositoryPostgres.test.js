const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper");
const CommentLikeRepositoryPostgres = require("../CommentLikeRepositoryPostgres");

describe("CommentLikeRepositoryPostgres", () => {
  const repo = () => new CommentLikeRepositoryPostgres(pool, () => "xyz");

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: "user-1", username: "dicoding" });
  });

  beforeEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.addThread({ id: "thread-1", owner: "user-1" });
    await CommentsTableTestHelper.addComment({
      id: "comment-1",
      threadId: "thread-1",
      owner: "user-1",
    });
  });

  afterAll(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it("toggles like on/off", async () => {
    const out1 = await repo().toggleLike({
      commentId: "comment-1",
      userId: "user-1",
    });
    expect(out1.liked).toBe(true);
    const found1 = await CommentLikesTableTestHelper.findLike(
      "comment-1",
      "user-1"
    );
    expect(found1).toHaveLength(1);

    const out2 = await repo().toggleLike({
      commentId: "comment-1",
      userId: "user-1",
    });
    expect(out2.liked).toBe(false);
    const found2 = await CommentLikesTableTestHelper.findLike(
      "comment-1",
      "user-1"
    );
    expect(found2).toHaveLength(0);
  });

  it("returns counts map for multiple comment ids", async () => {
    await UsersTableTestHelper.addUser({ id: "u2", username: "john" });
    await CommentsTableTestHelper.addComment({
      id: "c1",
      threadId: "thread-1",
      owner: "user-1",
    });
    await CommentsTableTestHelper.addComment({
      id: "c2",
      threadId: "thread-1",
      owner: "user-1",
    });
    await CommentLikesTableTestHelper.addLike({
      id: "like-1",
      commentId: "c1",
      userId: "user-1",
    });
    await CommentLikesTableTestHelper.addLike({
      id: "like-2",
      commentId: "c1",
      userId: "u2",
    });
    await CommentLikesTableTestHelper.addLike({
      id: "like-3",
      commentId: "c2",
      userId: "user-1",
    });
    const map = await repo().getLikeCountsByCommentIds(["c1", "c2", "c3"]);
    expect(map.c1).toBe(2);
    expect(map.c2).toBe(1);
    expect(map.c3 ?? 0).toBe(0);
  });
});
