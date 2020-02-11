import common from '../Common/common.js';
import Card from '../Component/Card.js';
import ClickMore from '../Prototype/ClickMore.js';
import ScrollMore from '../Prototype/ScrollMore.js';
import engine from '../Common/engine.js';

class Theme extends ClickMore {
    constructor(param = {}) {
        super();
        this.$parent = param.parent;
        this.$el;
        this.opt = param.opt;
        this.callingClass = (!!this.opt && this.opt.callingClass === "Home") ? 'display: none;' : 'display: "";';
        this._render(this.callingClass);
        this.$more = this.$el.querySelector('.more');
        this.$click = this.$el.querySelector('.click');
        this.$scroll = this.$el.querySelector('.scroll');
        this.url = 'https://my-json-server.typicode.com/euijunh/vanillagram/feed/';
        this.event = {
            initScroll: undefined,
        }
        this._create();
        this.items = new Card({ parent: this.$el.querySelector('.items'), colsCnt: 3 });
    }

    async _create() {
        await super.create();
        if(this.hasNext) {
            this._addEvent();
        } else {
            this.$more.style.display = 'none';
        }
    }
    
    renderMore(data) {
        this.items.render(data);
    }

    processData(list) {
        list.forEach(data => {
            data.img = common.imgPath + data.img;
            const min = Math.ceil(140);
            const max = Math.floor(170);
            data.height = Math.floor(Math.random() * (max - min + 1)) + min + '%';
        });
    }

    _render(display) {
        const template = `
            <div class="v9tJq VfzDr">
                <div class=" _2z6nI">
                    <div class="Gx7Kn">
                        <div id="" class="items" style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;">
                        </div>
                        <div id="" class=" Igw0E rBNOH YBx95 ybXk5 _4EzTm soMvl more" style="margin-right: 8px">
                            <button id="" class="sqdOP L3NKy y3zKF _4pI4F click" type="button" style="margin: 16px 8px">더보기</button>
                            <button id="" class="sqdOP L3NKy y3zKF _4pI4F scroll" type="button" style="${display} margin: 16px 8px">전체보기</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const { fragment, elements } = engine(template, [null]);
        this.$parent.appendChild(fragment);
        this.$el = elements[0];
    }

    _initScroll() {
        this.$more.style.display = 'none';
        this._removeEvent();

        if(Object.setPrototypeOf && Object.getPrototypeOf) {
            Object.setPrototypeOf(Object.getPrototypeOf(this), ScrollMore.prototype);
        } else {
            this.__proto__.__proto__ = ScrollMore.prototype;
        }

        super.addEvent();
        this.event.scroll();
    }

    _finalScroll() {
        if(Object.setPrototypeOf && Object.getPrototypeOf) {
            Object.setPrototypeOf(Object.getPrototypeOf(this), ClickMore.prototype);
        } else {
            this.__proto__.__proto__ = ClickMore.prototype;
        }
    }

    _addEvent() {
        super.addEvent();
        
        if(!!this.opt && this.opt.callingClass === 'Home') {
            return;
        }

        this.event.initScroll = this._initScroll.bind(this);
        this.$scroll.addEventListener('click', this.event.initScroll);
    }

    _removeEvent() {
        super.removeEvent();
        
        if(!!this.opt && this.opt.callingClass === 'Home') {
            return;
        }

        this.$scroll.removeEventListener('click', this.event.initScroll);
    }
    
    destroy() {
        this.items.destroy();
        this.$parent.removeChild(this.$el);
        this._removeEvent();
        this._finalScroll();
    }
}

export default Theme;