import { Component, PropTypes } from 'react';
import { form, input, button } from 'r-dom';

const SEARCH_MODE_KEYWORD = 'keyword';
const SEARCH_MODE_LOCATION = 'location';
const SEARCH_MODE_KEYWORD_AND_LOCATION = 'keyword-and-location';
const SEARCH_MODES = [
  SEARCH_MODE_KEYWORD,
  SEARCH_MODE_LOCATION,
  SEARCH_MODE_KEYWORD_AND_LOCATION,
];

const searchInput = (placeholder) => input({
  type: 'search',
  placeholder,
});

class SearchBar extends Component {
  render() {
    const { mode } = this.props;
    const inputs = [];

    // TODO: translations
    if (mode === SEARCH_MODE_KEYWORD || mode === SEARCH_MODE_KEYWORD_AND_LOCATION) {
      inputs.push(searchInput('Search...'));
    }
    if (mode === SEARCH_MODE_LOCATION || mode === SEARCH_MODE_KEYWORD_AND_LOCATION) {
      inputs.push(searchInput('Location'));
    }
    return form({}, [...inputs, button({ type: 'submit' })]);
  }
}

SearchBar.propTypes = {
  mode: PropTypes.oneOf(SEARCH_MODES).isRequired,
};

export default SearchBar;
