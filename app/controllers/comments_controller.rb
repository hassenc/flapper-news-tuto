class CommentsController < ApplicationController

  skip_before_filter  :verify_authenticity_token

  respond_to :json

  def comment_params
    print "HC66"
    params.require(:comment).permit(:body, :author)
  end
  def create
    post = Post.find(params[:post_id])
    print "HC55 ------------------"
    print(comment_params)
    comment = post.comments.create(comment_params)
    print(comment)
    respond_with post, comment
  end

  def upvote
    post = Post.find(params[:post_id])
    comment = post.comments.find(params[:id])
    comment.increment!(:upvotes)

    respond_with post, comment
  end

  private
  def comment_params
    print "HC77"
    params.require(:comment).permit(:body, :author)
  end
end
