const state = {
  data: [],
};

const getters = {
  getData: (state) => state.data,
};

const actions = {
  storeData({ commit }, payload) {
    commit("setData", payload);
  },
};

const mutations = {
  setData: (state, payload) => {
    state.data = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
