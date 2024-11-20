import React, { useState } from 'react';
import axios from 'axios';

const GradeHelpPet = () => {
  const [speechText, setSpeechText] = useState("Click to generate speech!");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/GradeHelp/generate-content', {
        prompt: 'Tell me something about animals'
      });
      setSpeechText(response.data.response);
    } catch (error) {
      console.error("Error fetching content:", error);
      setSpeechText("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.leftContainer}>
        <div style={styles.speechBubble}>
          {loading ? "Thinking..." : speechText}
        </div>
        <img 
          src="https://i.etsystatic.com/20628809/r/il/a121f8/2294461568/il_570xN.2294461568_3r6f.jpg"  //https://i.etsystatic.com/32921179/r/il/c93c3b/5742960641/il_1588xN.5742960641_1u1r.jpg
          alt="Animal" 
          style={styles.animalImage}
        />
      </div>
      <div style={styles.rightContainer}>
        <button onClick={handleClick} style={styles.button}>
          Generate Speech
        </button>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
  },
  leftContainer: {
    position: 'relative',
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalImage: {
    width: '200px',
    height: 'auto',
    marginTop: '20px', // Adds space between the speech bubble and the image
  },
  speechBubble: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    backgroundColor: '#fff',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '200px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  }
};

export default GradeHelpPet;
