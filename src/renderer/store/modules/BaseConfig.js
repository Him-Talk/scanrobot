const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).BaseConfig : {
  transition: 'default',
  backGroundType: 2,
  backGroundBlur: 2,
  backGroundImg: '123.jpg',
  backGroundColor: '#fff',
  fontColor: '#000',
  favorite: [],
  allmarket: [],
  quota: ['usdt']
}

const getters = {
  backGroundParent: state => {
    if (state.backGroundType === 1) {
      return {
        'background': 'url("static/background/' + state.backGroundImg + '") center center / cover no-repeat fixed'
      }
    } else {
      return {
        'background': state.backGroundColor
      }
    }
  },
  favoriteChild: state => {
    return state.favorite
  },
  backGroundChild: state => {
    if (state.backGroundType === 1) {
      return {
        filter: 'blur(' + state.backGroundBlur + 'px)',
        background: 'inherit'
      }
    } else {
      return {}
    }
  },
  fontColor: state => {
    return {
      color: state.fontColor
    }
  },
  transitionGroup: state => {
    const trans = require('@/assets/transform/transform.js')
    return trans[state.transition]
  }
}

const mutations = {
  CHANGE_MARKET (state, market) {
    state.allmarket = market
  },
  CHANGE_FAVORITE (state, favorite) {
    state.favorite = favorite
  },
  CHANGE_TRANSITION (state, type) {
    state.transition = type
  },
  CHANGE_BACKGROUNDBLUR (state, type) {
    state.backGroundBlur = type
  },
  CHANGE_COLOR (state, type) {
    state.backGroundType = 2
    state.backGroundColor = type
  },
  CHANGE_FONTCOLOR (state, type) {
    state.fontColor = type
  },
  CHANGE_BACKGROUNDIMG (state, type) {
    state.backGroundType = 1
    state.backGroundImg = type
  }
}

const actions = {
  changeTransition ({ commit }, type) {
    commit('CHANGE_TRANSITION', type)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
