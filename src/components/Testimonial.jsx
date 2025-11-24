import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Testimonial.css';

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex] = useState(0);

  // Helper function to display stars with filled/empty characters
  const renderStars = (num) => {
    const maxStars = 5;
    const filledStars = '★'.repeat(num);
    const emptyStars = '☆'.repeat(maxStars - num);
    return filledStars + emptyStars;
  };

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
  }, []);


  // Render the current testimonial (if any) in its own box
  return (
    <div className="testimonial-container">
      <h2>Client Testimonials</h2>
      {testimonials.length > 0 ? (
        <div className="testimonial-box transition">
          {testimonials[currentIndex].image_url && (
            <img
              src={testimonials[currentIndex].image_url}
              alt={testimonials[currentIndex].name}
              className="testimonial-photo"
            />
          )}
          <div className="testimonial-rating">
            {renderStars(testimonials[currentIndex].stars || 0)}
          </div>
          <blockquote className="testimonial-text">
            "{testimonials[currentIndex].feedback}"
          </blockquote>
          <h4 className="testimonial-author">
            {testimonials[currentIndex].name}
          </h4>
          {testimonials[currentIndex].role && (
            <p className="testimonial-role">
              {testimonials[currentIndex].role}
            </p>
          )}
        </div>
      ) : (
        <p>No testimonials available.</p>
      )}
      {/* Show navigation controls only if there's more than one testimonial */}

    </div>
  );
};

export default Testimonial;
