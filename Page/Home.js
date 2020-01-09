import New from './New.js';
import Theme from './Theme.js';
import engine from '../Common/engine.js';

class Home {
    constructor(param = {}) {
        this.$parent = param.parent;
        this.$el;
        this.render();
        this.create();
        this.new = new New({ parent: this.$el.querySelector('#new') });
        this.theme = new Theme({ parent: this.$el.querySelector('#theme') });
    }

    create() {
        this.addEvent();
    }

    destroy() {
        this.new.destroy();
        this.theme.destroy();
        this.$parent.removeChild(this.$el);
        this.removeEvent();
    }
    
    addEvent() {
    }

    removeEvent() {
    }

    render() {
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
}

export default Home;