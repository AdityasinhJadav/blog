import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import services from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            services.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        services.deletePost(post.$id).then((status) => {
            if (status) {
                services.delFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-10">
            <Container>
                <div className="max-w-3xl mx-auto">
                    {post.featuredImage && (
                        <div className="w-full mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <img
                                src={services.getPreview(post.featuredImage, { width: 1280 })}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}

                    <div className="mb-4 flex items-start justify-between gap-4">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {post.title}
                        </h1>
                        {isAuthor && (
                            <div className="shrink-0 flex items-center gap-2">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-500" className="!px-3 !py-2">Edit</Button>
                                </Link>
                                <Button bgColor="bg-red-500" className="!px-3 !py-2" onClick={deletePost}>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    <article className="browser-css text-gray-800 leading-7">
                        {parse(post.content)}
                    </article>
                </div>
            </Container>
        </div>
    ) : null;
}