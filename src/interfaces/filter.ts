import { Data } from './data';

export interface Filter {
  name: string;
  filter: (data: Data, index: number) => boolean;
}
