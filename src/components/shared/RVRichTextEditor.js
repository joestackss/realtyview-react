import React from 'react';
import classNames from 'classnames';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import '../../styles/shared/RVRichTextEditor.scss';

// Check https://jpuri.github.io/react-draft-wysiwyg/#/docs for more options.
const DEFAULT_TOOLBAR_OPTIONS = {
  options: ['inline', 'list', 'link'],
  inline: {
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
  link: {
    options: ['link', 'unlink'],
  }
}

class RVRichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    const editorState = (
      props.value ? 
      EditorState.createWithContent(
        convertFromRaw(markdownToDraft(props.value))
      ) :
      EditorState.createEmpty()
    );
    this.state = { editorState };
  }

  // componentDidMount() {
  //   if (this.props.value) {
  //     const contentState = convertFromRaw(markdownToDraft(this.props.value));
  //     this.setState({ editorState: EditorState.createWithContent(contentState)});
  //   }
  // }

  handleEditorStateChange = (editorState) => {
    const { onChange } = this.props;
    if (onChange) onChange(draftToMarkdown(convertToRaw(editorState.getCurrentContent())));
    this.setState({ editorState });
  }

  render() {
    const { toolbarClassName, editorClassName, wrapperClassName, onChange, value, ...props } = this.props;
    const { editorState } = this.state;
    return (
      <Editor 
        toolbar={DEFAULT_TOOLBAR_OPTIONS}
        stripPastedStyles
        spellCheck
        {...props}
        toolbarClassName={classNames(toolbarClassName, 'rv-rteditor-toolbar')}
        editorClassName={classNames(editorClassName, 'rv-rteditor-editor')}
        wrapperClassName={classNames(wrapperClassName, 'rv-rteditor-wrapper')}
        editorState={editorState}
        onEditorStateChange={this.handleEditorStateChange}
      />
    );
  }
}

export default RVRichTextEditor;