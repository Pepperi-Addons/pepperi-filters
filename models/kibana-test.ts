import { Test } from './test';

export interface KibanaTest extends Test {
    kibanaQuery: string;
}
