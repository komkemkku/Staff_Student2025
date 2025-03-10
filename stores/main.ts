import { defineStore } from 'pinia'

interface State {
    token : string
    staffId : string,
}

export const useIndexStore = defineStore('index',{
    state: (): State => ({
        token:'',
        staffId:'',
    }),
});

