const CLOSE_LOGIN_MODAL = "ui/closeLoginModal"
const CLOSE_SIGNUP_MODAL = "ui/closeSignupModal"

const SHOW_SIGNUP_MODAL = "ui/showSignupModal"
const SHOW_LOGIN_MODAL = "ui/showLoginModal"



export const showLoginModal = () => {
    return {
        type: SHOW_LOGIN_MODAL
    }
}

export const closeLoginModal = () => {
    return {
        type: CLOSE_LOGIN_MODAL
    }
}


export const showSignupModal = () => {
    return {
        type: SHOW_SIGNUP_MODAL
    }
}

export const closeSignupModal = () => {
    return {
        type: CLOSE_SIGNUP_MODAL
    }
}


const initialState = { showLoginModal: false, showSignupModal: false };
const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_LOGIN_MODAL:
            return { showSignupModal: false, showLoginModal: true };
        case CLOSE_LOGIN_MODAL:
            return { ...state, showLoginModal: false };
        case SHOW_SIGNUP_MODAL:
            return { showLoginModal: false, showSignupModal: true };
        case CLOSE_SIGNUP_MODAL:
            return { ...state, showSignupModal: false };
        default:
            return state;
    }
};

export default uiReducer;