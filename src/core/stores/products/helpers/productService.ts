import httpService from "../../../../services/httpService";

class ProductService {
  search = (search: string, url: string = "products") => {
    if (!search.trim()) {
      return [];
    }
    return httpService.get(`${url}/search?search=${search}`);
  };
}

export default new ProductService() as ProductService;
