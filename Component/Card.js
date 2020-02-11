import engine from '../Common/engine.js';

class Card {
    constructor(param = {}) {
        this.$parent = param.parent;
        this.$elementsList = [];
        this.state = {
            colsCnt: param.colsCnt,
            tops: Array(param.colsCnt).fill(0),
            pageArea: [],
        };
        this.event = {
            resize: undefined,
            repaint: undefined,
        };
        this.create();
    }
    
    create() {
        this.addEvent();
    }

    layout(elementsList = this.$elementsList, page = 1) {
        // offsetWidth 반복 호출로 인한 리페인트 발생, this.state.colsCnt 중복 호출 미리 변수 지정
        const lefts = Array(this.state.colsCnt).fill().map((left, index) => this.$parent.offsetWidth / this.state.colsCnt * index);

        elementsList.forEach((elements, index) => {
            this.state.pageArea[page + index - 1] = {};
            this.state.pageArea[page + index - 1].top = Math.min(...this.state.tops);
            elements
                .map(element => {
                    const top = Math.min(...this.state.tops); // 최소값 담기
                    const index = this.state.tops.indexOf(top); // 최소값이 담긴 배열의 인덱스
                    const left = lefts[index]; // lefts[인덱스]로 X 좌표값 담기
                    this.state.tops[index] += element.offsetHeight;
                    return { element: element, top: top, left: left };
                })
                .forEach(({ element, top, left }) => {
                    element.style.top = top + 'px';
                    element.style.left = left + 'px';
                });
            this.state.pageArea[page + index - 1].bottom = Math.max(...this.state.tops);
        });
        this.$parent.style.height = Math.max(...this.state.tops) + 'px';
    }

    display() {
        // 레이지 로드
        const pageTop = pageYOffset; // 스크롤 top 값
        const pageSize = document.body.offsetHeight; // 디바이스 높이값
        const pageBottom = pageTop + pageSize; // 스크롤 bottom 값
        this.state.pageArea.forEach(({ top, bottom }, index) => {
            /*
                bottom : 한 페이지의 bottom 값

                bottom > pageTop - pageSize : 
                 한 페이지의 bottom > ( 스크롤 top - 디바이스 height  )
                &&
                top < pageBottom + pageSize : 
                 한 페이지의 top < ( 스크롤 bottom + 디바이스 height )
                 
                위의 조건 만족할시 보여준다.
            */
            if(bottom > pageTop - pageSize && top < pageBottom + pageSize) {
                this.$elementsList[index].forEach($el => {
                    if($el.style.display === 'none') {
                        $el.style.display = '';
                    }
                });
            } else {
                this.$elementsList[index].forEach($el => {
                    if($el.style.display !== 'none') {
                        $el.style.display = 'none';
                    }
                });
            }
        });
    }

    resize(e) {
        this.state.tops = Array(this.state.colsCnt).fill(0);
        // 리사이즈시에 위치값 못잡는 문제해결법인데 , 이유가 visibility: hidden; 속성 사용시에 돔트리에 남아있어 리페인트가 일어난다.
        // 그래서 display : none; 을 사용해야하는데 문제가 요소가 사라져서 위치를 못잡는 문제가 발생함, 이 문제를 해결한 방법이다.
        // 리사이즈되면 레이지로드가 적용된 것 포함해서 모든 돔을 display : blockㅣ을 해서 위치를 잡는다.
        [].concat(...this.$elementsList).forEach($el => {
            $el.style.display = '';
        });
        this.layout();
    }

    addEvent() {
        this.event.resize = this.resize.bind(this);
        this.event.repaint = this.display.bind(this);
        window.addEventListener('resize', this.event.resize);
        window.addEventListener('scroll', this.event.repaint);
    }

    removeEvent() {
        window.removeEventListener('resize', this.event.resize);
        window.removeEventListener('scroll', this.event.repaint);
    }

    render(data) {
        const template = `
            <a class="_bz0w" href="javascript:;" style="width:calc(100%/${ this.state.colsCnt }); position: absolute;">
                <div role="button" tabindex="0" class="A-NpN">
                    <div class="lVhHa RNL1l"
                        style="background-image: url('{{ img }}'); display: block; padding-top: {{ height }}; width: 100%;">
                    </div>
                    <div class="qn-0x">
                        <div class="_5cOAs">
                            <div class="Rsx-c">
                                <div class="zncDM">4:42</div>
                            </div>
                            <div class="pu1E0">
                                <div class="_2XLe_">{{ text }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        `;
        const { fragment, elements } = engine(template, data);
        this.$parent.appendChild(fragment);
        const page = this.$elementsList.push(elements);
        this.layout([elements], page);
    }

    destroy() {
        [].concat(...this.$elementsList).forEach($el => {
            this.$parent.removeChild($el);
        });
        this.removeEvent();
    }
}

export default Card;