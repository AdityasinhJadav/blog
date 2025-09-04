import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Input, RTX, Select } from '../index'
import { useForm } from 'react-hook-form'
import services from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'

function PostForm({post}) {
    const navigate = useNavigate()
    const { register, handleSubmit, getValues, setValue, control, watch } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [autoSlug, setAutoSlug] = useState(true);

    React.useEffect(() => {
        if (!authStatus) {
            navigate('/login');
        }
    }, [authStatus, navigate]);

    const submit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (!authStatus || !userData) {
            setError("Please log in to create a post");
            navigate('/login');
            setIsSubmitting(false);
            return;
        }

        if (post) {
            // Update post
            try {
                let file = null;
                if (data.image && data.image[0]) {
                    file = await services.uploadFile(data.image[0]);
                    if (file && post.featuredImage) {
                        await services.delFile(post.featuredImage);
                    }
                }

                const dbPost = await services.updatePost(post.$id, {
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    // send the resolved fileId only; do NOT pass raw image/FileList
                    featuredImage: file ? file.$id : post.featuredImage,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } catch (error) {
                console.error("Error updating post:", error);
            } finally {
                setIsSubmitting(false);
            }

        } else {
            // Create new post
            try {
                if (!userData || !userData.$id) {
                    const errorMsg = "Please log in to create a post";
                    console.error(errorMsg);
                    alert(errorMsg);
                    navigate('/login');
                    setIsSubmitting(false);
                    return;
                }

                let fileId = null;
                if (data.image && data.image[0]) {
                    console.log("Uploading file...");
                    const file = await services.uploadFile(data.image[0]);
                    if (file) {
                        fileId = file.$id;
                        console.log("File uploaded successfully:", fileId);
                    }
                }

                const dbPost = await services.createPost({
                    title: data.title,
                    content: data.content,
                    slug: data.slug,
                    status: data.status,
                    userId: userData.$id,
                    featuredImage: fileId,
                });

                if (dbPost) {
                    console.log("Post created successfully:", dbPost.$id);
                    navigate(`/post/${dbPost.$id}`);
                }
            } catch (error) {
                console.error("Error creating post:", error);
                // You might want to show this error to the user
                alert("Error creating post: " + error.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") 
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d]+/g, '-')
                .replace(/^-+|-+$/g, '')

        return ''
    })


    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title' && autoSlug) {
                const slug = slugTransform(value.title);
                if (slug !== getValues('slug')) {
                    setValue('slug', slug, { shouldValidate: true });
                }
            }
            if (name === 'image') {
                const file = value.image && value.image[0] ? value.image[0] : null;
                if (file) {
                    const url = URL.createObjectURL(file);
                    setPreviewUrl((prev) => {
                        if (prev && prev !== url) URL.revokeObjectURL(prev);
                        return url;
                    });
                } else {
                    setPreviewUrl((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return null;
                    });
                }
            }
        });

        return () => {
            subscription.unsubscribe();
            setPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
        };
    }, [watch, slugTransform, setValue, getValues, autoSlug]);



    const titleVal = watch('title') || '';
    const contentVal = watch('content') || '';
    const wordCount = contentVal.trim() ? contentVal.trim().split(/\s+/).length : 0;

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-full lg:w-2/3 px-2">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <Input
                            label="Title :"
                            placeholder="Title"
                            className="mb-1"
                            {...register("title", { required: true })}
                        />
                        <div className="text-xs text-gray-500 mb-3">{titleVal.length} characters</div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                        <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={autoSlug}
                            onChange={(e) => setAutoSlug(e.target.checked)}
                        />
                        Auto slug
                    </label>
                </div>

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        const v = autoSlug ? slugTransform(e.currentTarget.value) : e.currentTarget.value;
                        setValue("slug", v, { shouldValidate: true });
                    }}
                    disabled={autoSlug}
                />
                <div className="mb-2">
                    <RTX label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
                <div className="text-xs text-gray-500 mb-4">{wordCount} words</div>
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image")}
                    onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                            const url = URL.createObjectURL(file);
                            setPreviewUrl((prev) => {
                                if (prev && prev !== url) URL.revokeObjectURL(prev);
                                return url;
                            });
                        } else {
                            setPreviewUrl((prev) => {
                                if (prev) URL.revokeObjectURL(prev);
                                return null;
                            });
                        }
                    }}
                />
                {(previewUrl || (post && post.featuredImage)) && (
                    <div className="w-full mb-4">
                        <img
                            src={previewUrl || services.getPreview(post?.featuredImage)}
                            alt={post?.title || 'Selected image preview'}
                            className="rounded-lg w-full object-cover max-h-64"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <div className="flex gap-3">
                    <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" disabled={isSubmitting}
                        onClick={() => setValue('status', 'active')}
                    >
                        {post ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Publishing...' : 'Publish')}
                    </Button>
                    {!post && (
                        <Button type="button" className="w-full bg-blue text-gray-800 hover:bg-gray-300" disabled={isSubmitting}
                            onClick={() => { setValue('status', 'inactive'); handleSubmit(submit)(); }}
                        >
                            {isSubmitting ? 'Saving…' : 'Save as draft'}
                        </Button>
                    )}
                </div>
                <div className="mt-3">
                    <Button type="button" className="w-full bg-blue border border-gray-300 text-gray-700 hover:bg-gray-50" disabled={isSubmitting}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
               </div>
            </div>
        </form>
    )
}

export default PostForm