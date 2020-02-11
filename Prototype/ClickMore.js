import common from '../Common/common.js';
import More from './More.js';

class ClickMore extends More {
    constructor() {
        super();
        // TODO this.event.click이 외부에서 가시성이 없도록 재설계
        this.event = {
            click: null,
        }
    }
    
    async _click() {
        if(!common.loading.style.display) {
            return;
        }
        common.loading.style.display = '';
        // TODO $more 속성명을 몰라도 외부에서 재사용할 수 있도록 재설계
        this.$more.style.display = 'none';
        await this.ajaxMore();
        common.loading.style.display = 'none';
        if(!this.hasNext) {
            this.removeEvent();
        } else {
            // TODO $more 속성명을 몰라도 외부에서 재사용할 수 있도록 재설계
            this.$more.style.display = '';
        }
    }

    addEvent() {
        this.event.click = this._click.bind(this);
        // TODO $click 속성명을 몰라도 외부에서 재사용할 수 있도록 재설계
        this.$click.addEventListener('click', this.event.click);
    }

    removeEvent() {
        // TODO $click 속성명을 몰라도 외부에서 재사용할 수 있도록 재설계
        this.$click.removeEventListener('click', this.event.click);
    }
}

export default ClickMore;