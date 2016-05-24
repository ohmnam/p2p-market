import { storiesOf } from '@kadira/storybook';
import withProps from '../Styleguide/withProps';

import SearchBar from './SearchBar';

storiesOf('Top bar search')
  .add('keyword', () =>
       withProps(SearchBar, { mode: 'keyword' }))
  .add('location', () =>
       withProps(SearchBar, { mode: 'location' }))
  .add('keyword and location', () =>
       withProps(SearchBar, { mode: 'keyword-and-location' }));
