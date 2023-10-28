import { Observable } from "rxjs";
import { PostData, CommentData } from "./types";
interface ApiResponse<T> {
    data: T;
}
export declare class DataService {
    private url;
    constructor(url: string);
    getPosts(): Observable<ApiResponse<PostData[]>>;
    getCommentsForPost(postId: string): Observable<ApiResponse<CommentData[]>>;
    getDataWithInterval(intervalTime: number): Observable<ApiResponse<PostData[]>>;
}
export {};
