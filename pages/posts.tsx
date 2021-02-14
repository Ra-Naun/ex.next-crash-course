import { useState, useEffect } from "react";
import Head from "next/head";
import { MainLayout } from "../components/MainLayout";
import Link from "next/link";
import { MyPost } from "../interfaces/post";
import { NextPageContext } from "next";
import { useRouter } from "next/router";

interface PostsPageProps {
    posts: MyPost[];
}

export default function Posts({ posts: serverPosts }: PostsPageProps) {
    const [posts, setPosts] = useState(serverPosts);

    useEffect(() => {
        async function load() {
            const response = await fetch(`${process.env.API_URL}/posts`);
            const json = await response.json();
            setPosts(json);
        }

        if (!serverPosts) {
            load();
        }
    }, []);

    if (!posts) {
        return (
            <MainLayout>
                <p>Loading ...</p>
            </MainLayout>
        );
    }

    const router = useRouter();
    if (router.isFallback) {
        return (
            <MainLayout>
                <p>Loading ...</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>Posts Page | Next Course</title>
            </Head>
            <h1>Posts Page</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link href={`/post/[id]`} as={`/post/${post.id}`}>
                            <a>{post.title}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </MainLayout>
    );
}

export const getStaticProps = async () => {
    const response = await fetch(`${process.env.API_URL}/posts`);
    const posts: MyPost[] = await response.json();

    return {
        props: { posts },
    };
};
