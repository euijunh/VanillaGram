import common from '../Common/common.js';
import More from './More.js';

class ClickMore extends More {
    constructor() {
        super();
        this._click = undefined;
    }
    
    async click(e) {
        if(!common.loading.style.display) {
            return;
        }
        common.loading.style.display = '';
        this.$more.style.display = 'none';
        await this.ajaxMore();
        common.loading.style.display = 'none';
        if(!this.hasNext) {
            this.removeEvent();
        } else {
            this.$more.style.display = '';
        }
    }

    addEvent() {
        this._click = this.click.bind(this);
        this.$click.addEventListener('click', this._click);
    }

    removeEvent() {
        this.$click.removeEventListener('click', this._click);
    }
}

export default ClickMore;