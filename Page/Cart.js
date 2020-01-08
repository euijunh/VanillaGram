import CartItem from "../Component/CartItem.js";
import store from "../Common/Store.js";

class Cart {
  constructor(param = {}) {
    this.$parent = param.parent; // "#app"
    this.$el;
    this.CART_DATA = param.cartDataId;
    this.evnet = {
      render: null,
    };
    this._init();
    this._page = new CartItem({parent : this.$parent, cartDataId: this.CART_DATA });
  }

  _init() {
    if(typeof store.store.state[this.CART_DATA] === 'undefined') {
      this.load();
    }

    this.evnet.render = this.render.bind(this);
    store.store.subscribe(this.CART_DATA, this.evnet.render);

    this.$el = document.createElement("div");
    this.render();
    this.$parent.insertBefore(this.$el, this.$parent.firstChild);
  }

  load() { // 세션스토리지에서 데이터 확인 후에 스토어에 적재
    if(undefined === sessionStorage.cart) {
        sessionStorage.cart = '[{"name":"상품명1","src":"https://raw.githubusercontent.com/it-crafts/mockapi/master/img/01.jpg","price":5000,"quantity":2},{"name":"상품명2","src":"https://raw.githubusercontent.com/it-crafts/mockapi/master/img/02.jpg","price":7000,"quantity":2},{"name":"상품명3","src":"https://raw.githubusercontent.com/it-crafts/mockapi/master/img/03.jpg","price":6000,"quantity":3},{"name":"상품명4","src":"https://raw.githubusercontent.com/it-crafts/mockapi/master/img/04.jpg","price":10000,"quantity":1},{"name":"상품명5","src":"https://raw.githubusercontent.com/it-crafts/mockapi/master/img/05.jpg","price":3000,"quantity":5}]';
    }

    const cartData = JSON.parse(sessionStorage.cart).map(item => {
      return {
          name: item.name,
          src: item.src,
          price: item.price,
          quantity: item.quantity,
          get total() {
              return this.price * this.quantity;
          }
      }
    });

    store.store.commit(this.CART_DATA, cartData);
  }

  render() {
    const total = store.store.state[this.CART_DATA].reduce((total, data) => {
      total += data.quantity;
      return total;
    }, 0);

    this.$el.classList.add("uKzpc");
    this.$el.style.marginTop = '45px';
    this.$el.innerText = "장바구니 | " + total + '개';
  }

  destroy() {
    store.store.unsubscribe(this.CART_DATA, this.evnet.render);
    this.evnet.render = null;
    this._page.destroy();
    this._page = undefined;
    this.$parent.removeChild(this.$el);
    this.$el;
  }
}

export default Cart;



