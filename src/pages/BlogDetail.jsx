import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="blog-detail-page"><p>Loading...</p></div>;
  if (error) return <div className="blog-detail-page"><p>{`Error: ${error}`}</p></div>;
  if (!post) return <div className="blog-detail-page"><p>Post not found.</p></div>;

  return (
    <div className="blog-detail-page transition">
      <Link to="/blog" className="back-link">← Back to Blog</Link>

      <article className="blog-detail-article">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="detail-hero-image"
          />
        )}

        <h1 className="detail-title">{post.title}</h1>

        <div className="detail-meta">
          <span className="detail-date">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="detail-content">
          {post.content
            .split('\n')
            .filter(para => para.trim() !== '')
            .map((para, i) => (
              <p key={i}>{para}</p>
            ))}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
