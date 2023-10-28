import { CommentData,PostWithComments  } from "./types";
import { formatTime } from "./utils";

export class DOMService {
    createPostElement(data: PostWithComments): HTMLElement {
        const post = document.createElement("div");
        post.classList.add("post");
    
        const wrapperDataAuthor = document.createElement("div");
        wrapperDataAuthor.classList.add("wrapper-data-author");
        const avatar = document.createElement("img");
        avatar.src = data.avatar;
        avatar.classList.add("avatar");
        const dataAuthor = document.createElement("div");
        dataAuthor.classList.add("data-author");
        const author = document.createElement("span");
        author.textContent = data.author;
        author.classList.add("author");
        const timestamp = document.createElement("span");
        timestamp.textContent = formatTime(data.created);
        timestamp.classList.add("timestamp");
        dataAuthor.appendChild(author);
        dataAuthor.appendChild(timestamp);
        wrapperDataAuthor.appendChild(avatar);
        wrapperDataAuthor.appendChild(dataAuthor);
    
        const contentPost = document.createElement("div");
        contentPost.classList.add("content-post");
        const title = document.createElement("h3");
        title.textContent = data.title;
        const imagePost = document.createElement("img");
        imagePost.src = data.image;
        imagePost.classList.add("image-post");
        contentPost.appendChild(title);
        contentPost.appendChild(imagePost);
    
        const comments = document.createElement("div");
        comments.classList.add("comments");
        const commentsTitle = document.createElement("h4");
        commentsTitle.textContent = "Latest comments";
        comments.appendChild(commentsTitle);
    
        const loadCommentsButton = document.createElement("button");
        loadCommentsButton.classList.add("load-comments");
        loadCommentsButton.textContent = "Load More";
    
        post.appendChild(wrapperDataAuthor);
        post.appendChild(contentPost);
        post.appendChild(comments);
        post.appendChild(loadCommentsButton);
    
        return post;
    }
  
    createCommentElement(data: CommentData, el: HTMLElement): void {
        const commentsList = el.querySelector(".comments");
    
        if (!commentsList) return;
      
        const commentEl = document.createElement("div");
        commentEl.classList.add("comment-wrapper");
      
        const avatar = document.createElement("img");
        avatar.src = data.avatar;
        avatar.classList.add("avatar-comment");
      
        const wrapperContentComment = document.createElement("div");
        wrapperContentComment.classList.add("wrapper-content-comment");
      
        const author = document.createElement("span");
        author.textContent = data.author;
        author.classList.add("author-comment");
      
        const content = document.createElement("span");
        content.textContent = data.content;
        content.classList.add("content-comment");
      
        const timestamp = document.createElement("div");
        timestamp.textContent = formatTime(data.created);
        timestamp.classList.add("timestamp-comment");
      
        wrapperContentComment.appendChild(author);
        wrapperContentComment.appendChild(content);
      
        commentEl.appendChild(avatar);
        commentEl.appendChild(wrapperContentComment);
        commentEl.appendChild(timestamp);
      
        commentsList.appendChild(commentEl);
    }
  }