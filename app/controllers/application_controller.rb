class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception
  
  def index
    respond_to :json
  end

  def angular
    render 'layouts/application'
  end
end
