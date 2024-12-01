import React, { useState, useEffect } from 'react';

const GradeHelpPet = ({ selectedGrade }) => {
  const [speechText, setSpeechText] = useState("Click on a grade to generate speech!");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(selectedGrade)
    const fetchSpeech = async () => {
      if (!selectedGrade) {
        setSpeechText("Click on a grade to generate speech!");
        return;
      }

      setLoading(true);
      try {
        const prompt = `In three lines can you give me three websites and links that will help with ${selectedGrade.assignmentName}, in the course: ${selectedGrade.courseName}. If you are unsure just respond with websites that help with any course work, Dont respond with anything els ebut the websites names,  and an intro stating These three websites willl help you in assignment name in course name`;


        const response = await fetch('http://127.0.0.1:3004/GradeHelp/generate-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        const data = await response.json();
        setSpeechText(data.response);
      } catch (error) {
        console.error("Error fetching content:", error);
        setSpeechText("Oops! Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpeech();
  }, [selectedGrade]);

  return (
      <div style={styles.pageContainer}>
        <div style={styles.leftContainer}>
          <div style={styles.speechBubble}>
            {loading ? "Thinking..." : speechText}
          </div>
          <img
              src="https://i.etsystatic.com/20628809/r/il/a121f8/2294461568/il_570xN.2294461568_3r6f.jpg"
              alt="Animal"
              style={styles.animalImage}
          />
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
  animalImage: {
    width: '200px',
    height: 'auto',
    marginTop: '20px',
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
    maxWidth: '90%', // Adjust to fit smaller screens
    maxHeight: '50%', // Prevents overflow
    overflow: 'auto', // Adds scroll if needed
    fontSize: '16px',
    wordWrap: 'break-word', // Handles long text
    overflowWrap: 'break-word', // Alternative for word wrapping
  },
};


export default GradeHelpPet;