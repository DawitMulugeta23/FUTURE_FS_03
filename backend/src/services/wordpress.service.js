const axios = require("axios");

const getBlogPosts = async (perPage = 5) => {
  try {
    const response = await axios.get(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        params: {
          per_page: perPage,
          _embed: true,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("WordPress API error:", error.message);
    return [];
  }
};

const getPostById = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts/${id}`,
      {
        params: {
          _embed: true,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("WordPress API error:", error.message);
    return null;
  }
};

module.exports = {
  getBlogPosts,
  getPostById,
};
