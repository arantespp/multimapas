import moment from 'moment';

export const serialDataToMoment = (serial: number | string) =>
  moment(Math.round((Number(serial) - 25569) * 86400 * 1000)).add(1, 'day');
