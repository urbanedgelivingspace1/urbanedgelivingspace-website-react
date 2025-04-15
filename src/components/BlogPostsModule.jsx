// src/components/BlogPostsModule.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const BlogPostsModule = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingPost, setEditingPost] = useState({});
  const [editingImageFile, setEditingImageFile] = useState(null);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleAddImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const addPost = async (e) => {
    e.preventDefault();

    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) {
      alert('Please log in to add a blog post.');
      return;
    }

    let image_url = '';
    try {
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `blog/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('blog_posts')
        .insert([{ ...newPost, image_url }]);

      if (error) throw error;

      setNewPost({ title: '', content: '' });
      setImageFile(null);
      fetchPosts();
    } catch (err) {
      alert('Failed to add blog post: ' + err.message);
    }
  };

  const deletePost = async (id) => {
    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) {
      alert('Please log in to delete a blog post.');
      return;
    }

    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditingPost({ title: post.title, content: post.content });
  };

  const handleEditChange = (e) => {
    setEditingPost({ ...editingPost, [e.target.name]: e.target.value });
  };

  const handleEditImageChange = (e) => {
    setEditingImageFile(e.target.files[0]);
  };

  const updatePost = async (e, id) => {
    e.preventDefault();

    const isLoggedIn = localStorage.getItem('admin-auth') === 'true';
    if (!isLoggedIn) {
      alert('Please log in to update a blog post.');
      return;
    }

    let updatedPost = { ...editingPost };
    try {
      if (editingImageFile) {
        const ext = editingImageFile.name.split('.').pop();
        const path = `blog/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(path, editingImageFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(path);
          updatedPost.image_url = urlData.publicUrl;
        }
      }

      await supabase.from('blog_posts').update(updatedPost).eq('id', id);
      setEditingId(null);
      setEditingImageFile(null);
      fetchPosts();
    } catch (err) {
      alert('Failed to update blog post: ' + err.message);
    }
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2>📝 Blog Posts</h2>

      <form onSubmit={addPost} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={newPost.title}
          onChange={handleAddChange}
          required
        />
        <textarea
          name="content"
          placeholder="Blog Content"
          value={newPost.content}
          onChange={handleAddChange}
          required
          rows={5}
        />
        <input type="file" accept="image/*" onChange={handleAddImageChange} />
        <button type="submit">Add Post</button>
      </form>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}
          >
            {editingId === post.id ? (
              <form onSubmit={(e) => updatePost(e, post.id)}>
                <input
                  type="text"
                  name="title"
                  value={editingPost.title}
                  onChange={handleEditChange}
                  required
                />
                <textarea
                  name="content"
                  value={editingPost.content}
                  onChange={handleEditChange}
                  required
                  rows={4}
                />
                <input type="file" accept="image/*" onChange={handleEditImageChange} />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                  />
                )}
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => startEdit(post)}>Edit</button>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={{ marginLeft: '1rem', color: 'red' }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostsModule;
