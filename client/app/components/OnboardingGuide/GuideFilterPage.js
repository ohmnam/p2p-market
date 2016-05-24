import { PropTypes } from 'react';
import r, { div, h2, p, img, a, i } from 'r-dom';
import css from './OnboardingGuide.css';
import { t } from '../../utils/i18n';

import GuideBackToTodoLink from './GuideBackToTodoLink';

const GuideFilterPage = (props) => {
  const { changePage, pageData, infoIcon } = props;

  return div({ className: 'container' }, [
    r(GuideBackToTodoLink, { changePage }),
    h2({ className: css.title }, t('web.admin.onboarding.guide.filter.title')),
    p({ className: css.description }, [
      t('web.admin.onboarding.guide.filter.description.content',
          { display_on_homepage: i(t('web.admin.onboarding.guide.filter.description.display_on_homepage')) }),
    ]),

    pageData.info_image ?
      div({ className: css.sloganImageContainerBig }, [
        img({
          className: css.sloganImage,
          src: pageData.info_image,
          alt: t('web.admin.onboarding.guide.filter.info_image_alt'),
        }),
      ]) :
      null,

    div({ className: css.infoTextContainer }, [
      div({
        className: css.infoTextIcon,
        dangerouslySetInnerHTML: { __html: infoIcon }, // eslint-disable-line react/no-danger
      }),
      div({
        className: css.infoTextContent }, [
          t('web.admin.onboarding.guide.filter.advice.content',
            { not_too_many_link: a({
              target: '_blank',
              rel: 'noreferrer',
              href: 'https://www.sharetribe.com/academy/how-to-help-your-customers-find-the-right-product-or-service',
            }, t('web.admin.onboarding.guide.filter.advice.not_too_many_link')) }),
        ]),
    ]),

    a({ className: css.nextButton, href: pageData.cta }, t('web.admin.onboarding.guide.filter.add_fields_and_filters')),
  ]);
};

GuideFilterPage.propTypes = {
  changePage: PropTypes.func.isRequired,
  infoIcon: PropTypes.string.isRequired,
  pageData: PropTypes.shape({
    cta: PropTypes.string.isRequired,
    info_image: PropTypes.string,
  }).isRequired,
};

export default GuideFilterPage;
