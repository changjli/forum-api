class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.findThreadById(threadId);
    const comments = await this._commentRepository.findCommentsByThreadId(
      threadId
    );

    const commentIds = comments.map((c) => c.id);
    const replies = await this._replyRepository.findRepliesByCommentIds(
      commentIds
    );

    const groupedReplies = replies.reduce((acc, r) => {
      const arr = acc[r.comment_id] || [];
      arr.push({
        id: r.id,
        content: r.is_delete ? "**balasan telah dihapus**" : r.content,
        date: r.date,
        username: r.username,
      });
      acc[r.comment_id] = arr;
      return acc;
    }, {});

    const mappedComments = comments
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((c) => ({
        id: c.id,
        username: c.username,
        date: c.date,
        content: c.is_delete ? "**komentar telah dihapus**" : c.content,
        replies: (groupedReplies[c.id] || []).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ),
      }));

    return {
      thread: {
        id: thread.id,
        title: thread.title,
        body: thread.body,
        date: thread.date,
        username: thread.username,
        comments: mappedComments,
      },
    };
  }
}

module.exports = GetThreadDetailUseCase;
