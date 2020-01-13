import common from './Common/common.js';
import Home from './Page/Home.js';
import Theme from './Page/Theme.js';
import New from './Page/New.js';
import Cart from "./Page/Cart.js";

class Root {
    constructor(selector) {
        this.CART_DATA = Symbol('CART_DATA');
        this.$el = document.querySelector(selector);
        this.$page = this.$el.querySelector('#page');
        this.$navs = this.$el.querySelector('#nav').querySelectorAll('a');
        this.event = {
            click: undefined,
            popstate: undefined,
        }
        this._page;
        this._create();
    }
    
    _create() {
        this._addEvent();
        this._route(location.pathname);
    }

    _click(e) {
        e.preventDefault();
        if('' === common.loading.style.display) {
            return;
        }
        
        const current = e.currentTarget;

        let tabIndexCheck = current.parentElement;
        let index = 0;
        while((tabIndexCheck = tabIndexCheck.previousElementSibling) != null ) {
            index++;
        }

        Array.from(this.$navs)
            .filter(node => 1 === node.nodeType && node !== current)
            .forEach(other => {
                other.firstChild.className = other.firstChild.className.replace('filled', 'outline');
            });
        current.firstChild.className = current.firstChild.className.replace('outline', 'filled');
        this._route(current.pathname);

        history.pushState({tabIndex : index}, document.title, current.pathname);
    }

    _route(path) {
        this._page && this._page.destroy && this._page.destroy();

        switch(path) {
            case '/home.htm':
                this._page = new Home({ parent: this.$page });
                this.$navs[0].firstChild.className = this.$navs[0].firstChild.className.replace('outline', 'filled');
                break;
            case '/theme.htm':
                this._page = new Theme({ parent: this.$page });
                this.$navs[1].firstChild.className = this.$navs[1].firstChild.className.replace('outline', 'filled');
                break;
            case '/new.htm':
                this._page = new New({ parent: this.$page });
                this.$navs[2].firstChild.className = this.$navs[2].firstChild.className.replace('outline', 'filled');
                break;
            case '/cart.htm':
                this._page = new Cart({ parent: this.$el, cartDataId: this.CART_DATA });
                this.$navs[3].firstChild.className = this.$navs[3].firstChild.className.replace('outline', 'filled');
                break;
            default:
                this._page = null;
                break;
        }
    }

    _popstate() {
        this._route(location.pathname);
        this._routeTab(history.state);
    }

    _routeTab({tabIndex}) {
        this.$navs.forEach(el => {
            el.firstChild.className = el.firstChild.className.replace('filled', 'outline');
        })
        this.$navs[tabIndex].firstChild.className = this.$navs[tabIndex].firstChild.className.replace('outline', 'filled');
    }

    _addEvent() {
        this.event.popstate = this._popstate.bind(this);
        window.addEventListener('popstate', this.event.popstate);
        this.event.click = this._click.bind(this);
        this.$navs.forEach(tabButton => {
            tabButton.addEventListener('click', this.event.click);
        });
    }

    _removeEvent() {
        window.removeEventListener('popstate', this.event.popstate);
        this.$navs.forEach(tabButton => {
            tabButton.removeEventListener('click', this.event.click);
        });
    }

    render() {
    }

    destroy() {
        this._removeEvent();
        this._page.destroy();
    }
}

const app = new Root('#app');

export default app;