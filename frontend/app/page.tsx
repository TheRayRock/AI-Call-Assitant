// "use client";

// import { useState, useEffect, useRef } from "react";

// declare global {
//   interface Window {
//     webkitSpeechRecognition: any;
//   }
// }

// let recognition: any = null;

// export default function Home() {
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const [isActive, setIsActive] = useState(false);
//   const assistantEnabled = useRef(false);

//   const startListening = () => {
//     if (isSpeaking) return;

//     const SpeechRecognition =
//       window.webkitSpeechRecognition || (window as any).SpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported");
//       return;
//     }

//     // const recognition = new SpeechRecognition();
//     if (!recognition) {
//       recognition = new SpeechRecognition();
//     }

//     recognition.lang = "hi-IN";

//     recognition.continuous = true;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       console.log("Voice recognition started");
//     };

//     recognition.onresult = async (event: any) => {
//       // const transcript = event.results[0][0].transcript;
//       const transcript = event.results[event.results.length - 1][0].transcript;

//       console.log("USER SAID:", transcript);

//       const lowerText = transcript.toLowerCase();

//       // if (lowerText.includes("वेक") || lowerText.includes("wake")) {
//       //   setIsActive(true);

//       //   const speech = new SpeechSynthesisUtterance("Yes, I am listening");

//       //   speech.lang = "en-IN";

//       //   window.speechSynthesis.speak(speech);

//       //   return;
//       // }

//       if (lowerText.includes("वेक") || lowerText.includes("wake")) {
//         assistantEnabled.current = true;

//         const speech = new SpeechSynthesisUtterance("Yes, I am listening");

//         speech.lang = "en-IN";

//         // window.speechSynthesis.speak(speech);

//         window.speechSynthesis.cancel();

//         window.speechSynthesis.speak(speech);

//         return;
//       }

//       if (lowerText.includes("quit") || lowerText.includes("बंद")) {
//         // setAssistantEnabled(false);
//         assistantEnabled.current = false;

//         const speech = new SpeechSynthesisUtterance("Okay shutting down");

//         speech.lang = "en-IN";

//         // window.speechSynthesis.speak(speech);
//         window.speechSynthesis.cancel();

//         window.speechSynthesis.speak(speech);

//         return;
//       }

//       // if (!isActive) return;

//       // if (!assistantEnabled) return;
//       if (!assistantEnabled.current) return;

//       setMessage(transcript);

//       await sendMessage(transcript);
//     };

//     recognition.onerror = (event: any) => {
//       console.log("Speech Error:", event.error);

//       if (event.error === "aborted") {
//         return;
//       }
//     };

//     recognition.onend = () => {
//       console.log("Voice recognition ended");
//     };

//     recognition.start();
//   };

//   const sendMessage = async (userMessage?: string) => {
//     const finalMessage = userMessage || message;

//     if (!finalMessage) return;

//     try {
//       setLoading(true);

//       const res = await fetch("http://192.168.1.8:8000/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: finalMessage,
//         }),
//       });

//       const data = await res.json();

//       console.log(data);

//       // SHOW RESPONSE
//       setResponse(data.response);

//       // AI SPEAK
//       const speech = new SpeechSynthesisUtterance(data.response);

//       speech.lang = "hi-IN";

//       speech.rate = 1;

//       setIsSpeaking(true);

//       speech.onstart = () => {
//         setIsSpeaking(true);

//         if (recognition) {
//           recognition.stop();
//         }

//         console.log("AI speaking...");
//       };

//       speech.onend = () => {
//         console.log("AI finished speaking");

//         setIsSpeaking(false);

//         setTimeout(() => {
//           console.log("Restarting mic...");

//           startListening();
//         }, 1000);
//       };

//       // window.speechSynthesis.speak(speech);
//       window.speechSynthesis.cancel();

//       window.speechSynthesis.speak(speech);
//     } catch (error) {
//       console.log(error);

//       alert("Backend Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">
//       <div className="w-full max-w-2xl space-y-5">
//         <h1 className="text-5xl font-bold text-center">AI Voice Assistant</h1>

//         <textarea
//           className="w-full p-5 rounded-xl bg-gray-900 border border-gray-700"
//           rows={5}
//           placeholder="Speak or type..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />

