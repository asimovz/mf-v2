import { Drag } from './drag';
import * as domUtils from '../utils/dom-utils';
// import _ from 'lodash'
import moqui from '@/assets/js/moquiLibs'
// 

//解析参数
function parseOptions(binding, vnode) {
  const options = binding.value || {};
  if (moqui.isEmpty(options)) {
    options.drag = vnode.data.attrs.drag;
    options.modal = vnode.data.attrs.modal;
    options.escClose = vnode.data.attrs['esc-close'];
  }
  if (options.modal !== false)
    options.modal = true;
  return options;
}

function handleEscClose(options, vnode) {
  document.removeEventListener('keydown', vnode.componentInstance.EscClose);
  if (options.escClose) {
    document.addEventListener('keydown', vnode.componentInstance.EscClose);
  }
}

function handleModal(isModal, $el) {
  let mainEl = $el.querySelector('.ivu-modal');
  if (!isModal) {
    domUtils.addClass($el, 'no-modal');
    // let size = domUtils.getSize(mainEl);
    // let left = (window.innerWidth - size.width) / 2;
    // let top = (window.innerHeight - size.height) / 2;
    // mainEl.style.left = left + 'px';
    // mainEl.style.top = top + 'px';
  } else {
    domUtils.removeClass($el, 'no-modal');
    // mainEl.style.left = '0px';
    // mainEl.style.top = '0px';
  }
}
function handleDrag(drag, $el) {
  let target = '.ivu-modal-content';
  if (drag)
    $el._dragInstance = new Drag($el, { target, handler: '.ivu-modal-header' });
}
//iview Modal组件非模态
export default {
  name: 'modal-ext',
  directive: {
    inserted(el, binding, vnode) {
      let $el = el;
      let options = parseOptions(binding, vnode);
      handleDrag(options.drag, $el);
      handleModal(options.modal, $el)
      handleEscClose(options, vnode);
    },
    update(el, binding, vnode) {
      let options = parseOptions(binding, vnode);
      handleEscClose(options, vnode);
      handleModal(options.modal, el)
    },
    unbind() {
      if (!this) return;
      this.el._dragInstance && this.el._dragInstance.destory();
    }
  }
}
