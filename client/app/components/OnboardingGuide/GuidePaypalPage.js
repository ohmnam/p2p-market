import { PropTypes } from 'react';
import r, { div, h2, p, img, a, span } from 'r-dom';
import css from './OnboardingGuide.css';
import { t } from '../../utils/i18n';
import { Routes } from '../../utils/routes';

import GuideBackToTodoLink from './GuideBackToTodoLink';

const GuidePaypalPage = (props) => {
  const { changePage, pageData, infoIcon } = props;

  return div({ className: 'container' }, [
    r(GuideBackToTodoLink, { changePage }),
    h2({ className: css.title }, t('web.admin.onboarding.guide.paypal.title')),
    p({ className: css.description }, t('web.admin.onboarding.guide.paypal.description_p1')),
    p({ className: css.description }, t('web.admin.onboarding.guide.paypal.description_p2')),

    pageData.info_image ?
      div({ className: css.sloganImageContainer }, [
        img({
          className: css.sloganImage,
          src: pageData.info_image,
          alt: t('web.admin.onboarding.guide.paypal.info_image_alt'),
        }),
      ]) :
      null,

    div({ className: css.infoTextContainer }, [
      div({
        className: css.infoTextIcon,
        dangerouslySetInnerHTML: { __html: infoIcon }, // eslint-disable-line react/no-danger
      }),
      div({ className: css.infoTextContent }, t('web.admin.onboarding.guide.paypal.advice.content', {
        disable_payments_link: a(
          { href: 'http://support.sharetribe.com/knowledgebase/articles/470085',
            target: '_blank',
            rel: 'noreferrer',
            alt: t('web.admin.onboarding.guide.paypal.advice.disable_payments_alt'),
          },
          t('web.admin.onboarding.guide.paypal.advice.disable_payments_link')),
      })),
    ]),

    div(null, [
      a({ className: css.nextButton, href: Routes.admin_paypal_preferences_path() }, t('web.admin.onboarding.guide.paypal.setup_payments')),
      span({ className: css.buttonSeparator }, t('web.admin.onboarding.guide.paypal.cta_separator')),
      a({ className: css.nextButtonGhost, href: Routes.edit_admin_listing_shape_path(pageData.additional_info.listing_shape_name) }, t('web.admin.onboarding.guide.paypal.disable_payments')),
    ]),
  ]);
};

const { func, string, shape } = PropTypes;

GuidePaypalPage.propTypes = {
  changePage: func.isRequired,
  infoIcon: string.isRequired,
  pageData: shape({
    info_image: string,
    additional_info: shape({
      listing_shape_name: string,
    })
  }).isRequired,
};

export default GuidePaypalPage;
