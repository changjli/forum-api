const AddComment = require("../../Domains/comments/entities/AddComment");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const newComment = new AddComment(payload);
    await this._threadRepository.checkThreadExistence(newComment.threadId);
    const stored = await this._commentRepository.addComment(newComment);
    // Normalize output to entity in case repository returns POJO
    return new AddedComment({
      id: stored.id,
      content: stored.content,
      owner: stored.owner,
    });
  }
}

module.exports = AddCommentUseCase;
