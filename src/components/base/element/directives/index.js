import drag from './drag';
import modalExt from './modal-ext';

export default {
  install(Vue, options) {
    Vue.directive(drag.name, drag.directive);
    Vue.directive(modalExt.name, modalExt.directive);
  }
}
