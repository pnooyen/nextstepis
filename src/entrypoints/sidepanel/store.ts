import { writable } from 'svelte/store';

export const capturing = writable<boolean>(false);
