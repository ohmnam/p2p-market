require_relative './common.rb'

class JsRoutes
  class Middleware

    DEFAULT_ROUTE_FILES = [Rails.root.join("config/routes.rb")]

    class << self

      attr_writer :route_files

      def route_files
        @route_files ||= DEFAULT_ROUTE_FILES
      end

    end

    def initialize(app)
      @app = app
      clear_cache
    end

    def call(env)
      @cache = nil
      verify_route_files!(self.class.route_files)
      @app.call(env)
    end

    private

    def cache_path
      @cache_path ||= cache_dir.join("routes.yml")
    end

    def cache_dir
      @cache_dir ||= Rails.root.join("tmp/cache")
    end

    def cache
      @cache ||= begin
        if cache_path.exist?
          YAML.load_file(cache_path) || {}
        else
          {}
        end
      end
    end

    def clear_cache
      File.delete(cache_path) if File.exist?(cache_path)
    end

    def save_cache(new_cache)
      # path could be a symbolic link
      FileUtils.mkdir_p(cache_dir) unless File.exists?(cache_dir)
      File.open(cache_path, "w+") do |file|
        file << new_cache.to_yaml
      end
    end

    # Check if routes.js should be regenerated.
    # ONLY REGENERATE when these conditions are met:
    #
    # # Cache file doesn't exist
    # # Route files and cache size are different (files were removed/added)
    # # Routes file has been updated
    #
    def verify_route_files!(route_files)
      valid_cache = []
      new_cache = {}

      valid_cache.push cache_path.exist?
      valid_cache.push route_files.uniq.size == cache.size

      route_files.each do |path|
        changed_at = File.mtime(path).to_i
        valid_cache.push changed_at == cache[path]
        new_cache[path] = changed_at
      end

      return if valid_cache.all?

      binding.pry

      save_cache(new_cache)

      JsRoutes.generate!
    end
  end
end


Kassi::Application.configure do
  APP_CONFIG ||= ConfigLoader.load_app_config

  # Settings specified here will take precedence over those in config/environment.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false

  # To autoload MailPreview, uncomment this line
  # (this is a hack which is fixed properly in Rails 4)
  # config.action_view.cache_template_loading = false

  config.log_level = :debug

  # Basic log config, for calls to Rails.logger.<level> { <message> }
  config.logger = ::Logger.new(STDOUT)
  # Formats log entries into: LEVEL MESSAGE
  # Heroku adds to this timestamp and worker/dyno id, so datetime can be stripped
  config.logger.formatter = ->(severity, datetime, progname, msg) { "#{severity} #{msg}\n" }

  # Lograge config, overrides default instrumentation for logging ActionController and ActionView logging
  config.lograge.enabled = true
  config.lograge.custom_options = ->(event) {
    params = event.payload[:params].except('controller', 'action')

    { params: params,
      host: event.payload[:host],
      community_id: event.payload[:community_id],
      current_user_id: event.payload[:current_user_id],
      request_uuid: event.payload[:request_uuid] }
  }

  config.lograge.formatter = Lograge::Formatters::Json.new

  config.after_initialize do
    ActiveRecord::Base.logger = Rails.logger.clone
    ActiveRecord::Base.logger.level = Logger::DEBUG
    ActionMailer::Base.logger = Rails.logger.clone
    ActionMailer::Base.logger.level = Logger::INFO
  end



  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  config.action_controller.action_on_unpermitted_parameters = :raise

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  if APP_CONFIG.mail_delivery_method == "sendmail"
    ActionMailer::Base.delivery_method = :sendmail
  elsif APP_CONFIG.mail_delivery_method == "smtp"
    # Enable sending mail from localhost
    ActionMailer::Base.smtp_settings = {
      :address              => APP_CONFIG.smtp_email_address,
      :port                 => APP_CONFIG.smtp_email_port,
      :domain               => APP_CONFIG.smtp_email_domain || 'localhost',
      :user_name            => APP_CONFIG.smtp_email_user_name,
      :password             => APP_CONFIG.smtp_email_password,
      :authentication       => 'plain',
      :enable_starttls_auto => true
    }
  end


  # Expands the lines which load the assets
  config.assets.debug = false

  # Raise exception on mass assignment protection for Active Record models
  config.active_record.mass_assignment_sanitizer = :strict

  config.cache_store = :memory_store, { :namespace => "sharetribe-dev"}

  config.middleware.use JsRoutes::Middleware
end
