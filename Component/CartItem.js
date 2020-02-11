import CartTotal from "../Prototype/CartTotal.js";
import store from "../Common/Store.js";

class CartItem {
  constructor(param = {}) {
      this.$parent = param.parent;
      this.$el = this.$parent.querySelector('#cartPage');
      this.$listEl = this.$parent.querySelector('ul');
      this.CART_DATA = param.cartDataId;
      this.cartTotal = new CartTotal({ parent: this.$el, cartDataId: this.CART_DATA });
      this.event = {
        plus: null,
        minus: null,
        save: null,
      };
      this._init();
  }

  _init() {
    this.event.save = this.save.bind(this);
    store.store.subscribe(this.CART_DATA, this.event.save);

    this._render();
    
    this.$increaseBtn = this.$el.querySelectorAll(".increaseBtn");
    this.$reduceBtn = this.$el.querySelectorAll(".reduceBtn");
    
    this._addEvent();
  }
  
  save() {
      sessionStorage.cart = JSON.stringify(store.store.state[this.CART_DATA]);
  }

  _createHtml(data) {
    const html = document.createElement('template');
    html.innerHTML = `
        <li class="wo9IH">
            <div class="uu6c_">
                <div class="t2ksc">
                    <div class="RR-M- SAvC5" role="button" tabindex="0">
                        <canvas class="CfWVH" height="120" width="120" style="position: absolute; top: -5px; left: -5px; width: 40px; height: 40px;"></canvas><a class="_2dbep qNELH kIKUG" href="javascript:;" style="width: 56px; height: 56px;"><img alt="" class="_6q-tv" src="${data.src}"></a>
                    </div>
                    <div class="enpQJ">
                        <div class="d7ByH">
                            <a class="FPmhX notranslate _0imsa " title="yeongdong07" href="javascript:;">${data.name}</a>
                        </div>
                        <div class="wFPL8 ">
                            <span class="itemPrice">${data.price}</span>원 × <span class="itemQuantity">${data.quantity}</span>개 ＝ <span class="itemTotal">${data.total}</span>원
                        </div>
                    </div>
                </div>
                <div class="Pkbci">
                    <button class="sqdOP L3NKy y3zKF increaseBtn" type="button" style="margin-bottom: 2px;">+</button>
                    <button class="sqdOP L3NKy y3zKF reduceBtn" type="button" style="margin-top: 2px;">-</button>
                </div>
            </div>
        </li>
    `;
    
    return html.content;
  }

  _render() {
    store.store.state[this.CART_DATA].forEach(data => {
      this.$listEl.appendChild(this._createHtml(data));
    });
  }

  _mutate(type, event) {
    const buttenWrapper = event.currentTarget.parentElement;
    const totalWrapper = buttenWrapper.previousElementSibling;
    let parentElementCheck = buttenWrapper.parentElement.parentElement;
    let index = 0;
    while((parentElementCheck = parentElementCheck.previousElementSibling) != null ) {
        index++;
    }

    const data = store.store.state[this.CART_DATA][index];
    
    if(type === "plus") {
        data.quantity++;
    }
    if(type === "minus") {
        if(data.quantity <= 1) {
            return;
        }
        data.quantity--;
    }

    totalWrapper.querySelector('.itemQuantity').innerText = data.quantity;
    totalWrapper.querySelector('.itemTotal').innerText = data.total;

    // 바뀐 데이터만 커밋
    store.store.commit(this.CART_DATA, store.store.state[this.CART_DATA][index], {index: index});
  }

  _addEvent() {
      this.event.plus = this._mutate.bind(this, "plus");
      this.event.minus = this._mutate.bind(this, "minus");
      this.$increaseBtn.forEach((el) => {
          el.addEventListener("click", this.event.plus);
      });
      this.$reduceBtn.forEach((el) => {
          el.addEventListener("click", this.event.minus);
      });
  }

  _removeEvent() {
    this.$increaseBtn.forEach((el) => {
        el.removeEventListener("click", this.event.plus);
    });
    this.$reduceBtn.forEach((el) => {
        el.removeEventListener("click", this.event.minus);
    });
  }

  destroy() {
    store.store.unsubscribe(this.CART_DATA, this.event.save);
    this.event.save = null;
    this.$listEl.innerHTML = '';
    this.cartTotal.destroy();
    this.cartTotal = undefined;
    // this._removeEvent();
    // this.event.plus = null;
    // this.event.minus = null;
  }
}

export default CartItem;
