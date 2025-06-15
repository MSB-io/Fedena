class FedenAI {
  constructor() {
    this.messages = [];
    this.isTyping = false;
    this.shouldStopTyping = false;
    this.chatSessions = [];
    this.currentSessionId = null;
    this.sidebarOpen = false;
    // Gemini API configuration
    this.geminiApiKey = "AIzaSyDHCJeUoxZCeLlfqU506k9YmVCqvnVd9UE"; // Replace with your actual Gemini API key
    this.geminiApiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.setupTextarea();
    this.initializeSidebar();
  }

  // Method to get API key (now returns hardcoded key)
  getGeminiApiKey() {
    return this.geminiApiKey;
  }

  // Method to ensure API key is available (simplified)
  async ensureApiKey() {
    return this.geminiApiKey;
  }

  bindElements() {
    this.sidebarContainer = document.getElementById("sidebarContainer");
    this.sidebarOverlay = document.getElementById("sidebarOverlay");
    this.hamburgerToggle = document.getElementById("hamburgerToggle");
    this.newChatBtn = document.getElementById("newChatBtn");
    this.chatHistory = document.getElementById("chatHistory");
    this.welcomeScreen = document.getElementById("welcomeScreen");
    this.messagesContainer = document.getElementById("messagesContainer");
    this.messageInput = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendButton");
    this.charCount = document.getElementById("charCount");
    this.loadingOverlay = document.getElementById("loadingOverlay");
    this.examplePrompts = document.querySelectorAll(".example-prompt");
  }

  bindEvents() {
    // Sidebar toggle events
    this.hamburgerToggle?.addEventListener("click", () => this.toggleSidebar());
    this.sidebarOverlay?.addEventListener("click", () => this.closeSidebar());
    this.newChatBtn?.addEventListener("click", () => this.startNewChat());

    // Send button click (handles both send and stop)
    this.sendButton.addEventListener("click", () => {
      if (this.isTyping) {
        this.stopAIResponse();
      } else {
        this.sendMessage();
      }
    });

    // Enter key handling
    this.messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (this.isTyping) {
          this.stopAIResponse();
        } else {
          this.sendMessage();
        }
      }
    });

    // Input change handling
    this.messageInput.addEventListener("input", () => {
      this.updateCharCount();
      this.updateSendButton();
      this.autoResize();
    });

    // Example prompts
    this.examplePrompts.forEach((prompt) => {
      prompt.addEventListener("click", () => {
        const promptText = prompt.querySelector(".text-sm").textContent;
        this.messageInput.value = promptText;
        this.updateCharCount();
        this.updateSendButton();
        this.messageInput.focus();
      });
    });

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());
  }

  initializeSidebar() {
    // Load chat sessions from localStorage
    this.loadChatSessions();
    this.renderChatHistory();

    // Start with sidebar closed
    this.sidebarOpen = false;
    this.updateSidebarDisplay();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.updateSidebarDisplay();
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.updateSidebarDisplay();
  }

  updateSidebarDisplay() {
    if (this.sidebarOpen) {
      // Show sliding sidebar
      this.sidebarContainer.classList.add("open");
      this.sidebarOverlay.classList.remove("opacity-0", "pointer-events-none");
      this.sidebarOverlay.classList.add("opacity-100");
    } else {
      // Hide sliding sidebar
      this.sidebarContainer.classList.remove("open");
      this.sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
      this.sidebarOverlay.classList.remove("opacity-100");
    }
  }

  handleResize() {
    // Floating sidebar works the same on all screen sizes
    // No special mobile/desktop handling needed
  }

  startNewChat() {
    // Save current chat if it has messages
    if (this.messages.length > 0) {
      this.saveCurrentChat();
    }

    // Reset chat state
    this.messages = [];
    this.currentSessionId = null;
    this.messagesContainer.innerHTML = "";
    this.messagesContainer.classList.add("hidden");
    this.welcomeScreen.classList.remove("hidden");

    // Close sidebar after starting new chat
    this.closeSidebar();

    // Update chat history to remove active state
    this.renderChatHistory();
  }

  saveCurrentChat() {
    if (this.messages.length === 0) return;

    const session = {
      id: this.currentSessionId || Date.now(),
      title: this.generateChatTitle(this.messages[0].content),
      messages: [...this.messages],
      timestamp: new Date(),
      lastUpdated: new Date(),
    };

    // Update existing session or add new one
    const existingIndex = this.chatSessions.findIndex(
      (s) => s.id == session.id // Use == instead of === for consistent comparison
    );
    if (existingIndex >= 0) {
      this.chatSessions[existingIndex] = session;
    } else {
      this.chatSessions.unshift(session);
    }

    // Keep only last 20 sessions
    this.chatSessions = this.chatSessions.slice(0, 20);

    this.currentSessionId = session.id;
    this.saveChatSessions();
    this.renderChatHistory();
  }

  loadChatSession(sessionId) {
    console.log('Loading chat session:', sessionId);
    const session = this.chatSessions.find((s) => s.id == sessionId); // Use == instead of === to handle string/number mismatch
    if (!session) {
      console.error('Session not found:', sessionId);
      console.log('Available sessions:', this.chatSessions.map(s => s.id));
      return;
    }

    console.log('Found session:', session);

    // Save current chat first
    if (this.messages.length > 0) {
      this.saveCurrentChat();
    }

    // Load session
    this.messages = [...session.messages];
    this.currentSessionId = sessionId;

    // Update UI
    this.messagesContainer.innerHTML = "";
    this.welcomeScreen.classList.add("hidden");
    this.messagesContainer.classList.remove("hidden");
    
    // Force display update
    this.messagesContainer.style.display = "block";

    // Render all messages
    console.log('Rendering messages:', this.messages.length);
    this.messages.forEach((message, index) => {
      console.log(`Rendering message ${index}:`, message);
      this.renderMessage(message);
    });
    
    // Scroll to bottom after a small delay to ensure messages are rendered
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);

    // Close sidebar after loading chat
    this.closeSidebar();

    // Update chat history to show active state
    this.renderChatHistory();
  }

  generateChatTitle(firstMessage) {
    const words = firstMessage.split(" ").slice(0, 6);
    return words.join(" ") + (firstMessage.split(" ").length > 6 ? "..." : "");
  }

  loadChatSessions() {
    try {
      const saved = localStorage.getItem("fedenai_chat_sessions");
      if (saved) {
        this.chatSessions = JSON.parse(saved);
        console.log('Loaded chat sessions:', this.chatSessions.length);
        // Ensure all sessions have proper structure
        this.chatSessions = this.chatSessions.filter(session => 
          session && session.id && session.messages && Array.isArray(session.messages)
        );
      } else {
        this.chatSessions = [];
        console.log('No saved chat sessions found');
      }
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      this.chatSessions = [];
    }
  }

  saveChatSessions() {
    try {
      localStorage.setItem(
        "fedenai_chat_sessions",
        JSON.stringify(this.chatSessions)
      );
    } catch (error) {
      console.error("Error saving chat sessions:", error);
    }
  }

  renderChatHistory() {
    if (!this.chatHistory) return;

    this.chatHistory.innerHTML = "";

    this.chatSessions.forEach((session) => {
      const chatItem = document.createElement("div");
      const isActive = this.currentSessionId == session.id; // Use == instead of === for consistency

      chatItem.className = `group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm bg-white border border-gray-200 mb-2 ${
        isActive
          ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
          : "text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-sm"
      }`;

      chatItem.innerHTML = `
                <div class="flex-1 min-w-0 mr-2">
                    <div class="truncate font-medium">${session.title}</div>
                    <div class="text-xs ${
                      isActive ? "text-red-500" : "text-gray-500"
                    }">${this.formatDate(session.timestamp)}</div>
                </div>
                <button class="delete-btn opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded transition-all" data-session-id="${
                  session.id
                }">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            `;

      // Add click event for loading chat session
      chatItem.addEventListener("click", (e) => {
        // Only load session if clicking on the main area, not the delete button
        if (!e.target.closest(".delete-btn")) {
          console.log('Chat item clicked, loading session:', session.id);
          e.preventDefault();
          e.stopPropagation();
          this.loadChatSession(session.id);
        }
      });

      // Add click event for delete button
      const deleteBtn = chatItem.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteChatSession(session.id);
      });

      this.chatHistory.appendChild(chatItem);
    });
  }

  deleteChatSession(sessionId) {
    this.chatSessions = this.chatSessions.filter((s) => s.id != sessionId); // Use != instead of !== for consistency
    this.saveChatSessions();
    this.renderChatHistory();

    // If deleting current session, start new chat
    if (this.currentSessionId == sessionId) { // Use == instead of === for consistency
      this.startNewChat();
    }
  }

  formatDate(date) {
    const now = new Date();
    const chatDate = new Date(date);
    const diffDays = Math.floor((now - chatDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return chatDate.toLocaleDateString();
  }

  setupTextarea() {
    this.updateCharCount();
    this.updateSendButton();
  }

  autoResize() {
    this.messageInput.style.height = "auto";
    this.messageInput.style.height =
      Math.min(this.messageInput.scrollHeight, 128) + "px";
  }

  updateCharCount() {
    const count = this.messageInput.value.length;
    // Only update if charCount element exists
    if (this.charCount) {
      this.charCount.textContent = `${count}/2000`;
      this.charCount.className =
        count > 1800 ? "text-red-500" : "text-gray-500";
    }
  }

  updateSendButton() {
    const hasText = this.messageInput.value.trim().length > 0;
    const withinLimit = this.messageInput.value.length <= 2000;
    
    if (this.isTyping) {
      // Show stop button when AI is typing
      this.sendButton.disabled = false;
      this.sendButton.className = "p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors";
      this.sendButton.innerHTML = `
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>
      `;
    } else {
      // Show send button when not typing
      this.sendButton.disabled = !hasText || !withinLimit;
      
      if (this.sendButton.disabled) {
        this.sendButton.className = "p-2 bg-gray-300 cursor-not-allowed rounded-full transition-colors";
      } else {
        this.sendButton.className = "p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors";
      }
      
      this.sendButton.innerHTML = `
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      `;
    }
  }

  async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || this.isTyping) return;

    // Hide welcome screen if first message
    if (this.messages.length === 0) {
      this.welcomeScreen.classList.add("hidden");
      this.messagesContainer.classList.remove("hidden");
    }

    // Add user message
    this.addMessage(message, "user");

    // Clear input
    this.messageInput.value = "";
    this.updateCharCount();
    this.updateSendButton();
    this.autoResize();

    // Set typing state
    this.isTyping = true;
    this.updateSendButton();

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate AI response
    await this.simulateAIResponse(message);

    // Save chat session after each exchange
    this.saveCurrentChat();
  }

  stopAIResponse() {
    console.log('Stopping AI response...');
    this.shouldStopTyping = true;
    this.isTyping = false;
    this.removeTypingIndicator();
    this.updateSendButton();
  }

  addMessage(content, sender) {
    const message = {
      id: Date.now(),
      content,
      sender,
      timestamp: new Date(),
    };

    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
  }

  renderMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${
      message.sender === "user" ? "justify-end" : "justify-start"
    }`;
    messageDiv.innerHTML = `
            <div class="max-w-3xl ${
              message.sender === "user" ? "order-2" : "order-1"
            }">
                <div class="flex items-start space-x-3 ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }">
                    <!-- Avatar -->
                    <div class="flex-shrink-0">
                        ${
                          message.sender === "user"
                            ? `<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                 <span class="text-white text-sm font-medium">U</span>
                               </div>`
                            : `<div class="w-8 h-8 flex items-center justify-center">
                                 <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                     <path d="M12 0L15.09 8.26L24 12L15.09 15.74L12 24L8.91 15.74L0 12L8.91 8.26L12 0Z" opacity="0.9"/>
                                 </svg>
                               </div>`
                        }
                    </div>
                    
                    <!-- Message Content -->
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-gray-700">
                                ${message.sender === "user" ? "You" : "FedenAI"}
                            </span>
                            <span class="text-xs text-gray-500">
                                ${this.formatTime(message.timestamp)}
                            </span>
                        </div>
                        <div class="prose prose-sm max-w-none">
                            <div class="${
                              message.sender === "user"
                                ? "bg-red-600 text-white rounded-2xl rounded-tr-sm px-4 py-3"
                                : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3"
                            }">
                                ${this.formatMessageContent(message.content)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.messagesContainer.appendChild(messageDiv);
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing-indicator";
    typingDiv.className = "flex justify-start";
    typingDiv.innerHTML = `
            <div class="max-w-3xl">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 flex items-center justify-center">
                            <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0L15.09 8.26L24 12L15.09 15.74L12 24L8.91 15.74L0 12L8.91 8.26L12 0Z" opacity="0.9"/>
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-gray-700">FedenAI</span>
                            <span class="text-xs text-gray-500">typing...</span>
                        </div>
                        <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div class="flex space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async simulateAIResponse(userMessage) {
    this.shouldStopTyping = false; // Reset stop flag
    
    try {
      // Call Gemini API with hardcoded key
      const response = await this.callGeminiAPI(userMessage, this.geminiApiKey);

      if (this.shouldStopTyping) {
        console.log('AI response stopped by user');
        return;
      }

      this.removeTypingIndicator();

      // Type the AI response
      await this.typeMessage(response);
    } catch (error) {
      if (this.shouldStopTyping) {
        console.log('AI response stopped by user during error handling');
        return;
      }
      
      console.error("Detailed error getting AI response:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      this.removeTypingIndicator();

      // Fallback to local responses if API fails
      let fallbackResponse;

      if (error.message.includes("API key") || error.message.includes("400")) {
        fallbackResponse =
          "I'm currently experiencing some connection issues with the advanced AI service. Let me help you with a basic response:\n\n" +
          this.generateAIResponse(userMessage);
      } else if (
        error.message.includes("quota") ||
        error.message.includes("429")
      ) {
        fallbackResponse =
          "The AI service quota has been reached. Here's a helpful response based on your question:\n\n" +
          this.generateAIResponse(userMessage);
      } else if (
        error.message.includes("CORS") ||
        error.message.includes("blocked")
      ) {
        fallbackResponse =
          "Network access is restricted in this environment. Let me provide a helpful response:\n\n" +
          this.generateAIResponse(userMessage);
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("network")
      ) {
        fallbackResponse =
          "I'm having network connectivity issues. Here's an offline response to help you:\n\n" +
          this.generateAIResponse(userMessage);
      } else {
        fallbackResponse =
          "I encountered a temporary issue, but I can still help! Here's my response:\n\n" +
          this.generateAIResponse(userMessage);
      }

      await this.typeMessage(fallbackResponse);
    }

    this.isTyping = false;
    this.shouldStopTyping = false;
    this.updateSendButton();
  }

  async callGeminiAPI(userMessage, apiKey) {
    const url = `${this.geminiApiUrl}?key=${apiKey}`;

    console.log(
      "Making API request to:",
      url.replace(apiKey, "API_KEY_HIDDEN")
    );

    // Prepare the prompt with educational context
    const prompt = `You are FedenAI, an intelligent educational assistant for the Fedena school management system. 
        
Your role is to help with:
- Educational topics and academic questions
- Study strategies and learning techniques
- School management and administrative queries
- Student guidance and academic planning
- General educational support

Please provide helpful, accurate, and educational responses. Keep your answers concise but informative.

User question: ${userMessage}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        if (response.status === 400) {
          throw new Error(
            `Invalid API key or request format. Response: ${errorText}`
          );
        } else if (response.status === 403) {
          throw new Error(
            `API access forbidden. Check your API key permissions. Response: ${errorText}`
          );
        } else if (response.status === 429) {
          throw new Error(`API quota exceeded. Response: ${errorText}`);
        } else {
          throw new Error(
            `API request failed with status ${response.status}. Response: ${errorText}`
          );
        }
      }

      const data = await response.json();
      console.log("API Response data:", data);

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error("Unexpected API response format");
      }
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }
  }

  async typeMessage(content) {
    const message = {
      id: Date.now(),
      content: "",
      sender: "ai",
      timestamp: new Date(),
    };

    this.messages.push(message);

    // Create message element with unique ID for targeting
    const messageId = `message-${message.id}`;
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex justify-start";
    messageDiv.innerHTML = `
            <div class="max-w-3xl">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 flex items-center justify-center">
                            <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0L15.09 8.26L24 12L15.09 15.74L12 24L8.91 15.74L0 12L8.91 8.26L12 0Z" opacity="0.9"/>
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-sm font-medium text-gray-700">FedenAI</span>
                            <span class="text-xs text-gray-500">${this.formatTime(
                              message.timestamp
                            )}</span>
                        </div>
                        <div class="prose prose-sm max-w-none">
                            <div class="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                                <span id="${messageId}"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.messagesContainer.appendChild(messageDiv);

    // Get the message content span by ID
    const messageContentSpan = document.getElementById(messageId);

    // Type effect
    const words = content.split(" ");
    for (let i = 0; i < words.length; i++) {
      // Check if user wants to stop typing
      if (this.shouldStopTyping) {
        console.log('Typing stopped by user');
        // Add remaining content immediately
        message.content = content;
        messageContentSpan.innerHTML = this.formatMessageContent(message.content);
        this.scrollToBottom();
        return;
      }
      
      message.content += (i > 0 ? " " : "") + words[i];
      messageContentSpan.innerHTML = this.formatMessageContent(message.content);
      this.scrollToBottom();
      await new Promise((resolve) =>
        setTimeout(resolve, 50 + Math.random() * 50)
      );
    }
  }

  generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Educational responses based on keywords
    if (lowerMessage.includes("quantum") || lowerMessage.includes("physics")) {
      return "Quantum physics is fascinating! It's the branch of physics that studies matter and energy at the smallest scales. Key concepts include wave-particle duality, superposition, and quantum entanglement. Would you like me to explain any specific quantum phenomenon?";
    }

    if (
      lowerMessage.includes("study") &&
      (lowerMessage.includes("tip") || lowerMessage.includes("help"))
    ) {
      return "Here are some effective study tips:\n\n1. **Active Recall**: Test yourself regularly instead of just re-reading\n2. **Spaced Repetition**: Review material at increasing intervals\n3. **Pomodoro Technique**: Study in 25-minute focused sessions\n4. **Elaborative Learning**: Connect new information to what you already know\n5. **Practice Testing**: Use practice exams and quizzes\n\nWhat subject are you studying? I can provide more specific strategies!";
    }

    if (lowerMessage.includes("math") || lowerMessage.includes("equation")) {
      return "I'd be happy to help with math! Whether it's algebra, calculus, geometry, or statistics, I can:\n\n• Explain mathematical concepts step-by-step\n• Help solve equations and problems\n• Provide practice examples\n• Suggest learning resources\n\nWhat specific math topic or problem are you working on?";
    }

    if (lowerMessage.includes("schedule") || lowerMessage.includes("plan")) {
      return "Creating a good study schedule is crucial for academic success! Here's how to build an effective one:\n\n1. **Assess your time**: List all commitments and available study hours\n2. **Prioritize subjects**: Focus more time on challenging or important topics\n3. **Break into chunks**: Divide large topics into manageable sessions\n4. **Include breaks**: Rest is essential for retention\n5. **Be realistic**: Don't overpack your schedule\n6. **Review regularly**: Adjust based on what's working\n\nWould you like help creating a specific schedule for your courses?";
    }

    if (lowerMessage.includes("exam") || lowerMessage.includes("test")) {
      return "Exam preparation is key to academic success! Here's a comprehensive approach:\n\n**Before the exam:**\n• Start reviewing 2-3 weeks early\n• Create a study timeline\n• Use active recall and practice tests\n• Form study groups for discussion\n• Get enough sleep and maintain good nutrition\n\n**During the exam:**\n• Read instructions carefully\n• Manage your time wisely\n• Start with questions you know well\n• Review your answers if time permits\n\nWhat type of exam are you preparing for?";
    }

    if (
      lowerMessage.includes("motivation") ||
      lowerMessage.includes("procrastination")
    ) {
      return "Staying motivated can be challenging! Here are some strategies that work:\n\n**Beat Procrastination:**\n• Break tasks into smaller, manageable parts\n• Use the '2-minute rule' - if it takes less than 2 minutes, do it now\n• Remove distractions from your study space\n• Reward yourself for completing tasks\n\n**Stay Motivated:**\n• Set clear, achievable goals\n• Track your progress visually\n• Remember your 'why' - your long-term objectives\n• Celebrate small wins along the way\n\nWhat's your biggest challenge with staying motivated?";
    }

    // Default educational response
    const responses = [
      "That's an interesting question! I'm here to help with your educational journey. Could you provide a bit more context so I can give you the most helpful response?",
      "Great question! As an educational AI assistant, I can help with various academic topics, study strategies, and learning techniques. What specific area would you like to explore?",
      "I'd love to help you learn more about that topic! Could you tell me more about what specifically you're trying to understand or accomplish?",
      "Excellent! Education is all about curiosity and asking questions. Let me know how I can best assist you with your learning goals.",
      "That's a thoughtful inquiry! I'm designed to support your educational needs. What subject or learning challenge can I help you tackle today?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  formatMessageContent(content) {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>")
      .replace(/•/g, "•");
  }

  formatTime(timestamp) {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 10);
  }
}

// Initialize the chat application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.fedenAI = new FedenAI();
});

// Export for potential external use
window.FedenAI = FedenAI;
