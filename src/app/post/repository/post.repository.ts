import { AbstractRepository } from "../../../lib/db/abstract.repository";
import { IPost, Post } from "../model/post.model";


class PostRepository extends AbstractRepository<IPost>{

    constructor(){
        super(Post);
    }
    async findByEmail(email:string) {
        return Post.findOne({email:email});
    }
}


export default new PostRepository();