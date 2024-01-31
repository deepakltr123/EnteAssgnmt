"use client";
import { useEffect, useState } from 'react';
import './style.css'
import axios from 'axios';

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [after, setAfter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState(null);

  const fetchMemes = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://www.reddit.com/r/memes.json?&limit=20${after ? `&after=${after}` : ''}`
      );

      const newMemes = (response.data.data.children.slice(1) as any[]).map((post: any) => {
        const postData = post.data;
        const image = postData.url;
        const text = postData.title;
        const id = postData.id;

        return {
          id,
          image,
          text,
        };
      });

      setMemes((prevMemes) => [...prevMemes, ...newMemes]);
      setAfter(response.data.data.after);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching memes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
      fetchMemes();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, after]);

  const openModal = (meme) => {
    setSelectedMeme(meme);
  };

  const closeModal = () => {
    setSelectedMeme(null);
  };

  return (
    <main className="p-2 max-w-[1200px] mx-auto">
    <h2 className="text-3xl font-bold mt-5 tx">Memes</h2>
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {memes.map((meme, index) => (
        <div key={index} className="meme-container" onClick={() => openModal(meme)}>
          <img src={meme.image} alt={meme.text} className="meme-image" />
          <p className="meme-text" style={{ color: 'black', fontSize: '16px', fontWeight: 'bold' }}>{meme.text}</p>
        </div>
      ))}
    </div>

    {selectedMeme && (
      <div className="modal-overlay" onClick={closeModal} >
        <div className="modal">
          <img src={selectedMeme.image} alt={selectedMeme.text} className="full-resolution-image" />
          <p className="meme-text" style={{ color: 'black', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>{selectedMeme.text}</p>
        </div>
      </div>
    )}
  </main>
    );
    

}
{/* <div className="modal-overlay" onClick={closeModal}>
          <div className="modal">
            <img src={selectedMeme.image} alt={selectedMeme.text} className="full-resolution-image" />
          </div>
        </div> */}