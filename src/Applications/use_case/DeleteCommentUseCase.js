class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.checkThreadExistence(threadId);
    await this._commentRepository.verifyCommentExistence(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.softDeleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
