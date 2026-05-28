import Fuse, { type IFuseOptions } from 'fuse.js';
import { useMemo } from 'react';

const useFuseSearch = <T>(
  data: T[],
  searchTerm: string,
  options: IFuseOptions<T>
): T[] => {
  const fuse = useMemo(() => new Fuse(data, options), [data, options]);

  return useMemo(() => {
    if (searchTerm === '') {
      return data;
    }

    return fuse.search(searchTerm).map((result) => result.item);
  }, [fuse, data, searchTerm]);
};

export default useFuseSearch;
