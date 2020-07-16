/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.language = 'zh-CN';
  config.extraPlugins = 'uploadimage,image2';
	// config.uiColor = '#AADC6E';
  config.toolbarCanCollapse = false;
  config.toolbar = 'Full';
  config.toolbar_Full = [
    ['Undo','Redo','Styles','Format','Font','FontSize', 'TextColor','BGColor'],
    ['Bold','Italic','Underline','Strike','-','Subscript','Superscript', 'NumberedList','BulletedList','-','Outdent','Indent', 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock', 'Link','Unlink', 'Image','Table','HorizontalRule','SpecialChar',]
    // ['Source','-','Save','NewPage','Preview','-','Templates', 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt', 'Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat', 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
    // ['Bold','Italic','Underline','Strike','-','Subscript','Superscript', 'NumberedList','BulletedList','-','Outdent','Indent','Blockquote', 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock', 'Link','Unlink','Anchor', 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak', 'Styles','Format','Font','FontSize', 'TextColor','BGColor']
  ];
  config.removePlugins = 'elementspath';
  // config.plugins =
  //   'about,' +
  //   'a11yhelp,' +
  //   'basicstyles,' +
  //   'bidi,' +
  //   'blockquote,' +
  //   'clipboard,' +
  //   'colorbutton,' +
  //   'colordialog,' +
  //   'copyformatting,' +
  //   'contextmenu,' +
  //   'dialogadvtab,' +
  //   'div,' +
  //   'elementspath,' +
  //   'enterkey,' +
  //   'entities,' +
  //   'filebrowser,' +
  //   'find,' +
  //   'flash,' +
  //   'floatingspace,' +
  //   'font,' +
  //   'format,' +
  //   'forms,' +
  //   'horizontalrule,' +
  //   'htmlwriter,' +
  //   'image,' +
  //   'iframe,' +
  //   'indentlist,' +
  //   'indentblock,' +
  //   'justify,' +
  //   'language,' +
  //   'link,' +
  //   'list,' +
  //   'liststyle,' +
  //   'magicline,' +
  //   'maximize,' +
  //   'newpage,' +
  //   'pagebreak,' +
  //   'pastefromword,' +
  //   'pastetext,' +
  //   'preview,' +
  //   'print,' +
  //   'removeformat,' +
  //   'resize,' +
  //   'save,' +
  //   'selectall,' +
  //   'showblocks,' +
  //   'showborders,' +
  //   'smiley,' +
  //   'sourcearea,' +
  //   'specialchar,' +
  //   'stylescombo,' +
  //   'tab,' +
  //   'table,' +
  //   'tableselection,' +
  //   'tabletools,' +
  //   'templates,' +
  //   'toolbar,' +
  //   'undo,' +
  //   'uploadimage,' +
  //   'wysiwygarea';
};
