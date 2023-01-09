
import PostModel from '../models/Post.js';
export const getNewPosts = async (req, res) =>{
    try{
        const posts = await PostModel.find().populate('user').sort({"createdAt":-1})
        res.json(posts)
    }catch (err){
        console.log(err)
        res.status(500).json({
            message:"Cannot get new post"
        })
    }
}

export const getPopularPost = async (req,res) => {
    try {
        const posts = await PostModel.find().populate('user').sort({"viewsCount": -1})
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Cannot get new post"
        })
    }
}
export const getPostByTag = async (req,res) => {
    try {
        const posts = await PostModel.find({tags: req.params.id}).populate('user')
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Cannot get post by tag"
        })
    }
}
export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something wrong with tags',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something wrong with posts',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Cannot get a post',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Post no found',
                    });
                }

                res.json(doc);
            },
        ).populate('user');
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something wrong with posts',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Can`t delete post',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Post not found',
                    });
                }

                res.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Can`t get posts',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot save a post',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
               tags: req.body.tags,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot update a post',
        });
    }
};



export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                "$push": {comments : req.body}
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot add comment to post',
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                $pull:{comments: {commentId :req.body._id} }
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Cannot delete comment from post',
        });
    }
};

