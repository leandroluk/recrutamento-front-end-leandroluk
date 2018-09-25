import { Action } from "@ngrx/store";
import { IUser } from "./interfaces/user.interface";
import { ISession } from "./interfaces/session.interface";

// Action names
export const USER_ONLINE = '[User] Online';
export const USER_OFFLINE = '[User] Offline';

// Action Methods

export class UserOnline implements Action {
    readonly type = USER_ONLINE;
    constructor(public payload: IUser) { }
}
export class UserOffline implements Action {
    readonly type = USER_OFFLINE;
}

// Action types

export type Actions = UserOnline | UserOffline;

// Local token & initial state;

const localStorageTokenName = 'recrutamento-front-end-leandroluk';
const initialState: ISession = {
    expiresOn: null,
};

/**
 * Reducer seguindo a metodologia flux que armazena o seu estado em uma chave no localStorage para
 * persistir a aplicação
 * @param state 
 * @param action 
 */
export function sessionReducer(state: ISession = null, action: Actions) {

    let localState = null;
    let parsedState: ISession = null;
    let dateNow: number;

    if (state === null) {

        localState = localStorage.getItem(localStorageTokenName);

        if (localState != null) {

            parsedState = { ...initialState, ...JSON.parse(atob(localState)) };
            dateNow = Date.now();

            if (!!parsedState.expiresOn && parsedState.expiresOn < dateNow) {
                state = { ...initialState, ...parsedState };
            }

        } else {
            state = { expiresOn: Date.now() };
        }

    }

    switch (action.type) {
        case USER_ONLINE:
            state = {
                ...state,
                expiresOn: Date.now() + (1000 * 60 * 5),
                user: action.payload
            };
            break;
        case USER_OFFLINE:
            state = initialState;
            break;
    }

    let stringfiedState = JSON.stringify(state);
    let criptedState = btoa(stringfiedState);
    localStorage.setItem(localStorageTokenName, criptedState);

    return state;
}