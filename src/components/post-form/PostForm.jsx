import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Button, Input, RTX } from '../index'
import { appendErrors, useForm } from 'react-hook-form'
import services from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'

function PostForm(post) {
    const navigate = useNavigate()
    const { register, handleSubmit, getValues, setValue, control, watch } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const userData = useSelector((state) => state.user.userData)

    const submit = async (data) => {
        if (post) {
            // Update post

            const file = data.image[0] ? services.uploadFile(data.image[0]) : null

            if (file) {
                services.delFile(post.featuredImages)
            }

            const dbPost = await services.updatePost(post.$id, { ...data, featuredImages: file ? file.$id : undefined })

            if (dbPost) {
                navigate(`/post/${dbPost.id}`)
            }

        } else {
            // Create new post
            const file = await services.uploadFile(data.image[0])

            if (file) {
                const fileId = file.$id
                data.featuredImages = fileId
                const dbPost = await services.createPost({ ...data, userId: userData.$id })

                if (dbPost) {
                    navigate(`/post/${dbPost.id}`)
                }


            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") return value
            .trim()
            .toLowerCase()
            .replace(/^[a-zA-Z\d]+/g, '-')

        return ''
    })


    React.useEffect(() => {

        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title,
                    { shouldValidate: true }
                ))
            }

        })

        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])



    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTX label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={services.getPreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm