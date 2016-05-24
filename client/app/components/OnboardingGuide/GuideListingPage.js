import { PropTypes } from 'react';
import r, { div, h2, p, img, a, i } from 'r-dom';
import css from './OnboardingGuide.css';
import { Routes } from '../../utils/routes';
import { t } from '../../utils/i18n';

import GuideBackToTodoLink from './GuideBackToTodoLink';

const GuideListingPage = (props) => {
  const { changePage, pageData, infoIcon } = props;

  return div({ className: 'container' }, [
    r(GuideBackToTodoLink, { changePage }),
    h2({ className: css.title }, t('web.admin.onboarding.guide.listing.title')),
    p({ className: css.description }, t('web.admin.onboarding.guide.listing.description')),

    pageData.info_image ?
      div({ className: css.sloganImageContainerBig }, [
        img({
          className: css.sloganImage,
          src: pageData.info_image,
          alt: t('web.admin.onboarding.guide.listing.info_image_alt'),
        }),
      ]) :
      null,

    div({ className: css.infoTextContainer }, [
      div({
        className: css.infoTextIcon,
        dangerouslySetInnerHTML: { __html: infoIcon }, // eslint-disable-line react/no-danger
      }),
      div({ className: css.infoTextContent },
          t('web.admin.onboarding.guide.listing.advice.content', { close_listing: i(t('web.admin.onboarding.guide.listing.advice.close_listing')) })),
    ]),

    a({ className: css.nextButton, href: Routes.new_listing_path() }, t('web.admin.onboarding.guide.listing.post_your_first_listing')),
  ]);
};

GuideListingPage.propTypes = {
  changePage: PropTypes.func.isRequired,
  infoIcon: PropTypes.string.isRequired,
  pageData: PropTypes.shape({
    info_image: PropTypes.string,
  }).isRequired,
};

export default GuideListingPage;
