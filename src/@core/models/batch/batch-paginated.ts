import { Batch } from "./batch";

export interface PaginatedBatchResponse {
  content: Batch[];
  totalElements: number;
  totalPages: number;
}
