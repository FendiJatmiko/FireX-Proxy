import * as browser from 'webextension-polyfill';

const state = {
    all: [],
    loaded: null
};

const actions = {
    setLoaded({ commit }, loadedState) {
        commit('setLoaded', loadedState);
    },
    setProxies({ commit }, proxies) {
        commit('setProxies', proxies);
    },
    poll({ commit }, isForce = false) {
        commit('setLoaded', false);

        const message = {
            name: 'get-proxies',
            message: {
                force: isForce
            }
        };

        return browser.runtime
            .sendMessage(message)
            .then(proxies => {
                const newProxies = proxies.map(proxy => Object.assign({}, proxy, {country: proxy.country || 'Unknown'}));

                commit('setProxies', newProxies);
                commit('setLoaded', true);

                return proxies;
            });
    }
};

const mutations = {
    setLoaded(state, loadedState) {
        state.loaded = loadedState;
    },
    setProxies(state, proxies) {
        state.all = proxies;
    }
};

export default {
    state,
    actions,
    mutations
}
