import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import '../components/header.dart';
import '../components/footer.dart';
import '../components/chatSidebar.dart';
import 'dart:math';
import '../components/constants.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'dart:io';

class AiLanding extends StatefulWidget {
  @override
  State<AiLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<AiLanding>
    with SingleTickerProviderStateMixin {
  // Bot types (matching React implementation)
  static const BOT_TYPES = {
    "NORMAL": "normal",
    "CAREER": "career",
    "MATH": "math"
  };

  // Bot configurations
  final Map<String, Map<String, dynamic>> _botConfig = {
    "normal": {
      "name": "General Assistant",
      "greeting": "Hello, how can I assist you today?",
      "color": const Color(0xFF49ABB0),
      "icon": Icons.chat_bubble_outline,
    },
    "career": {
      "name": "Career Guide",
      "greeting":
          "Hi there! I'm your career guidance assistant. What career questions do you have?",
      "color": const Color(0xFFE195AB),
      "icon": Icons.work_outline,
    },
    "math": {
      "name": "Math Tutor",
      "greeting":
          "Welcome to math tutoring! Ask me any math problem or concept you'd like help with.",
      "color": const Color(0xFFFFA500),
      "icon": Icons.functions,
    }
  };

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

  // API related variables (updated to match React implementation)
  final String _baseUrl = "http://127.0.0.1:5000/api/chatbot";
  String _studentId = "student001"; // This should come from auth/storage
  String _selectedBotType = "normal"; // Default to normal bot

  List<Map<String, String>> _previousChats = [];
  List<dynamic> _fullChatData = [];
  Map<String, dynamic>? _selectedChat;

  // New variables to handle file upload
  File? _selectedFile;

  // Theme colors - keep as is
  final Color studentPrimaryColor = const Color.fromARGB(255, 73, 171, 176);
  final Color backgroundColor = const Color.fromARGB(255, 236, 231, 202);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = Colors.amber;

  // Chat capabilities - keep as is
  final List<Map<String, dynamic>> _capabilities = [
    {
      'icon': Icons.question_answer,
      'title': 'Answer questions',
      'color': Colors.blue
    },
    {
      'icon': Icons.calculate,
      'title': 'Solve math problems',
      'color': Colors.green
    },
    {
      'icon': Icons.functions,
      'title': 'Render equations',
      'color': Colors.amber
    },
    {'icon': Icons.fact_check, 'title': 'Check facts', 'color': Colors.purple},
  ];

  void _searchChats(String query) {
    // This would filter the previous chats based on the search query
    // For now, we're just printing it
    print('Search query: $query');
  }

  void _selectChat(String chatId) {
    if (chatId.isEmpty) return;
    _loadChat(chatId);
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

  // Image picker method
  Future<void> _pickAttachment() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.any,
      );

      if (result != null) {
        // Process the file - for now just show a success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('File selected: ${result.files.single.name}')),
        );
      }
    } catch (e) {
      print('Error picking attachment: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error selecting file. Please try again.')),
      );
    }
  }

  // ...existing code...

  // Load chat history from API or local storage
  Future<void> _loadChatHistory() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate some chat history data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay

      setState(() {
        _previousChats = [
          {
            'chatId': 'chat1',
            'title': 'Help with math homework',
            'date': '10 May 2025',
            'botType': 'math',
          },
          {
            'chatId': 'chat2',
            'title': 'Career options in tech',
            'date': '8 May 2025',
            'botType': 'career',
          },
          {
            'chatId': 'chat3',
            'title': 'General questions about chemistry',
            'date': '5 May 2025',
            'botType': 'normal',
          },
          {
            'chatId': 'chat4',
            'title': 'Calculus concepts',
            'date': '3 May 2025',
            'botType': 'math',
          },
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading chat history: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load chat history.')),
      );
    }
  }

  // Load a specific chat by ID
  Future<void> _loadChat(String chatId) async {
    setState(() {
      _isLoading = true;
    });

    try {
      // In a real app, this would be an API call to fetch chat details
      // For now, we'll simulate loading a chat
      await Future.delayed(
          Duration(milliseconds: 800)); // Simulate network delay

      // Find the chat from our local list
      final chatInfo = _previousChats.firstWhere(
        (chat) => chat['chatId'] == chatId,
        orElse: () =>
            {'chatId': chatId, 'title': 'Untitled Chat', 'botType': 'normal'},
      );

      // Generate some fake messages for this chat
      final List<dynamic> messages = [];

      // Add greeting message from bot
      messages.add({
        'sender': 'bot',
        'text': _botConfig[chatInfo['botType']]!['greeting'],
        'timestamp': DateTime.now().subtract(Duration(minutes: 10)).toString(),
      });

      // Add some sample messages based on chat title
      if (chatInfo['title']!.contains('math')) {
        messages.add({
          'sender': 'user',
          'text': 'Can you help me solve a quadratic equation?',
          'timestamp': DateTime.now().subtract(Duration(minutes: 9)).toString(),
        });
        messages.add({
          'sender': 'bot',
          'text': 'Of course! Please share the equation you need help with.',
          'timestamp': DateTime.now().subtract(Duration(minutes: 8)).toString(),
        });
      } else if (chatInfo['title']!.contains('career')) {
        messages.add({
          'sender': 'user',
          'text': 'What skills should I develop for a career in data science?',
          'timestamp': DateTime.now().subtract(Duration(minutes: 9)).toString(),
        });
        messages.add({
          'sender': 'bot',
          'text':
              'For a career in data science, you should develop skills in statistics, programming (Python/R), machine learning, and data visualization. Would you like more specific information?',
          'timestamp': DateTime.now().subtract(Duration(minutes: 8)).toString(),
        });
      } else {
        messages.add({
          'sender': 'user',
          'text': 'Hello, I have a question.',
          'timestamp': DateTime.now().subtract(Duration(minutes: 9)).toString(),
        });
        messages.add({
          'sender': 'bot',
          'text': 'I\'m here to help. What would you like to know?',
          'timestamp': DateTime.now().subtract(Duration(minutes: 8)).toString(),
        });
      }

      setState(() {
        _selectedChat = {
          'info': chatInfo,
          'messages': messages,
        };
        _isLoading = false;

        // Set the bot type to match the selected chat
        _changeBotType(chatInfo['botType'] ?? 'normal');
      });
    } catch (e) {
      print('Error loading chat: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load chat.')),
      );
    }
  }

  // Change the bot type
  void _changeBotType(String botType) {
    if (_botConfig.containsKey(botType)) {
      setState(() {
        _selectedBotType = botType;
      });
    }
  }

  // Create a new chat
  void _createNewChat() {
    final String chatId = 'new_chat_${DateTime.now().millisecondsSinceEpoch}';

    setState(() {
      _selectedChat = {
        'info': {
          'chatId': chatId,
          'title': 'New Conversation',
          'date': DateFormat('d MMM yyyy').format(DateTime.now()),
          'botType': _selectedBotType,
        },
        'messages': [
          {
            'sender': 'bot',
            'text': _botConfig[_selectedBotType]!['greeting'],
            'timestamp': DateTime.now().toString(),
          }
        ],
      };
    });
  }

  // Send a message
  void _sendMessage() {
    if (_messageController.text.trim().isEmpty && _selectedFile == null) return;

    final String messageText = _messageController.text.trim();
    _messageController.clear();

    // Create a new chat if none is selected
    if (_selectedChat == null) {
      _createNewChat();
    }

    // Add the user message
    setState(() {
      _selectedChat!['messages'].add({
        'sender': 'user',
        'text': messageText,
        'timestamp': DateTime.now().toString(),
        'file': _selectedFile?.path,
      });
      _isTyping = true;
      _selectedFile = null;
    });

    // Simulate bot response after a delay
    Future.delayed(Duration(seconds: 2), () {
      if (!mounted) return;

      // Generate response based on bot type
      String botResponse = '';

      if (_selectedBotType == BOT_TYPES['MATH']) {
        if (messageText.contains('solve') || messageText.contains('equation')) {
          botResponse =
              'To solve this equation, we need to isolate the variable. Let me work through the steps...';
        } else if (messageText.contains('derivative') ||
            messageText.contains('integral')) {
          botResponse =
              'Let me calculate this for you. When working with calculus problems...';
        } else {
          botResponse =
              'This math problem requires careful analysis. Here\'s how I would approach it...';
        }
      } else if (_selectedBotType == BOT_TYPES['CAREER']) {
        botResponse =
            'Based on current job market trends and your interests, I would recommend...';
      } else {
        botResponse =
            'I\'ve analyzed your question and here\'s what I found...';
      }

      setState(() {
        _selectedChat!['messages'].add({
          'sender': 'bot',
          'text': botResponse,
          'timestamp': DateTime.now().toString(),
        });
        _isTyping = false;
      });
    });
  }

  // Build the chat messages area
  Widget _buildChatMessages() {
    if (_selectedChat == null) return Container();

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: _selectedChat!['messages'].length,
      reverse: false,
      itemBuilder: (context, index) {
        final message = _selectedChat!['messages'][index];
        final bool isUser = message['sender'] == 'user';

        return Align(
          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            margin: EdgeInsets.only(
              top: 8,
              bottom: 8,
              left: isUser ? 64 : 0,
              right: isUser ? 0 : 64,
            ),
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isUser
                  ? _botConfig[_selectedBotType]!['color']
                  : Colors.grey[200],
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  message['text'],
                  style: TextStyle(
                    color: isUser ? Colors.white : Colors.black87,
                  ),
                ),
                if (message['file'] != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      'Attachment: ${message['file'].split('/').last}',
                      style: TextStyle(
                        fontSize: 12,
                        color: isUser ? Colors.white70 : Colors.black54,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  // Build typing indicator
  Widget _buildTypingIndicator() {
    return Positioned(
      bottom: 16,
      left: 16,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedBuilder(
              animation: _typingController,
              builder: (context, child) {
                return Row(
                  children: List.generate(3, (i) {
                    return Container(
                      margin: EdgeInsets.symmetric(horizontal: 2),
                      height: 8,
                      width: 8,
                      decoration: BoxDecoration(
                        color:
                            _botConfig[_selectedBotType]!['color'].withOpacity(
                          sin((_typingController.value * 2 * pi) + (i * pi / 2))
                                      .abs() *
                                  0.7 +
                              0.3,
                        ),
                        shape: BoxShape.circle,
                      ),
                    );
                  }),
                );
              },
            ),
            SizedBox(width: 8),
            Text(
              'Typing...',
              style: TextStyle(
                color: Colors.black54,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Build capability cards
  List<Widget> _buildCapabilityCards() {
    return _capabilities.map((capability) {
      return Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                capability['icon'],
                color: capability['color'],
                size: 28,
              ),
              SizedBox(height: 8),
              Text(
                capability['title'],
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }).toList();
  }

// ...existing code...

  // Camera method
  Future<void> _takePicture() async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(source: ImageSource.camera);

      if (image != null) {
        // Process the image - for now just show a success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Image captured: ${image.name}')),
        );
      }
    } catch (e) {
      print('Error taking picture: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error capturing image. Please try again.')),
      );
    }
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
                  color: _botConfig[_selectedBotType]!['color'],
                  child: Header(
                    onProfileTap: () {
                      Navigator.pushNamed(context, '/profile');
                    },
                    onNotificationTap: () {
                      Navigator.pushNamed(context, '/notifications');
                    },
                    profileImage: 'assets/images/image3.png',
                    welcomeText: _botConfig[_selectedBotType]!['name'],
                  ),
                ),

                // Bot type selector
                Container(
                  padding:
                      const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  color: backgroundColor,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _botConfig.entries.map((entry) {
                        final botType = entry.key;
                        final bot = entry.value;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            avatar: Icon(
                              bot['icon'],
                              color: _selectedBotType == botType
                                  ? Colors.white
                                  : bot['color'],
                              size: 18,
                            ),
                            label: Text(bot['name']),
                            selected: _selectedBotType == botType,
                            onSelected: (selected) {
                              if (selected) {
                                _changeBotType(botType);
                              }
                            },
                            selectedColor: bot['color'],
                            labelStyle: TextStyle(
                              color: _selectedBotType == botType
                                  ? Colors.white
                                  : Colors.black87,
                              fontWeight: _selectedBotType == botType
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
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

                // Selected file indicator
                if (_selectedFile != null)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    color: Colors.blue.withOpacity(0.1),
                    child: Row(
                      children: [
                        Icon(Icons.attach_file, color: Colors.blue, size: 16),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _selectedFile!.path.split('/').last,
                            style: TextStyle(fontSize: 12),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        IconButton(
                          icon: Icon(Icons.close, size: 16),
                          onPressed: () {
                            setState(() {
                              _selectedFile = null;
                            });
                          },
                          padding: EdgeInsets.zero,
                          constraints: BoxConstraints(),
                          color: Colors.red,
                        )
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

  Widget _buildWelcomeScreen() {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome message
            Card(
              margin: const EdgeInsets.only(bottom: 24),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _botConfig[_selectedBotType]!['icon'],
                          color: _botConfig[_selectedBotType]!['color'],
                          size: 24,
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _botConfig[_selectedBotType]!['name'],
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    Text(
                      _botConfig[_selectedBotType]!['greeting'],
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),

            // AI capabilities
            Text(
              'I can help with:',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              childAspectRatio: 1.5,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: _buildCapabilityCards(),
            ),

            // Suggestion chips
            SizedBox(height: 24),
            Text(
              'Try asking me:',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _getSuggestionChips(),
            ),

            const SizedBox(height: 24),

            if (_previousChats.isNotEmpty) ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Previous conversations:',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (_previousChats.length > 3)
                    TextButton(
                      onPressed: _toggleSidebar,
                      child: Text(
                        'View all',
                        style: TextStyle(
                            color: _botConfig[_selectedBotType]!['color']),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              _isLoading
                  ? Center(
                      child: CircularProgressIndicator(
                          color: _botConfig[_selectedBotType]!['color']))
                  : Column(
                      children: _previousChats
                          .take(3) // Show just a few recent chats
                          .map((chat) => _buildChatHistoryItem(chat))
                          .toList(),
                    ),
            ],
          ],
        ),
      ),
    );
  }

  List<Widget> _getSuggestionChips() {
    List<String> suggestions = [];

    // Provide different suggestions based on bot type
    if (_selectedBotType == BOT_TYPES['NORMAL']) {
      suggestions = [
        'What are the benefits of exercise?',
        'How does photosynthesis work?',
        'Can you explain quantum computing?',
        'What is climate change?'
      ];
    } else if (_selectedBotType == BOT_TYPES['CAREER']) {
      suggestions = [
        'What skills do I need for software engineering?',
        'How do I write a good resume?',
        'What careers are in high demand?',
        'Tips for job interviews'
      ];
    } else if (_selectedBotType == BOT_TYPES['MATH']) {
      suggestions = [
        'Solve x^2 - 5x + 6 = 0',
        'What is the derivative of ln(x)?',
        'Calculate the integral of sin(x)',
        'Explain the Pythagorean theorem'
      ];
    }

    return suggestions
        .map((suggestion) => ActionChip(
              label: Text(suggestion),
              onPressed: () {
                _messageController.text = suggestion;
                _sendMessage();
              },
            ))
        .toList();
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
                color: _botConfig[_selectedBotType]!['color'],
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
                            color: _botConfig[_selectedBotType]!['color']))
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
                    backgroundColor: _botConfig[_selectedBotType]!['color'],
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
    // Get the bot type from chat
    String botType = chat['botType'] ?? 'normal';

    // Use the correct color based on bot type
    Color avatarColor = _botConfig[botType]!['color'];
    IconData avatarIcon = _botConfig[botType]!['icon'];

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(
          chat['title'] ?? 'Untitled Chat',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(chat['date'] ?? ''),
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: avatarColor.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(avatarIcon, color: avatarColor),
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
                      onSubmitted: (text) {
                        if (text.trim().isNotEmpty) {
                          _sendMessage();
                        }
                      },
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
            color: _botConfig[_selectedBotType]!['color'],
            borderRadius: BorderRadius.circular(30),
            child: InkWell(
              onTap: _sendMessage, // Remove conditional check to fix sending
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
}
