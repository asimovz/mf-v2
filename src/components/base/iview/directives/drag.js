var isDraging = false
var elx = 0
var ely = 0
var target = null //拖拽目标
var handler = null//拖拽触发点
var callbacks = {
  onDragEnd: null,
  onDragStart: null,
  onDrag: null
}

class Drag {

  constructor(el, { target, handler, callbacks = {} }) {

    if (target)
      this.target = el.querySelector(target);
    else
      this.target = el;

    if (handler)
      this.handler = el.querySelector(handler);
    else
      this.handler = this.target
    this.callbacks = callbacks;
    this.bindEvents();
  }
  bindEvents() {
    let el = this.target;
    this.handler.addEventListener('mousedown', ev => {
      if (ev.which === 1) {
        this.isDraging = true;
        this.elx = ev.pageX - el.offsetLeft;
        this.ely = ev.pageY - el.offsetTop;
        this.callbacks.onDragStart && this.callbacks.onDragStart(ev, this.elx, this.ely)
      }
    });
    el.addEventListener('mouseup', ev => {
      {
        this.isDraging = false;
        let pos = this._getPosFromEvent(ev);
        this.callbacks.onDragEnd && this.callbacks.onDragEnd(ev, pos.x, pos.y)
      }
    })
    window.addEventListener('mousemove', this._dragHandler.bind(this))
  }
  _dragHandler(ev) {
    if (!this.isDraging) return;
    let pos = this._getPosFromEvent(ev);
    this.callbacks.onDrag && this.callbacks.onDrag(ev, pos.x, pos.y)
    this._positionTo(pos.x, pos.y);
    ev.preventDefault();
    return false;
  }
  _getPosFromEvent(ev) {
    return { x: ev.clientX - this.elx, y: ev.clientY - this.ely }
  }
  _positionTo(x, y) {
    //默认Modal 相对定位 top 100px；顶层页面头部还有100px
    if(y < -100)
      y = -100
    if(y > document.body.offsetHeight-this.target.offsetHeight-100)
      y = document.body.offsetHeight-this.target.offsetHeight-100
    let xOffset = (document.body.offsetWidth-this.target.offsetWidth)/2
    if(x < -xOffset) 
      x = -xOffset
    if(x > xOffset) 
      x = xOffset
    this.target.style.left = x + 'px';
    this.target.style.top = y + 'px';
  }
  destroy() {
    window.removeEventListener('mousemove', this._dragHandler);
  }
}
export { Drag }
export default {
  name: 'cpt-drag',
  directive: {
    bind(el, { value }) {
      el._dragInstance = new Drag(el, value || {});
    },
    unbind(el) {
      el._dragInstance && el._dragInstance.destory();
    }
  }
}
