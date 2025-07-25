import useSWR from 'swr';
import { FetcherResponse } from 'swr/_internal';
import useSWRMutation from 'swr/mutation';
import { BASE_URL } from '../../constants';

const BACKEND_URL = `${BASE_URL}/admin`;

const fetcher = async (...args: Parameters<typeof fetch>) => {
  const options: RequestInit = {
    credentials: 'include',
  };

  options.headers = {
    'Content-Type': 'application/json',
  };

  args[0] = `${BACKEND_URL}${args[0]}`;
  args.push(options);

  return (await fetch(...args)).json();
};

const fetcherPost = async <T>(url: string, { arg }: { arg: T }) =>
  (
    await fetch(`${BACKEND_URL}${url}`, {
      method: 'POST',
      body: JSON.stringify(arg),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

const fetcherDelete = async <T>(url: string, { arg }: { arg: T }) =>
  (
    await fetch(`${BACKEND_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify(arg),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

const fetcherPut = async <T>(url: string, { arg }: { arg: T }) =>
  (
    await fetch(`${BACKEND_URL}${url}`, {
      method: 'PUT',
      body: JSON.stringify(arg),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

const useSWRHook = <T>(url: string) => {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);
  return { data, isLoading, error, mutate };
};

const useSWRMutationHook = <T, I>(
  url: string,
  fetcherFn: (key: string, options: Readonly<{ arg: I }>) => FetcherResponse<T>,
) => {
  const { trigger, isMutating, error, data } = useSWRMutation<T, Error, string, I>(url, fetcherFn);
  return { trigger, isMutating, error, data, isSuccess: !!data };
};

export { fetcher, fetcherDelete, fetcherPost, fetcherPut, useSWRHook, useSWRMutationHook };
