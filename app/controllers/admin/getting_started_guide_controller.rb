class Admin::GettingStartedGuideController < ApplicationController

  before_filter :ensure_is_admin

  rescue_from ReactOnRails::PrerenderError do |err|
    Rails.logger.error(err.message)
    Rails.logger.error(err.backtrace.join("\n"))
    redirect_to root_path, flash: { error: I18n.t('error_messages.onboarding.server_rendering') }
  end

  def index
    render locals: { props: data }
  end

  private

  def data
    listing_shape_name = ListingService::API::Api.shapes.get(community_id: @current_community.id).data.first[:name]

    onboarding_status = Admin::OnboardingWizard.new(@current_community.id).setup_status
    links = {
      slogan_and_description: {
        sub_path: 'slogan_and_description',
        cta: edit_details_admin_community_path(@current_community),
        info_image: view_context.image_path('onboarding/step2_sloganDescription.jpg')
      },
      cover_photo: {
        sub_path: 'cover_photo',
        cta: edit_look_and_feel_admin_community_path(@current_community),
        info_image: view_context.image_path('onboarding/step3_coverPhoto.jpg')
      },
      filter: {
        sub_path: 'filter',
        info_image: view_context.image_path('onboarding/step4_fieldsFilters.jpg')
      },
      paypal: {
        sub_path: 'paypal',
        info_image: view_context.image_path('onboarding/step5_screenshot_paypal@2x.png'),
        additional_info: {
          listing_shape_name: listing_shape_name
        }
      },
      listing: {
        sub_path: 'listing',
        info_image: view_context.image_path('onboarding/step6_addListing.jpg')
      },
      invitation: {
        sub_path: 'invitation',
        info_image: view_context.image_path('onboarding/step7_screenshot_share@2x.png')
      }
    }

    sorted_steps = OnboardingViewUtils.sorted_steps_with_includes(onboarding_status, links)

    # This is the props used by the React component.
    { onboarding_guide_page: {
        onboarding_data: sorted_steps,
        name: PersonViewUtils.person_display_name(@current_user, @current_community),
        info_icon: icon_tag("information"),
      }
    }
  end
end
