import common from '../Common/common.js';
import More from './More.js';

class ScrollMore extends More {
    constructor() {
        super();
        this.event = {
            scroll: null,
        };
    }
    
    async _scroll() {
        if(!common.loading.style.display) {
            return;
        }
        const pageSize = document.body.offsetHeight;
        const totalSize = document.body.scrollHeight;
        if(pageYOffset + pageSize < totalSize - pageSize) {
            return;
        }
        common.loading.style.display = '';
        await this.ajaxMore();
        common.loading.style.display = 'none';
        if(!this.hasNext) {
            this.removeEvent();
        }
    }

    addEvent() {
        this.event.scroll = this._scroll.bind(this);
        window.addEventListener('scroll', this.event.scroll);
    }

    removeEvent() {
        window.removeEventListener('scroll', this.event.scroll);
    }
}

export default ScrollMore;