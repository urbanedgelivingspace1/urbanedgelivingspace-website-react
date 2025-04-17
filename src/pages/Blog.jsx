// src/pages/Blog.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setPosts(data);
      setLoading(false);
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="blog-page transition">
      <header className="blog-header">
        <h1>Our Blog</h1>
        <p>Explore insights, tips, and market trends in luxury real estate.</p>
      </header>
      
      {/* Main content wrapped in semantic <main> */}
      <main className="blog-posts">
        {loading ? (
          <p className="loading-message">Loading blog posts...</p>
        ) : posts.length === 0 ? (
          <p className="no-posts">No blog posts available yet. Stay tuned!</p>
        ) : (
          posts.map(post => (
            <article 
              key={post.id} 
              className="blog-post transition"
              aria-labelledby={`post-title-${post.id}`}
            >
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt={`Thumbnail for ${post.title}`} 
                  className="blog-thumbnail" 
                  loading="lazy" 
                />
              )}
              <h2 id={`post-title-${post.id}`}>{post.title}</h2>
              <p className="date">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="excerpt">{post.content.substring(0, 120)}...</p>
              {/* Correct Link for Path-based Routing */}
              <Link to={`/blog/${post.id}`} className="btn btn-primary transition" role="button">
                Read More
              </Link>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default Blog;
