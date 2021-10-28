import { JSONFilter } from '../build';

export interface Test {
    title: string;
    where: string;
    filter: JSONFilter;
}