//         <div className="flex gap-4">
//           <button
//             onClick={startListening}
//             className="bg-red-500 px-6 py-3 rounded-lg font-bold"
//           >
//             🎤 Speak
//           </button>

//           <button
//             onClick={() => sendMessage()}
//             className="bg-white text-black px-6 py-3 rounded-lg font-bold"
//           >
//             {loading ? "Thinking..." : "Send"}
//           </button>
//         </div>

//         <div className="bg-gray-900 p-5 rounded-xl min-h-[200px] text-lg">
//           {response || "AI response appears here"}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

let recognition: any = null;

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [history, setHistory] = useState([]);

  const assistantEnabled = useRef(false);

  const startListening = () => {
    if (isSpeaking) return;

    const SpeechRecognition =
      window.webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    // CREATE ONLY ONCE
    if (!recognition) {
      recognition = new SpeechRecognition();

      recognition.lang = "hi-IN";

      recognition.continuous = true;

      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Assistant Listening...");
      };

      recognition.onresult = async (event: any) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;

        console.log("USER SAID:", transcript);

        const lowerText = transcript.toLowerCase();

        // WAKE WORD
        if (lowerText.includes("वेक") || lowerText.includes("wake")) {
          assistantEnabled.current = true;

          const speech = new SpeechSynthesisUtterance("Yes, I am listening");

          speech.lang = "en-IN";

          window.speechSynthesis.speak(speech);

          return;
        }

        // STOP COMMAND
        if (lowerText.includes("quit") || lowerText.includes("बंद")) {
          assistantEnabled.current = false;

          const speech = new SpeechSynthesisUtterance("Okay shutting down");

          speech.lang = "en-IN";

          window.speechSynthesis.speak(speech);

          return;
        }

        // IGNORE IF NOT ACTIVE
        if (!assistantEnabled.current) return;

        setMessage(transcript);

        await sendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.log("Speech Error:", event.error);
      };

      recognition.onend = () => {
        console.log("Recognition ended");

        setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            recognition.start();
          }
        }, 1000);
      };
    }

    recognition.start();
  };

  const sendMessage = async (userMessage?: string) => {
    const finalMessage = userMessage || message;

    if (!finalMessage) return;

    try {
      setLoading(true);

      const res = await fetch("http://192.168.222.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalMessage,
        }),
      });

      const data = await res.json();

      console.log(data);

      setResponse(data.response);
      fetchHistory();

      const speech = new SpeechSynthesisUtterance(data.response);

      speech.lang = "hi-IN";

      speech.rate = 1;

      speech.onstart = () => {
        setIsSpeaking(true);

        if (recognition) {
          recognition.stop();
        }

        console.log("AI speaking...");
      };

      speech.onend = () => {
        console.log("AI finished speaking");

        setIsSpeaking(false);

        setTimeout(() => {
          if (recognition) {
            recognition.start();
          }
        }, 1000);
      };

      window.speechSynthesis.cancel();

      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.log(error);

      alert("Backend Error");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://192.168.222.1:8000/history");

      const data = await res.json();

      setHistory(data.history);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">
      <div className="w-full max-w-2xl space-y-5">
        <h1 className="text-5xl font-bold text-center">AI Voice Assistant</h1>

        <textarea
          className="w-full p-5 rounded-xl bg-gray-900 border border-gray-700"
          rows={5}
          placeholder="Speak or type..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={startListening}
            className="bg-red-500 px-6 py-3 rounded-lg font-bold"
          >
            🎤 Start Assistant
          </button>

          <button
            onClick={() => sendMessage()}
            className="bg-white text-black px-6 py-3 rounded-lg font-bold"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>

        {/* <div className="bg-gray-900 p-5 rounded-xl min-h-[200px] text-lg">
          {response || "AI response appears here"}
        </div> */}
        <div className="bg-gray-900 p-5 rounded-xl space-y-4 max-h-[400px] overflow-y-auto">
          {history.map((chat: any, index) => (
            <div key={index} className="border-b border-gray-700 pb-4">
              <p className="text-blue-400">
                <strong>User:</strong> {chat.user}
              </p>

              <p className="text-green-400 mt-2">
                <strong>AI:</strong> {chat.assistant}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
