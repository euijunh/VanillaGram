import common from '../Common/common.js';
import More from './More.js';

class ClickMore extends More {
    constructor() {
        super();
        this.event = {
            click: null,
        }
    }
    
    async _click() {
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
        this.event.click = this._click.bind(this);
        this.$click.addEventListener('click', this.event.click);
    }

    removeEvent() {
        this.$click.removeEventListener('click', this.event.click);
    }
}

export default ClickMore;