/**
 * Logger configuration using Pino
 * @module logger
 */

import pino from "pino";

/**
 * Send function for browser logging
 * @param {Object} level - Log level
 * @param {Object} logEvent - Log event object
 */
const send = (level, logEvent) => {
  const { msg, ...rest } = logEvent;
  console.log(level, msg, rest);
};

const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
      send,
    },
  },
});

export default logger;