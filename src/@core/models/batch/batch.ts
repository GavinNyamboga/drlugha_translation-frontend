import {User} from "../user.model";

export interface Batch {
    batchNo: 1;
    description: string;
    linkUrl: string;
    numberOfSentences: number;
    source: string;
    uploader: User;
    uploaderId: number;
}
