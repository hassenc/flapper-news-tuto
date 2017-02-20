require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module FlapperNews
  class Application < Rails::Application

    config.to_prepare do
      DeviseController.respond_to :html, :json
    end

    config.assets.enabled = false

    config.assets.paths << Rails.root.join("app", "assets", "fonts")
    config.assets.precompile += %w(*.svg *.woff *.woff2 *.ttf *.png *.jpg *.jpeg *.gif)
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
