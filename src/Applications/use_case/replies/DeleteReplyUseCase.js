class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ commentId, replyId, owner, threadId }) {
    await this._commentRepository.verifyCommentExistence(commentId);
    await this._threadRepository.checkThreadExistence(threadId);
    await this._replyRepository.verifyReplyExistence(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.softDeleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
