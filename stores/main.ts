import { defineStore } from 'pinia'

interface State {
    token : string
    staffId : number | null;
}

export const useIndexStore = defineStore('index',{
    state: (): State => ({
        token:'',
        staffId: null,
    }),
});

