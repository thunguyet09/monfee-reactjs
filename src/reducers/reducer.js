const initialState = {
    data: [],
    loading: false,
    error: null,
};

const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_DATA_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_DATA_SUCCESS':
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: null,
            };
        case 'FETCH_DATA_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};