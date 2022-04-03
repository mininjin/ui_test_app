const url = "https://zipcloud.ibsnet.co.jp/api/search?zipcode=";

type Response = {
  results: { address1: string; address2: string; address3: string }[];
};

export const getAddress = async (zipcode: string) => {
  let result: string | undefined = undefined;
  try {
    const res = await fetch(url + zipcode);
    const { results } = (await res.json()) as Response;
    result = "";
    if (results) {
      const prefecture = results
        .map((v) => v.address1)
        .reduce((prev, cur) => (prev == cur ? prev : ""));
      const city = results
        .map((v) => v.address2)
        .reduce((prev, cur) => (prev == cur ? prev : ""));
      const town = results
        .map((v) => v.address3)
        .reduce((prev, cur) => (prev == cur ? prev : ""));
      result = prefecture + city + town;
    }
  } catch (error) {
    console.error(error);
  }
  return result;
};
