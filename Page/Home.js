import New from './New.js';
import Theme from './Theme.js';
import engine from '../Common/engine.js';

class Home {
    constructor(param = {}) {
        this.$parent = param.parent;
        this.$el;
        this._render();
        this._create();
        this.theme = new Theme({ parent: this.$el.querySelector('#theme'), opt: {callingClass: "Home"} });
        this.new = new New({ parent: this.$el.querySelector('#new') });
    }

    _create() {
        this.addEvent();
    }
    
    addEvent() {
    }

    removeEvent() {
    }

    _render() {
        const template = `
            <div>
                <div id="theme"></div>
                <div id="new"></div>
            </div>
        `;
        const { fragment, elements } = engine(template, [null]);
        this.$parent.appendChild(fragment);
        this.$el = elements[0];
    }

    destroy() {
        this.new.destroy();
        this.theme.destroy();
        this.$parent.removeChild(this.$el);
        this.removeEvent();
    }
}

export default Home;