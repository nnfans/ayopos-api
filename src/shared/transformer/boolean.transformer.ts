import { ValueTransformer } from 'typeorm';

export const BooleanTransformer: ValueTransformer = {
  from: (val: boolean): number => (val ? 0 : 1),
  to: (val: number): boolean => val === 1,
};
