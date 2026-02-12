import { useMemo } from 'react';
import statesData from '../assets/states-and-districts.json';

export const useLocationData = () => {
  const states = useMemo(() => statesData.states.map(s => s.state), []);

  const getDistricts = (state) => {
    const stateData = statesData.states.find(s => s.state.toLowerCase() === state.toLowerCase());
    return stateData ? stateData.districts : [];
  };

  return { states, getDistricts };
};
