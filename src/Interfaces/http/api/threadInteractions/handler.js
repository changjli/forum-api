const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const AddReplyUseCase = require("../../../../Applications/use_case/replies/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/replies/DeleteReplyUseCase");
const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");
const ToggleCommentLikeUseCase = require("../../../../Applications/use_case/ToggleCommentLikeUseCase");

class ThreadInteractionsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const payload = {
      title: request.payload.title,
      body: request.payload.body,
      owner: request.auth?.credentials?.id,
    };
    const addedThread = await addThreadUseCase.execute(payload);
    const response = h.response({ status: "success", data: { addedThread } });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const payload = {
      content: request.payload.content,
      threadId: request.params.threadId,
      owner: request.auth?.credentials?.id,
    };
    const addedComment = await addCommentUseCase.execute(payload);
    const response = h.response({ status: "success", data: { addedComment } });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const payload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth?.credentials?.id,
    };
    await deleteCommentUseCase.execute(payload);
    return { status: "success" };
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const payload = {
      content: request.payload.content,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth?.credentials?.id,
    };
    const addedReply = await addReplyUseCase.execute(payload);
    const response = h.response({ status: "success", data: { addedReply } });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    const payload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      replyId: request.params.replyId,
      owner: request.auth?.credentials?.id,
    };
    await deleteReplyUseCase.execute(payload);
    return { status: "success" };
  }

  async putCommentLikeHandler(request) {
    const useCase = this._container.getInstance(ToggleCommentLikeUseCase.name);
    const payload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      userId: request.auth?.credentials?.id,
    };
    await useCase.execute(payload);
    return { status: "success" };
  }

  async getThreadDetailHandler(request) {
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    );
    const threadId = request.params.threadId;
    const threadDetail = await getThreadDetailUseCase.execute(threadId);
    return {
      status: "success",
      data: threadDetail,
    };
  }
}

module.exports = ThreadInteractionsHandler;
