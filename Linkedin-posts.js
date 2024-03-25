import axios from "axios";

const options = {
  method: 'GET',
  url: 'https://linkedin-api8.p.rapidapi.com/get-profile-posts',
  params: {
    username: 'triparnasamaddar'
  },
  headers: {
    'X-RapidAPI-Key': '3b8dad0975msha65b971ed8ac4b0p19475cjsne1f2bc96482a',
    'X-RapidAPI-Host': 'linkedin-api8.p.rapidapi.com'
  }
};

async function getuserpost() {
  try {
    const response = await axios.request(options);
    const responseData = response.data;

    // Check if the response contains posts
    if (responseData && responseData.posts) {
      const posts = responseData.posts;

      // Iterate over each post
      for (const post of posts) {
        console.log("Post URL:", post.postUrl);
        console.log("Posted Date:", post.postedAt);
        console.log("Total Reactions:", post.totalReactionCount);
        console.log("Like Count:", post.likeCount);
        console.log("Appreciation Count:", post.appreciationCount);
        console.log("Empathy Count:", post.empathyCount);
        // Extracting comments as text
        if (post.commentsCount > 0 && post.comments) {
          console.log("Comments:");
          for (const comment of post.comments) {
            console.log("- ", comment.text);
          }
        }
        console.log("---------------------------------------");
      }
    } else {
      console.log("No posts found in the response.");
    }
    
  } catch (error) {
    console.error(error);
  }
}

getuserpost();
