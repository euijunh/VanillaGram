const Store = function() {
    const state = {};
    const notice = {};

    const commit = function(key, value) {
        state[key] = value;
        notice[key] = notice[key] || [];
        notice[key].forEach(callback => callback());
    }
    const subscribe = function(key, callback) {
        notice[key] = notice[key] || [];
        notice[key].push(callback);
    }
    const unsubscribe = function(key, callback) {
        notice[key] = notice[key] || [];
        const index = notice[key].indexOf(callback);
        if(index > -1) {
            notice[key].splice(index, 1);
        }
    }

    return {
        commit: commit,
        get state() {
            return Object.create(state);
        },
        subscribe: subscribe,
        unsubscribe: unsubscribe
    }
};

const store = new Store();

export { Store, store };