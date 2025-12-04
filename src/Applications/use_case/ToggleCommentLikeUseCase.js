class ToggleCommentLikeUseCase {
  constructor({ commentRepository, threadRepository, commentLikeRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.checkThreadExistence(threadId);
    await this._commentRepository.verifyCommentExistence(commentId);
    await this._commentLikeRepository.toggleLike({ commentId, userId });
  }
}

module.exports = ToggleCommentLikeUseCase;
