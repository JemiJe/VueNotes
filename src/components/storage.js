const storage = {
    init() {
        let storage = localStorage.getItem('VueNotes');
        if (!storage) {
            localStorage.setItem('VueNotes', JSON.stringify({}));
            storage = localStorage.getItem('VueNotes');
        }
    },
    
    getStorage() {
        return JSON.parse(localStorage.getItem('VueNotes'));
    },

    chageStorage(func) {
        let storageObj = JSON.parse(localStorage.getItem('VueNotes'));
        func(storageObj);
        localStorage.setItem('VueNotes', JSON.stringify(storageObj));
    },
};

export default storage;