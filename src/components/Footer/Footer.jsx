import React from 'react'
import {Logo} from '../index'

function Footer() {
    return (
        <footer className="relative overflow-hidden py-8 bg-gray-50 border-t border-gray-200">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="flex items-start gap-4">
                    <Logo width="90px" />
                    <div className="text-sm leading-6 text-gray-600">
                        <p className="mb-2">
                            A modern blog built with React + Vite, Redux, and Appwrite (Auth, Database, Storage).
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><span className="font-medium text-gray-800">Browse posts:</span> View all published articles with cover images.</li>
                            <li><span className="font-medium text-gray-800">Read details:</span> Open a post to see the full content and hero image.</li>
                            <li><span className="font-medium text-gray-800">Authenticate:</span> Sign up and log in to manage your own posts.</li>
                            <li><span className="font-medium text-gray-800">Create & edit:</span> Write articles with rich text and upload a cover image.</li>
                            <li><span className="font-medium text-gray-800">Manage:</span> Update or delete your posts anytime.</li>
                            <li><span className="font-medium text-gray-800">Responsive UI:</span> Clean layout that works across devices.</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4 text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Blog Project. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer