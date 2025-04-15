// src/components/Testimonial.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust the path as needed
import './Testimonial.css'; // Make sure you have styles for testimonials

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from Supabase
  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
    } else {
      setTestimonials(data);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []); // Run once when component mounts

  return (
    <div className="testimonial-container">
      <h2>Client Testimonials</h2>
      <div className="testimonial-list">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial transition">
              {testimonial.image_url && (
                <img
                  src={testimonial.image_url}
                  alt={testimonial.name}
                  className="testimonial-photo"
                />
              )}
              <div className="testimonial-rating">★★★★★</div>
              <blockquote className="testimonial-text">
                "{testimonial.feedback}"
              </blockquote>
              <h4 className="testimonial-author">{testimonial.name}</h4>
              {testimonial.role && (
                <p className="testimonial-role">{testimonial.role}</p>
              )}
            </div>
          ))
        ) : (
          <p>No testimonials available.</p>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
