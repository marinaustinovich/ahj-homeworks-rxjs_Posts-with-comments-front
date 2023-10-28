import { CommentData, PostWithComments } from "./types";
export declare class DOMService {
    createPostElement(data: PostWithComments): HTMLElement;
    createCommentElement(data: CommentData, el: HTMLElement): void;
}
