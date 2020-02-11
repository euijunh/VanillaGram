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
        const lefts = Array(this.state.colsCnt).fill().map((left, index) => this.$parent.offsetWidth / this.state.colsCnt * index);

        elementsList.forEach((elements, index) => {
            this.state.pageArea[page + index - 1] = {};
            this.state.pageArea[page + index - 1].top = Math.min(...this.state.tops);
            elements
                .map(element => {
                    const top = Math.min(...this.state.tops);
                    const index = this.state.tops.indexOf(top);
                    const left = lefts[index];
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
        const pageTop = pageYOffset;
        const pageSize = document.body.offsetHeight;
        const pageBottom = pageTop + pageSize;
        this.state.pageArea.forEach(({ top, bottom }, index) => {
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