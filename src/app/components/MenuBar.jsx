"use client";
import React from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-menu-bar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`formatting-button ${editor.isActive('bold') ? 'is-active' : ''}`}
        title="Bold"
      >
        <span className="button-text">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`formatting-button ${editor.isActive('italic') ? 'is-active' : ''}`}
        title="Italic"
      >
        <span className="button-text italic">I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`formatting-button ${editor.isActive('underline') ? 'is-active' : ''}`}
        title="Underline"
      >
        <span className="button-text">U</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`formatting-button strike-button ${editor.isActive('strike') ? 'is-active' : ''}`}
        title="Strikethrough"
      >
        <span className="button-text">S</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`formatting-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        title="Bullet List"
      >
        <span className="bullet-list-icon">≡</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`formatting-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
        title="Numbered List"
      >
        <span className="ordered-list-icon">⒈</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleLink().run()}
        className={`formatting-button ${editor.isActive('link') ? 'is-active' : ''}`}
        title="Link"
      >
        <span className="link-icon">🔗</span>
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="formatting-button"
        title="Undo"
      >
        <span className="undo-icon">↺</span>
      </button>
    </div>
  );
};

export default MenuBar;