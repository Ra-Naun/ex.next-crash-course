export async function getAllPostIds() {
    const response = await fetch(`${process.env.API_URL}/posts`);
    console.log("~~~| response: ", response);
    const posts = await response.json();

    console.log("~~~| posts: ", posts);

    // response.forEach(async (post) => {
    //     posts.push(await post.json());
    // });

    return posts.map((post) => {
        return {
            params: {
                id: `${post.id}`,
            },
        };
    });
}
