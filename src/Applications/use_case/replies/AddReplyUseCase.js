const AddReply = require("../../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const addReply = new AddReply(payload);
    await this._threadRepository.checkThreadExistence(addReply.threadId);
    await this._commentRepository.verifyCommentExistence(addReply.commentId);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
