import { Data, Filter } from '../../interfaces';

/**********************
 * Write filters here *
 **********************/

const isPositive: Filter = {
  name: 'Positivo',
  filter: (data, index) => {
    const cols = [
      'RESUL_PRNT',
      'RESUL_SORO',
      'RESUL_NS1',
      'RESUL_VI_N',
      'RESUL_PCR_',
      'HISTOPA_N',
      'IMUNOH_N'
    ].map(value => {
      return Number(data[value as keyof Data]) === 1;
    });
    const res = cols.reduce((acc, cur) => acc || cur, false);
    return res;
  }
};

const isAutoctone: Filter = {
  name: 'Autóctone',
  filter: (data, index) => {
    return Number(data['TPAUTOCTO']) === 1;
  }
};

const isNotAutoctone: Filter = {
  name: 'Não Autóctone',
  filter: (data, index) => {
    return Number(data['TPAUTOCTO']) !== 1;
  }
};

/**********************
 **********************
 **********************/

export const filters = {
  isPositive,
  isAutoctone,
  isNotAutoctone
};

export const applyFilters = (filtersNameToBeApplied: string[]) => (
  data: Data,
  index: number
): boolean => {
  const filtersToBeApplied: Filter[] = Object.values(filters).filter(
    ({ name }) => {
      const existsFiltersNameToBeApplied = filtersNameToBeApplied.find(
        filtersNameToBeAppliedName => filtersNameToBeAppliedName === name
      );
      return !!existsFiltersNameToBeApplied;
    }
  );

  return filtersToBeApplied.reduce<boolean>((acc, { filter }) => {
    return acc && filter(data, index);
  }, true);
};



