import ApiService from "../services/api.service";
import { IResponse } from "../services/types";
import BaseModel from "./base.model";
import IFeature from "./types/feature.type";

class FeatureModel extends BaseModel<IFeature> {
  constructor() {
    super("/feature");
  }

  async getByUserId(id: number): Promise<IResponse<IFeature[]>> {
    return ApiService.get<IFeature[]>(`/feature/user/${id}`);
  }
}

export default new FeatureModel();
