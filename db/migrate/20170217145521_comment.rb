class Comment < ActiveRecord::Migration[5.0]
  def change
    t.string :author
  end
end
