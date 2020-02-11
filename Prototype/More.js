import common from '../Common/common.js';

// 데이터 탭이동마다 중복 요청함 한번 받아온 데이터 공통화 방안 고민
class More {
    constructor() {
        // TODO 아래 상태들 외부에서 가시성이 없도록 재설계
        this.data = [];
        this.page = 0;
        this.totalPage = 0;
        this.hasNext = undefined;
    }

    async create() {
        await Promise.all([this._fetchTotalPage(), this.ajaxMore()]);
        // HACK hasNext 재계산 로직 ajaxFeedMore로 공통화방안 고민
        const hasNext = this.page < this.totalPage;
        this.hasNext = hasNext;
    }

    async ajaxMore() {
        const data = await this._fetchNextData();
        this.renderMore(data);
        // FIXME _fetchNextData 완료 전에는 비정상작동
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

    processData(list) {
        // TODO 필요시 오버라이드
    }
}

export default More;