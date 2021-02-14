import { useState, useEffect } from "react";
import { MainLayout } from "../../components/MainLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageContext, GetStaticProps } from "next";
import { MyPost } from "../../interfaces/post";
import { getAllPostIds } from "../../lib/posts";

interface PostPageProps {
    post: MyPost;
}

export default function Post({ post: serverPost }: PostPageProps) {
    const [post, setPost] = useState(serverPost);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const response = await fetch(`${process.env.API_URL}/posts/${router.query.id}`);
            const data = await response.json();
            setPost(data);
        }

        if (!serverPost) {
            load();
        }
    }, []);

    // if (!post) {
    //     return (
    //         <MainLayout>
    //             <p>Loading ...</p>
    //         </MainLayout>
    //     );
    // }

    if (router.isFallback) {
        return (
            <MainLayout>
                <p>Loading ...</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <h1>{post.title}</h1>
            <hr />
            <p>{post.body}</p>
            <Link href={"/posts"}>
                <a>Back to all posts</a>
            </Link>
        </MainLayout>
    );
}

interface PostNextPageContext extends NextPageContext {
    query: {
        id: string;
    };
}

//U____________________________________________________________________________________________________________
// Post.getInitialProps = async ({ query, req }: PostNextPageContext) => {
//     if (!req) {
//         return { post: null };
//     }

//     const response = await fetch(`${process.env.API_URL}/posts/${query.id}`);
//     const post: MyPost = await response.json();

//     return {
//         post,
//     };
// };

//ServerSideRendering__________________________________________________________________________________________

// export async function getServerSideProps({ query, req }: PostNextPageContext) {
//     const response = await fetch(`${process.env.API_URL}/posts/${query.id}`);
//     const post: MyPost = await response.json();

//     return {
//         props: { post },
//     };
// }

//Static Server Rendering__________________________________________________________________________________________

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const response = await fetch(`${process.env.API_URL}/posts/${params.id}`);

    const post: MyPost = await response.json();

    // if (!post.id) {
    //     return {
    //         redirect: {
    //             destination: "/",
    //             permanent: false,
    //         },
    //     };
    // }

    // OR

    if (!post.id) {
        return {
            notFound: true,
        };
    }

    return {
        props: { post },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every second
        revalidate: 1, // In seconds
    };
};

export const getStaticPaths = async () => {
    const paths = await getAllPostIds();
    paths.pop(2);

    return {
        paths,
        fallback: true,
    };
};
