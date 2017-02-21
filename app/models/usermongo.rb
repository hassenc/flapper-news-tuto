class Usermongo
  include Mongoid::Document

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

 ## Database authenticatable
 field :email,              :type => String, :default => ""
 field :encrypted_password, :type => String, :default => ""
 field :current_sign_in_at, :type => String, :default => ""
 field :current_sign_in_ip, :type => String, :default => ""
 field :last_sign_in_ip, :type => String, :default => ""
 field :last_sign_in_at, :type => String, :default => ""
 field :sign_in_count, :type => Integer, :default => ""
 field :remember_created_at, :type => Integer, :default => ""
end
