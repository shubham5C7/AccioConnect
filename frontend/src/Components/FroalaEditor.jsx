import React from 'react';
import FroalaEditorComponent from "react-froala-wysiwyg";
import 'froala-editor/css/froala_editor.pkgd.min.css';// Core Froala CSS
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/plugins/emoticons.min.css';// Plugin CSS
import 'froala-editor/js/plugins/emoticons.min.js';// Plugin JS - Required for emojis to work!
import 'froala-editor/js/plugins/char_counter.min.js';
import { useSelector } from 'react-redux';
import {froalaConfig} from '../constants'

const FroalaEditor = ({ postData, setPostData }) => {

  const isDark = useSelector((state)=>state.theme.isDark)
  const handleModelChange = (model) => {
    setPostData({
      ...postData,
      content: model
    });
  };

  return (
   <div className={`froala-editor-container ${isDark ? "dark" : "light"}`}>
      <FroalaEditorComponent 
        tag='textarea'
        config={froalaConfig}
        model={postData.content}
        onModelChange={handleModelChange}
      />
    </div>
  );
};

export default FroalaEditor;