/** Every public URL in one place, so modules never hand-build paths. */
export const routes = {
  home: () => "/",
  destinations: () => "/destinations",
  country: (country: string) => `/destinations/${country}`,
  city: (country: string, city: string) => `/destinations/${country}/${city}`,
  experiences: (query?: Record<string, string | undefined>) => {
    const q = new URLSearchParams(Object.entries(query ?? {}).filter((e): e is [string, string] => !!e[1]));
    return `/experiences${q.size ? `?${q}` : ""}`;
  },
  experience: (slug: string) => `/experiences/${slug}`,
  hosts: () => "/hosts",
  host: (slug: string) => `/hosts/${slug}`,
};
