import common from '../Common/common.js';
import More from './More.js';

class ScrollMore extends More {
    constructor() {
        super();
        // TODO this.event.scroll이 외부에서 가시성이 없도록 재설계
        this.event = {
            scroll: null,
        };
    }
    
    // FIXME 노출영역 끝을 기준으로 ajaxMore 부르도록, 스크롤 height 좌표 수정 (window나 document bottom이 아닌, 영역 bottom 좌표 기준으로)
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