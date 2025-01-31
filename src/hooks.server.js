import { startBot } from './discord';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  startBot(); // Start bot when server starts
  return resolve(event);
};
