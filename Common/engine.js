const engine = (template, data) => {
    const arr = Array.isArray(data) ? data : [data];
    const { content: fragment } = arr.reduce((dummy, data) => {
        dummy.innerHTML += template.replace(/{{ *(\w+) *}}/g, (m, key) => data[key]);
        return dummy;
    }, document.createElement('template'));
    const elements = Array.isArray(data) ? [].slice.call(fragment.children) : fragment.firstChild;
    return { fragment: fragment, elements: elements };
}

export default engine;