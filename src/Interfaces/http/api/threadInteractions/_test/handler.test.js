const ThreadInteractionsHandler = require("../handler");
const AddThreadUseCase = require("../../../../../Applications/use_case/AddThreadUseCase");
const AddCommentUseCase = require("../../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../../Applications/use_case/DeleteCommentUseCase");
const AddReplyUseCase = require("../../../../../Applications/use_case/replies/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../../Applications/use_case/replies/DeleteReplyUseCase");
const GetThreadDetailUseCase = require("../../../../../Applications/use_case/GetThreadDetailUseCase");

describe("ThreadInteractionsHandler", () => {
  const makeH = () => ({
    response: (obj) => {
      const res = { ...obj };
      res.code = (status) => {
        res.statusCode = status;
      };
      return res;
    },
  });

  const makeContainer = () => {
    const fns = {
      [AddThreadUseCase.name]: jest.fn().mockResolvedValue({
        id: "thread-1",
        title: "Title",
        body: "Body",
        owner: "user-1",
      }),
      [AddCommentUseCase.name]: jest.fn().mockResolvedValue({
        id: "comment-1",
        content: "Comment",
        owner: "user-1",
      }),
      [DeleteCommentUseCase.name]: jest.fn().mockResolvedValue(),
      [AddReplyUseCase.name]: jest.fn().mockResolvedValue({
        id: "reply-1",
        content: "Reply",
        owner: "user-1",
      }),
      [DeleteReplyUseCase.name]: jest.fn().mockResolvedValue(),
      [GetThreadDetailUseCase.name]: jest
        .fn()
        .mockResolvedValue({ thread: { id: "thread-1" } }),
    };
    return {
      fns,
      getInstance: (name) => ({ execute: fns[name] }),
    };
  };

  it("postThreadHandler maps payload & owner and returns 201", async () => {
    const container = makeContainer();
    const handler = new ThreadInteractionsHandler(container);
    const request = {
      payload: { title: "Title", body: "Body" },
      auth: { credentials: { id: "user-1" } },
    };
    const h = makeH();
    const res = await handler.postThreadHandler(request, h);
    expect(container.fns[AddThreadUseCase.name]).toHaveBeenCalledWith({
      title: "Title",
      body: "Body",
      owner: "user-1",
    });
    expect(res.statusCode).toBe(201);
    expect(res.data.addedThread.owner).toBe("user-1");
  });

  it("postCommentHandler maps payload & owner and returns 201", async () => {
    const container = makeContainer();
    const handler = new ThreadInteractionsHandler(container);
    const request = {
      payload: { content: "Comment" },
      params: { threadId: "thread-1" },
      auth: { credentials: { id: "user-1" } },
    };
    const h = makeH();
    const res = await handler.postCommentHandler(request, h);
    expect(container.fns[AddCommentUseCase.name]).toHaveBeenCalledWith({
      content: "Comment",
      threadId: "thread-1",
      owner: "user-1",
    });
    expect(res.statusCode).toBe(201);
    expect(res.data.addedComment.id).toBe("comment-1");
  });

  it("deleteCommentHandler passes identifiers & owner", async () => {
    const container = makeContainer();
    const handler = new ThreadInteractionsHandler(container);
    const request = {
      params: { threadId: "thread-1", commentId: "comment-1" },
      auth: { credentials: { id: "user-1" } },
    };
    const res = await handler.deleteCommentHandler(request);
    expect(container.fns[DeleteCommentUseCase.name]).toHaveBeenCalledWith({
      threadId: "thread-1",
      commentId: "comment-1",
      owner: "user-1",
    });
    expect(res).toEqual({ status: "success" });
  });

  it("postReplyHandler maps payload & owner and returns 201", async () => {
    const container = makeContainer();
    const handler = new ThreadInteractionsHandler(container);
    const request = {
      payload: { content: "Reply" },
      params: { threadId: "thread-1", commentId: "comment-1" },
      auth: { credentials: { id: "user-1" } },
    };
    const h = makeH();
    const res = await handler.postReplyHandler(request, h);
    expect(container.fns[AddReplyUseCase.name]).toHaveBeenCalledWith({
      content: "Reply",
      threadId: "thread-1",
      commentId: "comment-1",
      owner: "user-1",
    });
    expect(res.statusCode).toBe(201);
    expect(res.data.addedReply.id).toBe("reply-1");
  });

  it("deleteReplyHandler passes identifiers & owner", async () => {
    const container = makeContainer();
    const handler = new ThreadInteractionsHandler(container);
    const request = {
      params: {
        threadId: "thread-1",
        commentId: "comment-1",
        replyId: "reply-1",
      },
      auth: { credentials: { id: "user-1" } },
    };
    const res = await handler.deleteReplyHandler(request);
    expect(container.fns[DeleteReplyUseCase.name]).toHaveBeenCalledWith({
      threadId: "thread-1",
      commentId: "comment-1",
      replyId: "reply-1",
      owner: "user-1",
    });
    expect(res).toEqual({ status: "success" });
  });

  it("getThreadDetailHandler returns thread detail wrapper", async () => {
    const container = makeContainer();
    const handler = new ThreadInteractionsHandler(container);
    const request = { params: { threadId: "thread-1" } };
    const res = await handler.getThreadDetailHandler(request);
    expect(container.fns[GetThreadDetailUseCase.name]).toHaveBeenCalledWith(
      "thread-1"
    );
    expect(res.status).toBe("success");
    expect(res.data.thread).toEqual({ id: "thread-1" });
  });
});
