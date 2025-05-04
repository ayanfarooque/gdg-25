import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import '../components/header.dart';
import '../components/footer.dart';
import '../components/chatSidebar.dart';
import 'dart:math';
import '../components/constants.dart'; // Create this to store your API URLs

class AiLanding extends StatefulWidget {
  @override
  State<AiLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<AiLanding>
    with SingleTickerProviderStateMixin {
  // Your existing variables
  int _selectedIndex = 3;
  TextEditingController _messageController = TextEditingController();
  String? _selectedSubject;
  List<String> _subjects = [
    "Math",
    "Science",
    "History",
    "English",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology"
  ];
  bool _isSidebarVisible = false;
  bool _isLoading = false;
  bool _isTyping = false;
  late AnimationController _typingController;

  // API related variables
  final String _baseUrl =
      "http://localhost:5000/api"; // Update with your actual API URL
  String _studentId = "student001"; // This should come from auth/storage

  List<Map<String, String>> _previousChats = [];
  List<dynamic> _fullChatData = [];
  Map<String, dynamic>? _selectedChat;

  // Theme colors - keep as is
  final Color studentPrimaryColor = const Color.fromARGB(255, 73, 171, 176);
  final Color backgroundColor = const Color.fromARGB(255, 236, 231, 202);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = Colors.amber;

  // Chat capabilities - keep as is
  final List<Map<String, dynamic>> _capabilities = [
    // Your existing capabilities
  ];

  void _searchChats(String query) {
    // This would filter the previous chats based on the search query
    // For now, we're just printing it
    print('Search query: $query');
  }

  // Toggle sidebar
  void _toggleSidebar() {
    setState(() {
      _isSidebarVisible = !_isSidebarVisible;
    });
  }

  // Handle navigation
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0:
        Navigator.pushReplacementNamed(context, '/');
        break;
      case 1:
        Navigator.pushReplacementNamed(context, '/assignment');
        break;
      case 2:
        Navigator.pushReplacementNamed(context, '/community');
        break;
      case 3:
        // Already on AI page
        break;
      case 4:
        Navigator.pushReplacementNamed(context, '/resources');
        break;
      case 5:
        Navigator.pushReplacementNamed(context, '/classroom');
        break;
    }
  }

  // Image picker method stub
  Future<void> _pickAttachment() async {
    // To implement with image_picker package
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Attachment feature coming soon!')),
    );
  }

  // Camera method stub
  Future<void> _takePicture() async {
    // To implement with image_picker package
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Camera feature coming soon!')),
    );
  }

  @override
  void initState() {
    super.initState();
    _loadChatHistory(); // Replace with API-based loading
    _typingController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _typingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Header section
                Container(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  color: studentPrimaryColor,
                  child: Header(
                    onProfileTap: () {
                      Navigator.pushNamed(context, '/profile');
                    },
                    onNotificationTap: () {
                      Navigator.pushNamed(context, '/notifications');
                    },
                    profileImage: 'assets/images/image3.png',
                    welcomeText: "ASK ME ANYTHING",
                  ),
                ),

                // Main chat area
                Expanded(
                  child: Stack(
                    children: [
                      // Chat messages area
                      _selectedChat == null
                          ? _buildWelcomeScreen()
                          : _buildChatMessages(),

                      // Typing indicator
                      if (_isTyping) _buildTypingIndicator(),
                    ],
                  ),
                ),

                // Message input area
                _buildEnhancedMessageInput(),
              ],
            ),

            // Sidebar for chat history
            if (_isSidebarVisible) _buildSidebar(),
          ],
        ),
      ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  // Load chat history from API
  Future<void> _loadChatHistory() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Make API call to get chat history
      final response = await http.get(
        Uri.parse('$_baseUrl/chatbot/student/$_studentId'),
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
          // 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        if (data['success'] == true && data['chats'] != null) {
          // Store full chat data
          _fullChatData = data['chats'];

          // Convert API data to the format needed for previousChats
          List<Map<String, String>> chatList = [];

          for (var chat in data['chats']) {
            if (chat['responses'] != null && chat['responses'].isNotEmpty) {
              // Format the date from timestamp
              String dateStr = '';
              if (chat['responses'][0]['timeStamp'] != null) {
                final DateTime timestamp =
                    DateTime.parse(chat['responses'][0]['timeStamp']);
                dateStr =
                    '${timestamp.day} ${_getMonthAbbreviation(timestamp.month)}';
              }

              // Get the first few words of the prompt for preview
              String promptPreview = chat['responses'][0]['prompt'] ?? '';
              if (promptPreview.length > 30) {
                promptPreview = promptPreview.substring(0, 30) + '...';
              }

              chatList.add({
                'date': dateStr,
                'chatId': chat['chatId'],
                'studentId': chat['studentId'],
                'prompt': promptPreview,
              });
            }
          }

          setState(() {
            _previousChats = chatList;
            _isLoading = false;
          });
        } else {
          setState(() {
            _previousChats = [];
            _isLoading = false;
          });
        }
      } else {
        throw Exception('Failed to load chat history');
      }
    } catch (e) {
      print('Error loading chat history: $e');
      setState(() {
        _isLoading = false;
      });

      // Fallback to local data for demo if API fails
      _loadLocalChatData();
    }
  }

  // Fallback method to load local chat data
  Future<void> _loadLocalChatData() async {
    try {
      final String response =
          await rootBundle.loadString('lib/data/doubtChat.json');
      final List<dynamic> data = await json.decode(response);

      _fullChatData = data;

      // Process local data as before
      List<Map<String, String>> chatList = [];

      for (var chat in data) {
        // Your existing processing logic
        if (chat['responses'] != null && chat['responses'].isNotEmpty) {
          String dateStr = '';
          if (chat['responses'][0]['timeStamp'] != null) {
            final DateTime timestamp =
                DateTime.parse(chat['responses'][0]['timeStamp']);
            dateStr =
                '${timestamp.day} ${_getMonthAbbreviation(timestamp.month)}';
          }

          String promptPreview = chat['responses'][0]['prompt'] ?? '';
          if (promptPreview.length > 30) {
            promptPreview = promptPreview.substring(0, 30) + '...';
          }

          chatList.add({
            'date': dateStr,
            'chatId': chat['chatId'],
            'studentId': chat['studentId'],
            'prompt': promptPreview,
          });
        }
      }

      setState(() {
        _previousChats = chatList;
      });
    } catch (e) {
      print('Error loading local chat data: $e');
    }
  }

  // Load specific chat from API
  Future<void> _loadChat(String chatId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/chatbot/$chatId/responses'),
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          setState(() {
            // Find the chat in the existing data and update it with the full data
            _selectedChat = {
              'chatId': chatId,
              'studentId': _studentId,
              'responses': data['responses']
            };
            _isSidebarVisible = false;
          });
        }
      } else {
        // Fallback to local data
        _selectLocalChat(chatId);
      }
    } catch (e) {
      print('Error loading chat: $e');
      _selectLocalChat(chatId);
    }
  }

  // Fallback to select chat from local data
  void _selectLocalChat(String chatId) {
    final selectedChat = _fullChatData.firstWhere(
      (chat) => chat['chatId'] == chatId,
      orElse: () => <String, dynamic>{},
    );

    setState(() {
      _selectedChat = selectedChat;
      _isSidebarVisible = false;
    });
  }

  // Send message to API
  Future<void> _sendMessage() async {
    final message = _messageController.text.trim();
    if (message.isEmpty) return;

    setState(() {
      _isTyping = true;
    });

    String chatId;
    if (_selectedChat != null) {
      chatId = _selectedChat!['chatId'];
    } else {
      // Generate new chatId for new conversation
      chatId = 'chat_${DateTime.now().millisecondsSinceEpoch}';

      // Create a temporary chat entry for UI
      setState(() {
        _selectedChat = {
          'chatId': chatId,
          'studentId': _studentId,
          'responses': []
        };
      });

      // Add to previous chats with temporary data
      _previousChats.insert(0, {
        'date':
            '${DateTime.now().day} ${_getMonthAbbreviation(DateTime.now().month)}',
        'chatId': chatId,
        'studentId': _studentId,
        'prompt':
            message.length > 30 ? message.substring(0, 30) + '...' : message,
      });
    }

    // Add the user's message to the UI immediately
    setState(() {
      if (_selectedChat!.containsKey('responses')) {
        _selectedChat!['responses'].add({
          'prompt': message,
          'output': '', // Will be filled by API response
          'timeStamp': DateTime.now().toIso8601String(),
        });
      } else {
        _selectedChat!['responses'] = [
          {
            'prompt': message,
            'output': '',
            'timeStamp': DateTime.now().toIso8601String(),
          }
        ];
      }
    });

    _messageController.clear();

    // Make API call to send message
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/chatbot/ask-doubt'),
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
        body: json.encode({
          'chatId': chatId,
          'studentId': _studentId,
          'subjectId': _selectedSubject ?? 'general',
          'prompt': message
        }),
      );

      setState(() {
        _isTyping = false;
      });

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          // Update the chat with the API response
          final doubtChat = data['doubtChat'];
          final latestResponse = doubtChat['responses'].last;

          setState(() {
            // Update the last message with the AI response
            final lastResponseIndex = _selectedChat!['responses'].length - 1;
            _selectedChat!['responses'][lastResponseIndex]['output'] =
                latestResponse['output'];

            // Update full chat data and previous chats if this is a new chat
            if (!_fullChatData.any((chat) => chat['chatId'] == chatId)) {
              _fullChatData.add(_selectedChat);
            }
          });
        }
      } else {
        // Fallback to local response
        _addLocalResponse(message);
      }
    } catch (e) {
      print('Error sending message: $e');
      setState(() {
        _isTyping = false;
      });
      // Fallback to local response
      _addLocalResponse(message);
    }
  }

  // Fallback to generate local response
  void _addLocalResponse(String message) {
    setState(() {
      final lastResponseIndex = _selectedChat!['responses'].length - 1;
      _selectedChat!['responses'][lastResponseIndex]['output'] =
          _generateAIResponse(message);
    });
  }

  // Create a new chat
  Future<void> _createNewChat() async {
    setState(() {
      _selectedChat = null;
    });
  }

  // Helper methods from your existing code (keep these as is)
  String _getMonthAbbreviation(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months[month - 1];
  }

  // Your existing local AI response generator (for fallback) - keep as is
  String _generateAIResponse(String query) {
    // Keep your existing implementation as fallback
    query = query.toLowerCase();

    // Basic response templates
    if (query.contains('newton') || query.contains('law of motion')) {
      return "Newton's three laws of motion are fundamental principles in classical mechanics:\n\n1. First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force.\n\n2. Second Law: The force acting on an object is equal to the mass of that object times its acceleration (F = ma).\n\n3. Third Law: For every action, there is an equal and opposite reaction.";
    }

    // Other existing responses

    return "I understand you're asking about \"$query\". This is an important topic in its field.\n\nTo answer your question thoroughly, I would need to provide context, definitions, and examples.\n\nWould you like me to elaborate on any specific aspect of this topic or provide a more detailed explanation?";
  }

  // Update to use API-based chat selection
  void _selectChat(String chatId) {
    _loadChat(chatId);
  }

  // UI COMPONENTS - MOVED INSIDE THE CLASS
  Widget _buildWelcomeScreen() {
    return Column(
      children: [
        // Subject selection
        Container(
          padding: const EdgeInsets.all(16),
          color: backgroundColor,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select a subject for your question:',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _subjects.map((subject) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(subject),
                        selected: _selectedSubject == subject,
                        onSelected: (selected) {
                          setState(() {
                            _selectedSubject = selected ? subject : null;
                          });
                        },
                        selectedColor: studentPrimaryColor,
                        labelStyle: TextStyle(
                          color: _selectedSubject == subject
                              ? Colors.white
                              : Colors.black87,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        // AI capabilities
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'I can help with:',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    childAspectRatio: 1.5,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    children: _buildCapabilityCards(),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Previous conversations:',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _isLoading
                      ? Center(
                          child: CircularProgressIndicator(
                              color: studentPrimaryColor))
                      : _previousChats.isEmpty
                          ? Center(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(
                                  'No previous conversations found.\nStart a new chat to see history here.',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ),
                            )
                          : Column(
                              children: _previousChats
                                  .take(3) // Show just a few recent chats
                                  .map((chat) => _buildChatHistoryItem(chat))
                                  .toList(),
                            ),
                  if (_previousChats.length > 3)
                    Align(
                      alignment: Alignment.center,
                      child: TextButton(
                        onPressed: _toggleSidebar,
                        child: Text(
                          'View all conversations',
                          style: TextStyle(color: studentPrimaryColor),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildChatMessages() {
    final responses = _selectedChat?['responses'] ?? [];

    return Column(
      children: [
        // Chat header with back button
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 5,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              IconButton(
                icon: Icon(Icons.arrow_back),
                onPressed: _createNewChat,
                color: studentPrimaryColor,
              ),
              Expanded(
                child: Text(
                  'AI Assistant',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              IconButton(
                icon: Icon(Icons.history),
                onPressed: _toggleSidebar,
                color: studentPrimaryColor,
              ),
            ],
          ),
        ),

        // Chat messages
        Expanded(
          child: responses.isEmpty
              ? Center(
                  child: Text(
                    'No messages yet. Start typing to chat!',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: responses.length,
                  itemBuilder: (context, index) {
                    final response = responses[index];
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // User's message
                        _buildUserMessage(response['prompt']),
                        const SizedBox(height: 16),
                        // AI's response
                        _buildAIResponse(response['output']),
                        const SizedBox(height: 24),
                      ],
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildUserMessage(String message) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        constraints: BoxConstraints(maxWidth: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: studentPrimaryColor,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16),
            bottomLeft: Radius.circular(16),
            bottomRight: Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Text(
          message,
          style: const TextStyle(color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildAIResponse(String message) {
    if (message.isEmpty) {
      return _buildTypingBubble();
    }

    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(maxWidth: 300),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(16),
            bottomLeft: Radius.circular(16),
            bottomRight: Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Text(message),
      ),
    );
  }

  Widget _buildTypingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(maxWidth: 100),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(16),
            bottomLeft: Radius.circular(16),
            bottomRight: Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            _buildDot(),
            const SizedBox(width: 5),
            _buildDot(),
            const SizedBox(width: 5),
            _buildDot(),
          ],
        ),
      ),
    );
  }

  Widget _buildDot() {
    return AnimatedBuilder(
      animation: _typingController,
      builder: (context, child) {
        final double opacity =
            sin(_typingController.value * pi * 2) * 0.5 + 0.5;
        return Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: Colors.grey.withOpacity(opacity),
            shape: BoxShape.circle,
          ),
        );
      },
    );
  }

  Widget _buildTypingIndicator() {
    return Positioned(
      left: 0,
      right: 0,
      bottom: 0,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        color: Colors.black.withOpacity(0.7),
        child: Row(
          children: [
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'AI is thinking...',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSidebar() {
    return Positioned(
      top: 0,
      bottom: 0,
      right: 0,
      width: MediaQuery.of(context).size.width * 0.75,
      child: GestureDetector(
        onTap: () {},
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: Offset(-5, 0),
              ),
            ],
          ),
          child: Column(
            children: [
              // Sidebar header
              Container(
                padding: const EdgeInsets.all(16),
                color: studentPrimaryColor,
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Chat History',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.close),
                      onPressed: _toggleSidebar,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),

              // Search box
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search conversations',
                    prefixIcon: Icon(Icons.search),
                    fillColor: Colors.grey[100],
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: _searchChats,
                ),
              ),

              // Chat history list
              Expanded(
                child: _isLoading
                    ? Center(
                        child: CircularProgressIndicator(
                            color: studentPrimaryColor))
                    : _previousChats.isEmpty
                        ? Center(
                            child: Text(
                              'No chat history found',
                              style: TextStyle(color: Colors.grey[600]),
                            ),
                          )
                        : ListView.builder(
                            itemCount: _previousChats.length,
                            itemBuilder: (context, index) {
                              return _buildChatHistoryItem(
                                  _previousChats[index]);
                            },
                          ),
              ),

              // New chat button
              Padding(
                padding: const EdgeInsets.all(16),
                child: ElevatedButton.icon(
                  onPressed: () {
                    _createNewChat();
                    _toggleSidebar();
                  },
                  icon: Icon(Icons.add),
                  label: Text('New Chat'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: studentPrimaryColor,
                    foregroundColor: Colors.white,
                    minimumSize: Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChatHistoryItem(Map<String, String> chat) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(
          chat['prompt'] ?? 'Untitled Chat',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(chat['date'] ?? ''),
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: studentPrimaryColor.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.chat, color: studentPrimaryColor),
        ),
        onTap: () => _selectChat(chat['chatId'] ?? ''),
      ),
    );
  }

  Widget _buildEnhancedMessageInput() {
    return Container(
      padding: EdgeInsets.fromLTRB(16, 10, 16, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, -3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Attachment button
          Material(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(30),
            child: InkWell(
              onTap: _pickAttachment,
              borderRadius: BorderRadius.circular(30),
              child: Container(
                padding: EdgeInsets.all(10),
                child: Icon(
                  Icons.attach_file_rounded,
                  color: Colors.grey[600],
                  size: 22,
                ),
              ),
            ),
          ),

          // Text input field
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(24),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: 'Type your question here...',
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.fromLTRB(20, 10, 12, 10),
                      ),
                      maxLines: 5,
                      minLines: 1,
                      textCapitalization: TextCapitalization.sentences,
                    ),
                  ),

                  // Camera button
                  Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(30),
                    child: InkWell(
                      onTap: _takePicture,
                      borderRadius: BorderRadius.circular(30),
                      child: Container(
                        padding: EdgeInsets.all(10),
                        child: Icon(
                          Icons.camera_alt_rounded,
                          color: Colors.grey[600],
                          size: 22,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Send button
          SizedBox(width: 8),
          Material(
            color: studentPrimaryColor,
            borderRadius: BorderRadius.circular(30),
            child: InkWell(
              onTap: _sendMessage,
              borderRadius: BorderRadius.circular(30),
              child: Container(
                padding: EdgeInsets.all(10),
                child: Icon(
                  Icons.send_rounded,
                  color: Colors.white,
                  size: 22,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildCapabilityCards() {
    final capabilities = [
      {
        'icon': Icons.question_answer,
        'title': 'Answer questions',
        'color': Colors.blue
      },
      {
        'icon': Icons.calculate,
        'title': 'Solve problems',
        'color': Colors.green
      },
      {
        'icon': Icons.school,
        'title': 'Explain concepts',
        'color': Colors.amber
      },
      {
        'icon': Icons.fact_check,
        'title': 'Check facts',
        'color': Colors.purple
      },
    ];

    return capabilities.map((capability) {
      return Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                capability['icon'] as IconData,
                color: capability['color'] as Color,
                size: 28,
              ),
              const SizedBox(height: 8),
              Text(
                capability['title'] as String,
                textAlign: TextAlign.center,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      );
    }).toList();
  }
}
