export const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('auth', serializedState);
    } catch (error) {
        console.error('Error saving to localStorage', error);
    }
};

export const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('auth');
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.error('Error loading from localStorage', error);
        return undefined;
    }
};