import React, { useState, useEffect, useRef } from "react";
import { Menu, Send, Paperclip, X, Plus, Home, Bookmark, Bot, PencilRuler, Brain } from "lucide-react";
import Header from "../pages/Dashboardpages/Header";
import axios from "axios";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Define constants for bot types
const BOT_TYPES = {
  NORMAL: "normal",
  CAREER: "career",
  MATH: "math"
};

// API endpoint for backend
const API_ENDPOINT = "http://127.0.0.1:5000/api/chatbot";

const Chatbot = () => {
  // State variables
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBotType, setSelectedBotType] = useState(BOT_TYPES.NORMAL);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Bot configurations
  const botConfig = {
    [BOT_TYPES.NORMAL]: {
      name: "General Assistant",
      greeting: "Hello, how can I assist you today?",
      color: "#49ABB0",
      icon: <Bot size={24} />,
    },
    [BOT_TYPES.CAREER]: {
      name: "Career Guide",
      greeting: "Hi there! I'm your career guidance assistant. What career questions do you have?",
      color: "#E195AB",
      icon: <PencilRuler size={24} />,
    },
    [BOT_TYPES.MATH]: {
      name: "Math Tutor",
      greeting: "Welcome to math tutoring! Ask me any math problem or concept you'd like help with.",
      color: "#FFA500",
      icon: <Brain size={24} />,
    }
  };

  const sendmessagetogemini = async (message) => { 
    try {
        const response = await axios.post(`${API_ENDPOINT}/askdoubt`, {
            question: message,
            botType: selectedBotType
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            // Add bot response to chat
            setMessages(prev => [...prev, {
                text: response.data.data.response,
                sender: 'bot',
                timestamp: new Date()
            }]);

            return response.data.data.response;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, {
            text: 'Sorry, I encountered an error. Please try again.',
            sender: 'bot',
            isError: true,
            timestamp: new Date()
        }]);
        throw error;
    }
  };

  // Fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message when changing bot type
  useEffect(() => {
    if (!currentChatId) {
      setMessages([{ text: botConfig[selectedBotType].greeting, sender: "bot" }]);
    }
  }, [selectedBotType]);

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.get(`${API_ENDPOINT}/history`);
      
      if (response.data.success) {
        setChatHistory(response.data.data.history);
      } else {
        throw new Error(response.data.message);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching chat history:", err);
      setError("Failed to load chat history");
      setIsLoading(false);
    }
  };

  const MessageContent = ({ text, isError, hasRetryButton, originalMessage, originalFile }) => {
    const inlineMathRegex = /\$([^$]+)\$/g;
    const blockMathRegex = /\$\$([^$]+)\$\$/g;
    
    const [copySuccess, setCopySuccess] = useState(null);
  
    const copyToClipboard = (expression) => {
      navigator.clipboard.writeText(expression).then(() => {
        setCopySuccess(expression);
        setTimeout(() => setCopySuccess(null), 1500);
      });
    };
    
    // For error messages with retry button
    if (isError && hasRetryButton) {
      return (
        <div className="flex flex-col">
          <span className="whitespace-pre-wrap mb-2">{text}</span>
          <button 
            onClick={() => handleRetry(originalMessage, originalFile)}
            className="self-start bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
          >
            Try again
          </button>
        </div>
      );
    }
    
    if (!text.match(inlineMathRegex) && !text.match(blockMathRegex)) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }
    
    let parts = [];
    let lastIndex = 0;
    let match;
    
    const processedForBlock = [];
    let currentText = text;
    
    while ((match = blockMathRegex.exec(currentText)) !== null) {
      if (match.index > lastIndex) {
        processedForBlock.push(currentText.substring(lastIndex, match.index));
      }
      processedForBlock.push({ type: 'blockMath', formula: match[1] });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < currentText.length) {
      processedForBlock.push(currentText.substring(lastIndex));
    }
    
    for (const part of processedForBlock) {
      if (typeof part === 'string') {
        lastIndex = 0;
        while ((match = inlineMathRegex.exec(part)) !== null) {
          if (match.index > lastIndex) {
            parts.push(part.substring(lastIndex, match.index));
          }
          parts.push({ type: 'inlineMath', formula: match[1] });
          lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < part.length) {
          parts.push(part.substring(lastIndex));
        }
      } else {
        parts.push(part);
      }
    }
    
    return (
      <div className="math-content whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (typeof part === 'string') {
            return <span key={index}>{part}</span>;
          } else if (part.type === 'inlineMath') {
            return (
              <span key={index} className="inline-math relative mx-1">
                <InlineMath math={part.formula} />
                <button 
                  onClick={() => copyToClipboard(part.formula)} 
                  className="copy-btn absolute opacity-0 group-hover:opacity-100 right-0 top-0 bg-gray-100 hover:bg-gray-200 p-1 rounded text-xs"
                >
                  {copySuccess === part.formula ? "Copied!" : "Copy"}
                </button>
              </span>
            );
          } else if (part.type === 'blockMath') {
            return (
              <div key={index} className="math-canvas group relative my-4 py-3 px-2 bg-gray-50 rounded-lg overflow-x-auto">
                <BlockMath math={part.formula} />
                <button 
                  onClick={() => copyToClipboard(part.formula)} 
                  className="absolute opacity-0 group-hover:opacity-100 right-2 top-2 bg-white hover:bg-gray-200 text-gray-600 p-1 rounded text-xs border shadow-sm"
                >
                  {copySuccess === part.formula ? "Copied!" : "Copy"}
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const createNewChat = () => {
    setCurrentChatId(null);
    setMessages([{ text: botConfig[selectedBotType].greeting, sender: "bot" }]);
    setFile(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChat = async (chatId) => {
    try {
      setIsLoading(true);
      
      const mockChat = {
        id: chatId,
        botType: chatHistory.find(chat => chat.id === chatId)?.botType || BOT_TYPES.NORMAL,
        messages: [
          { text: botConfig[chatHistory.find(chat => chat.id === chatId)?.botType || BOT_TYPES.NORMAL].greeting, sender: "bot" },
          { text: "Can you help me with this question?", sender: "user" },
          { text: "Of course! I'd be happy to help. Please provide more details about your question.", sender: "bot" }
        ]
      };
      
      setSelectedBotType(mockChat.botType);
      setMessages(mockChat.messages);
      setCurrentChatId(chatId);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading chat:", err);
      setError("Failed to load chat");
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (prompt.trim() === "" && !file) return;
    
    const userMessage = prompt.trim();
    setPrompt("");
    
    let messageContent = userMessage;
    if (file) {
      messageContent = userMessage ? `${userMessage} [Attached file: ${file.name}]` : `[Attached file: ${file.name}]`;
    }
    
    const newMessages = [...messages, { text: messageContent, sender: "user", hasAttachment: !!file }];
    setMessages(newMessages);
    
    setIsTyping(true);
    
    try {
      // If file is attached, use the file upload endpoint
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        if (userMessage) formData.append("context", userMessage);
        formData.append("botType", selectedBotType);
        if (currentChatId) formData.append("chatId", currentChatId);
        
        const response = await axios.post(`${API_ENDPOINT}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          setMessages(prevMessages => [...prevMessages, { 
            text: response.data.data.response, 
            sender: "bot" 
          }]);
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // For text-only messages
        await sendmessagetogemini(userMessage);
      }
      
      // Create new chat entry if this is a new conversation
      if (!currentChatId) {
        const newChatId = `chat_${Date.now()}`;
        setCurrentChatId(newChatId);
        
        const newChatEntry = {
          id: newChatId,
          title: userMessage.slice(0, 30) + (userMessage.length > 30 ? "..." : ""),
          timestamp: new Date().toISOString(),
          botType: selectedBotType
        };
        
        setChatHistory([newChatEntry, ...chatHistory]);
      }
      
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setIsTyping(false);
      setMessages(prevMessages => [...prevMessages, { 
        text: "Sorry, I encountered an error processing your request. Please try again.",
        sender: "bot",
        isError: true,
        hasRetryButton: true,
        originalMessage: userMessage,
        originalFile: file
      }]);
      setFile(null);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = async (originalMessage, originalFile) => {
    // Remove the error message
    setMessages(prevMessages => prevMessages.slice(0, -1));
    
    // Reset the file if there was one
    if (originalFile) {
      setFile(originalFile);
    }
    
    // Set the prompt back to the original message
    setPrompt(originalMessage || "");
    
    // Small delay to show the reset happened
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // If there was an original message, resend it
    if (originalMessage || originalFile) {
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const changeBotType = (type) => {
    if (messages.length > 1 && !currentChatId) {
      if (window.confirm("Changing AI type will start a new conversation. Continue?")) {
        setSelectedBotType(type);
        createNewChat();
      }
    } else {
      setSelectedBotType(type);
      if (!currentChatId) createNewChat();
    }
  };

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .math-canvas {
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        transition: all 0.2s;
      }
      
      .math-canvas:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: rgba(0, 0, 0, 0.2);
      }
      
      .inline-math {
        padding: 0 2px;
        border-radius: 4px;
      }
      
      .inline-math:hover {
        background-color: rgba(0, 0, 0, 0.03);
      }
      
      .katex-display {
        margin: 0.5em 0;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0.5em 0;
      }
      
      .math-canvas .katex-display {
        max-width: 100%;
        overflow-x: auto;
        padding-bottom: 8px;
      }
      
      .math-canvas::-webkit-scrollbar {
        height: 4px;
      }
      
      .math-canvas::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
      }
      
      .math-canvas::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="flex w-full h-screen bg-[#ECE7CA]">
      <Header />
      
      <div className="flex-1 flex flex-col ml-30 bg-transparent p-6 pt-10 mt-10">
        <div className="flex mb-4 space-x-2">
          {Object.entries(BOT_TYPES).map(([key, value]) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 ${
                selectedBotType === value 
                  ? `bg-blue-200 text-black border-b-2 border-${botConfig[value].color}` 
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => changeBotType(value)}
            >
              {botConfig[value].icon}
              {botConfig[value].name}
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-t-lg p-4 flex items-center shadow-sm">
          <div 
            className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white"
            style={{ backgroundColor: botConfig[selectedBotType].color }}
          >
            {botConfig[selectedBotType].icon}
          </div>
          <div>
            <h2 className="font-semibold text-black">{botConfig[selectedBotType].name}</h2>
            <p className="text-xs text-black">
              {currentChatId 
                ? `Chat ID: ${currentChatId}` 
                : "New conversation"
              }
            </p>
          </div>
          <button 
            className="ml-auto bg-teal-600 hover:bg-teal-500 p-2 rounded-full"
            onClick={createNewChat}
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white rounded-b-lg p-6 mb-4 shadow-sm">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div 
                      className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white self-end mb-1"
                      style={{ backgroundColor: botConfig[selectedBotType].color }}
                    >
                      {botConfig[selectedBotType].icon}
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-3 rounded-lg max-w-md shadow-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : msg.isError 
                          ? "bg-red-100 text-red-800" 
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <MessageContent 
                      text={msg.text} 
                      isError={msg.isError}
                      hasRetryButton={msg.hasRetryButton}
                      originalMessage={msg.originalMessage}
                      originalFile={msg.originalFile}
                    />
                  </div>
                  
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full ml-2 bg-blue-700 flex items-center justify-center text-white self-end mb-1">
                      <span className="text-xs">You</span>
                    </div>
                  )}
                </div>
              ))}
                      
              {isTyping && (
                <div className="flex justify-start">
                  <div 
                    className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white self-end mb-1"
                    style={{ backgroundColor: botConfig[selectedBotType].color }}
                  >
                    {botConfig[selectedBotType].icon}
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg shadow-sm rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {file && (
          <div className="bg-blue-50 p-2 mb-2 rounded-lg flex items-center">
            <span className="text-sm text-gray-700 truncate flex-1">
              {file.name}
            </span>
            <button 
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="p-4 bg-white flex items-center space-x-2 border border-gray-200 rounded-lg shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          <button
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>
          
          <textarea
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-gray-800 px-4 py-2 focus:outline-none resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />

          <button
            className="bg-blue-600 text-white p-3 rounded-full shadow-sm hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={isTyping || (prompt.trim() === "" && !file)}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <div
        className={`bg-[#49ABB0] mr-5 shadow-lg p-4 pt-10 mt-25 flex flex-col transition-all duration-300 rounded-lg ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Chat History</span>
              <button
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <button 
              onClick={createNewChat} 
              className="w-full bg-white text-[#49ABB0] mb-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="text-center text-white py-4">
                  No chat history yet
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    className={`w-full text-left px-4 py-3 rounded-lg shadow-sm flex items-start gap-2 ${
                      currentChatId === chat.id
                        ? "bg-white text-[#49ABB0] font-semibold"
                        : "bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100"
                    }`}
                    onClick={() => loadChat(chat.id)}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1"
                      style={{ backgroundColor: botConfig[chat.botType].color }}
                    >
                      {botConfig[chat.botType].icon}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm">{chat.title}</p>
                      <p className="text-xs opacity-60">{formatDate(chat.timestamp)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="mt-6 space-y-2 pt-4 border-t border-white border-opacity-20">
              <button className="w-full bg-white bg-opacity-80 text-gray-700 px-4 py-3 rounded-lg hover:bg-opacity-100 transition shadow-sm flex items-center gap-2">
                <Home size={18} />
                <span>Home</span>
              </button>
              <button className="w-full bg-white bg-opacity-80 text-gray-700 px-4 py-3 rounded-lg hover:bg-opacity-100 transition shadow-sm flex items-center gap-2">
                <Bookmark size={18} />
                <span>Saved</span>
              </button>
            </div>
          </>
        ) : (
          <button
            className="bg-white text-[#49ABB0] w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition absolute top-14 right-6"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;