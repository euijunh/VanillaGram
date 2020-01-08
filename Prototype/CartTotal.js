import store from "../Common/Store.js";

class CartTotal {
  constructor(param = {}) {
    this.$parent = param.parent;
    this.$el = this.$parent.querySelector('#total');
    this.CART_DATA = param.cartDataId;
    this.event = {
      render : null,
    };
    this._init();
  }

  _init() {
    const template = `
        <div class=" Igw0E IwRSH eGOV_ _4EzTm yC0tu "></div>
        <div class=" Igw0E IwRSH YBx95 vwCYk ">
          <div class=" Igw0E IwRSH eGOV_ _4EzTm " id="f3d9261c43ccaf4">
            <div class="_7UhW9 xLCgt MMzan KV-D4 uL8Hv ">
              <div class="_7UhW9 xLCgt qyrsm KV-D4 uL8Hv ">
                전체상품 <span class="allQuantity"></span>개
              </div>
            </div>
          </div>
          <div class=" Igw0E IwRSH eGOV_ _4EzTm DhRcB " id="f143a2cc28ff4ec">
            <div class="_7UhW9 xLCgt MMzan _0PwGv uL8Hv ">
              합계금액 <span class="allTotal"></span>원
            </div>
          </div>
        </div>
        <div class=" Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl ">
          <button class="sqdOP L3NKy y3zKF " type="button">주문</button>
        </div>
    `;
    this.$el.innerHTML = template;
    this._render();
    this.event.render = this._render.bind(this);
    store.store.subscribe(this.CART_DATA, this.event.render);
  }
  
  _createData(datas) {
    const total = datas.reduce((sum, data) => {
      sum.amount += data.price * data.quantity,
      sum.quantity += data.quantity;
      return sum;
    }, { amount : 0, quantity : 0 });

    return total;
  }

  _render() {
    const total = this._createData(store.store.state[this.CART_DATA]);
    this.$el.querySelector(".allQuantity").innerText = total.quantity;
    this.$el.querySelector(".allTotal").innerText = total.amount;
  }

  destroy() {
    // store.store.unsubscribe(this.CART_DATA, this.event._render);
    // this.event._render = null;
    this.$el.innerHTML = '';
    store.store.unsubscribe(this.CART_DATA, this.event.render);
    this.event.render = null;
  }
}

export default CartTotal;
