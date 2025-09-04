import conf from "../conf/conf";
import { Client, ID, Databases, Query, Storage } from "appwrite";


export class Services {
    client = new Client()
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjId)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async createPost({ title, slug, content, status, userId, featuredImage = null }) {
        if (!userId) {
            throw new Error("User ID is required to create a post");
        }
        
        try {
            // For now, create post without image until featuredImage attribute is added to database
            const postData = {
                title,
                content,
                status,
                userId,
                ...(featuredImage ? { featuredImage } : {})
            };
            
            console.log("Creating post with data:", postData);
            
            try {
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug || ID.unique(),
                    postData
                );
            } catch (err) {
                // Fallback if collection doesn't have 'featuredImage'
                if (
                    featuredImage &&
                    typeof err?.message === 'string' &&
                    err.message.includes('Unknown attribute: "featuredImage"')
                ) {
                    const fallbackData = {
                        title,
                        content,
                        status,
                        userId,
                        image: featuredImage,
                    };
                    try {
                        return await this.databases.createDocument(
                            conf.appwriteDatabaseId,
                            conf.appwriteCollectionId,
                            slug || ID.unique(),
                            fallbackData
                        );
                    } catch (err2) {
                        // Final fallback: create without any image attribute
                        if (
                            typeof err2?.message === 'string' &&
                            err2.message.includes('Unknown attribute: "image"')
                        ) {
                            console.warn('[Appwrite] Collection has no image fields (featuredImage/image). Creating post without image attribute.');
                            const minimalData = { title, content, status, userId };
                            return await this.databases.createDocument(
                                conf.appwriteDatabaseId,
                                conf.appwriteCollectionId,
                                slug || ID.unique(),
                                minimalData
                            );
                        }
                        throw err2;
                    }
                }
                throw err;
            }
        } catch (error) {
            console.error("Error in createPost:", error);
            throw error;
        }
    }

    async updatePost(slug, { title, content, image, status, oldImage = null, featuredImage = null }) {
        try {
            let fileId = featuredImage ?? oldImage;

            if (image) {
                // Upload new image
                const file = await this.uploadFile(image);
                if (file) {
                    fileId = file.$id;
                    // Delete old image if it exists
                    if (oldImage) {
                        await this.delFile(oldImage);
                    }
                }
            }

            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredImage: fileId,
                        status,
                    }
                );
            } catch (err) {
                if (
                    fileId &&
                    typeof err?.message === 'string' &&
                    err.message.includes('Unknown attribute: "featuredImage"')
                ) {
                    try {
                        return await this.databases.updateDocument(
                            conf.appwriteDatabaseId,
                            conf.appwriteCollectionId,
                            slug,
                            {
                                title,
                                content,
                                image: fileId,
                                status,
                            }
                        );
                    } catch (err2) {
                        if (
                            typeof err2?.message === 'string' &&
                            err2.message.includes('Unknown attribute: "image"')
                        ) {
                            console.warn('[Appwrite] Collection has no image fields (featuredImage/image). Updating post without image attribute.');
                            return await this.databases.updateDocument(
                                conf.appwriteDatabaseId,
                                conf.appwriteCollectionId,
                                slug,
                                {
                                    title,
                                    content,
                                    status,
                                }
                            );
                        }
                        throw err2;
                    }
                }
                throw err;
            }
        } catch (error) {
            throw error;
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log(error) 
            return false
        }
    }

    async getPost(slug) {
        try {
            const doc = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            // Normalize to always expose 'featuredImage'
            return {
                ...doc,
                featuredImage: doc.featuredImage ?? doc.image ?? null,
            };
        } catch (error) {
            return error;
        }
    }


    async getPosts(queries = [Query.equal('status', 'active')]) {
        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
            if (!res || !Array.isArray(res.documents)) return res;
            return {
                ...res,
                documents: res.documents.map((doc) => ({
                    ...doc,
                    featuredImage: doc.featuredImage ?? doc.image ?? null,
                })),
            };
        } catch (error) {
            throw error;
        }
    }


    //files
    async uploadFile(file) {
        if (!file) return null;

        // Accept FileList or File/Blob
        const candidate = (typeof FileList !== 'undefined' && file instanceof FileList)
            ? file[0]
            : file;

        if (!candidate) return null; // nothing selected

        // Validate candidate is a Blob/File
        const isBlob = typeof Blob !== 'undefined' && candidate instanceof Blob;
        if (!isBlob) {
            const typeInfo = Object.prototype.toString.call(candidate);
            throw new Error(`Invalid file input: expected File/Blob, got ${typeInfo}`);
        }

        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                candidate
            );
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    async delFile(fileId){
        if (!fileId) return;
        
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.error("Error deleting file:", error);
            return false;
        }
    }

    getPreview(fileId, { width = 800, height = 0 } = {}) {
        if (!fileId) return null;

        try {
            // If a full URL is provided already
            if (typeof fileId === 'string' && /^(https?:)?\/\//.test(fileId)) {
                return fileId;
            }

            // If an Appwrite file object is passed
            const id = typeof fileId === 'object' && fileId?.$id ? fileId.$id : fileId;

            // Always use raw file view to avoid transformation 403 on free plans
            const viewUrl = this.bucket.getFileView(
                conf.appwriteBucketId,
                id
            );
            return typeof viewUrl === 'string' ? viewUrl : viewUrl?.toString?.() || null;
        } catch (error) {
            console.error("Error getting file preview:", error);
            return null;
        }
    }




}

const services = new Services()

export default services

