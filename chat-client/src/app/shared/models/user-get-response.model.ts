import {UserModel} from "./user.model";

export interface UserGetResponseModel {
    user: UserModel;
    conversations: any[];
}
