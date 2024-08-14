import http from "@/api";

export const newDiscoveries = params => {
  return http.get(`/scan/v2/results/new_discoveries`, params);
};

export const newDiscoveriesCount = params => {
  return http.get(`/scan/v2/results/new_discoveries/count`, params);
};

export const ignoreList = address => {
  return http.put(`/scan/v2/ignore_list/${address}`, {});
};
