const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  const fakeId = () => "xyz";

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-abc",
      username: "dicoding",
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addThread", () => {
    it("persists and returns AddedThread entity", async () => {
      const repo = new ThreadRepositoryPostgres(pool, fakeId);
      const added = await repo.addThread({
        title: "Judul",
        body: "Isi",
        owner: "user-abc",
      });

      expect(added.id).toBe("thread-xyz");
      expect(added.title).toBe("Judul");
      expect(added.owner).toBe("user-abc");

      const row = await repo.findThreadById("thread-xyz");
      expect(row).toBeDefined();
      expect(row.title).toBe("Judul");
    });
  });

  describe("checkThreadExistence", () => {
    it("throws NotFoundError when thread absent", async () => {
      const repo = new ThreadRepositoryPostgres(pool, fakeId);
      await expect(repo.checkThreadExistence("thread-missing")).rejects.toThrow(
        NotFoundError
      );
    });

    it("does not throw when thread exists", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-xyz",
        title: "Ada",
        body: "Isi",
        owner: "user-abc",
      });
      const repo = new ThreadRepositoryPostgres(pool, fakeId);
      await expect(
        repo.checkThreadExistence("thread-xyz")
      ).resolves.not.toThrow();
    });
  });

  describe("findThreadById", () => {
    it("returns thread row with username", async () => {
      await ThreadsTableTestHelper.addThread({
        id: "thread-xyz",
        title: "Judul",
        body: "Konten",
        owner: "user-abc",
      });
      const repo = new ThreadRepositoryPostgres(pool, fakeId);
      const thread = await repo.findThreadById("thread-xyz");
      expect(thread.id).toBe("thread-xyz");
      expect(thread.title).toBe("Judul");
      expect(thread.body).toBe("Konten");
      expect(thread.username).toBe("dicoding");
      expect(thread.date).toBeDefined();
    });

    it("throws NotFoundError if not found", async () => {
      const repo = new ThreadRepositoryPostgres(pool, fakeId);
      await expect(repo.findThreadById("thread-none")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
