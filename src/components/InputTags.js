import React from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import '../styles/InputTags.scss';

class InputTags extends React.Component {
  render() {
    return (
      <div className="input-tags">
        <Tags
          {...this.props}
        />
      </div>
    );
  }
}

export default InputTags;
