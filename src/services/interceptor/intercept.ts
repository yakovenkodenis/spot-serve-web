import { Params } from './types';
import { interceptFetch } from './apis/fetch';
import { interceptXHR } from './apis/xhr';

export async function intercept(params: Params) {
  interceptFetch(params);
  interceptXHR(params);
}
