const AddThread = require("../../Domains/threads/entities/AddThread");
const AddedThread = require("../../Domains/threads/entities/AddedThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._repo = threadRepository;
  }

  async execute(payload) {
    const newThread = new AddThread(payload);
    const stored = await this._repo.addThread(newThread);
    return new AddedThread({
      id: stored.id,
      title: stored.title,
      owner: stored.owner,
    });
  }
}

module.exports = AddThreadUseCase;
