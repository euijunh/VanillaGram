import common from '../Common/common.js';

class More {
    constructor() {
        this.data = [];
        this.page = 0;
        this.totalPage = 0;
        this.hasNext = undefined;
    }

    async create() {
        await Promise.all([this._fetchTotalPage(), this.ajaxMore()]);
        const hasNext = this.page < this.totalPage;
        this.hasNext = hasNext;
    }

    async ajaxMore() {
        const data = await this._fetchNextData();
        this.renderMore(data);
        const hasNext = this.page < this.totalPage;
        this.hasNext = hasNext;
        return hasNext;
    }

    async _fetchNextData() {
        const data = await common.getData(this.url, ++this.page);
        const list = Array.isArray(data) ? data : [data];
        this.processData(list);
        this.data.push(...list);
        return list;
    }
    
    async _fetchTotalPage() {
        const info = await common.getInfo(this.url);
        const totalPage = info.totalPage * 1;
        this.totalPage = totalPage;
        return totalPage;
    }

    renderMore(data) {
        throw new Error('오버라이드 되지 않은 추상메소드 호출됨');
    }

}

export default More;