import { useEffect, useState } from "react";
import fetchJson from "./fetchJson";

export default function useFetch(deps = [], ...args) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const fetchedData = await fetchJson(...args);
      setData(fetchedData);
      setLoading(false);
    }

    fetchData();
  }, deps);

  return [data, loading];
}
