class AddAuthorToComment < ActiveRecord::Migration[5.0]
  def change
    add_column :comments, :author, :string
  end
end
